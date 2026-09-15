const router = require('express').Router();
const mongoose = require('mongoose');
const Announcement = require('../models/announcement');
const Category = require('../models/announcementCategory');
const Institution = require('../models/institution/institution');
const School = require('../models/schools/schools');
const SchoolDivision = require('../models/schoolDivision/schoolsDivision');
const { publicFilter } = require('../utils/announcementRules');
const wrap = fn => async (req, res, next) => {
  try { await fn(req, res); } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'A category with that name already exists.' });
    if (['ValidationError', 'CastError'].includes(err.name)) return res.status(400).json({ message: err.message });
    next(err);
  }
};
const fail = (message, status = 400) => Object.assign(new Error(message), { status });
router.get('/public', wrap(async (req, res) => {
  const rows = await Announcement.find(publicFilter()).sort({ created_at: -1, _id: -1 }).lean();
  const categories = await Category.find({ status: 'active', _id: { $in: rows.map(a => a.announcement_category_id).filter(Boolean) } }).sort({ name: 1 }).lean();
  const visible = new Set(categories.map(c => String(c._id)));
  res.json({ marquee: rows.filter(a => a.source_type === 'event' || !a.announcement_category_id).slice(0, 3), categories,
    announcements: rows.filter(a => a.announcement_category_id && visible.has(String(a.announcement_category_id))) });
}));
router.use((req, res, next) => {
  if (!req.currentUser) return res.status(401).json({ message: 'Sign in to manage announcements.' });
  if (!['admin', 'superadmin', 'coordinator'].includes(req.currentUser.role)) return res.status(403).json({ message: 'Access denied.' });
  next();
});
async function ownerFilter(req) {
  const module = req.query.module;
  if (!['institution', 'schools', 'school-division'].includes(module)) throw fail('Select Institution, School or School Division.');
  const user = req.coordinator;
  let owners;
  if (module === 'institution') owners = await Institution.find(user ? { _id: user.instituteId } : {}).select('_id name');
  else if (module === 'schools') owners = await School.find(user ? { institutionId: user.instituteId, ...(user.schoolId ? { _id: user.schoolId } : {}) } : {}).select('_id name');
  else {
    let scope = {};
    if (user) {
      const schools = await School.find({ institutionId: user.instituteId, ...(user.schoolId ? { _id: user.schoolId } : {}) }).select('_id');
      scope = { schoolId: { $in: schools.map(school => school._id) }, ...(user.divisionId ? { _id: user.divisionId } : {}) };
    }
    owners = await SchoolDivision.find(scope).select('_id name');
  }
  return { module, owners, filter: { module, school_or_institution_id: { $in: owners.map(o => o._id) } } };
}
router.get('/owners', wrap(async (req, res) => res.json((await ownerFilter(req)).owners)));
router.get('/categories', wrap(async (req, res) => res.json(await Category.find().sort({ name: 1 }))));
router.post('/categories', wrap(async (req, res) => res.status(201).json(await Category.create({ name: req.body.name, status: req.body.status }))));
router.put('/categories/:id', wrap(async (req, res) => {
  const row = await Category.findByIdAndUpdate(req.params.id, { name: req.body.name, status: req.body.status }, { new: true, runValidators: true });
  if (!row) return res.status(404).json({ message: 'Category not found.' });
  res.json(row);
}));
router.delete('/categories/:id', wrap(async (req, res) => {
  if (await Announcement.exists({ announcement_category_id: req.params.id })) return res.status(409).json({ message: 'Reassign or remove announcements in this category before deleting it.' });
  const row = await Category.findByIdAndDelete(req.params.id);
  if (!row) return res.status(404).json({ message: 'Category not found.' });
  res.json({ message: 'Category deleted.' });
}));
router.get('/', wrap(async (req, res) => res.json(await Announcement.find((await ownerFilter(req)).filter).sort({ created_at: -1 }))));
async function payload(req, owners, module) {
  const body = req.body;
  if (!owners.some(o => String(o._id) === body.school_or_institution_id)) throw fail('Select a School Type within your module and access scope.', 403);
  if (body.announcement_type && !['marquee', 'category'].includes(body.announcement_type)) throw fail('Select a valid announcement type.');
  const categoryId = body.announcement_type === 'marquee' ? null : body.announcement_category_id || null;
  if (body.announcement_type === 'category' && !categoryId) throw fail('Select an announcement category.');
  if (categoryId && (!mongoose.isValidObjectId(categoryId) || !await Category.exists({ _id: categoryId }))) throw fail('Category not found.');
  const publish = body.publish_date ? new Date(body.publish_date) : null;
  const expiry = body.expiry_date ? new Date(body.expiry_date) : null;
  if (!publish || !Number.isFinite(+publish)) throw fail('Provide a valid publish date.');
  if (expiry && (!Number.isFinite(+expiry) || expiry < publish)) throw fail('Expiry must be a valid date on or after publish.');
  return { title: body.title, module, school_or_institution_id: body.school_or_institution_id,
    announcement_category_id: categoryId, url: body.url, status: body.status,
    publish_date: publish, expiry_date: expiry, source_type: 'announcement', event_id: null };
}
router.post('/', wrap(async (req, res) => {
  const { owners, module } = await ownerFilter(req);
  res.status(201).json(await Announcement.create(await payload(req, owners, module)));
}));
router.put('/:id', wrap(async (req, res) => {
  const { owners, module, filter } = await ownerFilter(req);
  const row = await Announcement.findOne({ ...filter, _id: req.params.id, source_type: 'announcement' });
  if (!row) return res.status(404).json({ message: 'Announcement not found. Event announcements must be managed in Events.' });
  Object.assign(row, await payload(req, owners, module)); await row.save(); res.json(row);
}));
router.delete('/:id', wrap(async (req, res) => {
  const { filter } = await ownerFilter(req);
  const row = await Announcement.findOneAndDelete({ ...filter, _id: req.params.id, source_type: 'announcement' });
  if (!row) return res.status(404).json({ message: 'Announcement not found. Event announcements must be managed in Events.' });
  res.json({ message: 'Announcement deleted.' });
}));
router.use((err, req, res, next) => { if (err.status) return res.status(err.status).json({ message: err.message }); next(err); });
module.exports = router;
