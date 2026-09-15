const { test, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { mock } = require('node:test');
const express = require('express');
const mongoose = require('mongoose');
const Announcement = require('../models/announcement');
const Category = require('../models/announcementCategory');
const Institution = require('../models/institution/institution');
const School = require('../models/schools/schools');
const { validUrl, publicFilter } = require('../utils/announcementRules');
const { syncEvent } = require('../utils/eventAnnouncement');
const router = require('../route/announcements');
const id = () => new mongoose.Types.ObjectId();
afterEach(() => mock.restoreAll());

async function api(user, run) {
  const app = express();
  app.use(express.json());
  app.use((req, res, next) => { req.currentUser = user; if (user?.role === 'coordinator') req.coordinator = user; next(); });
  app.use('/announcements', router);
  app.use((err, req, res, next) => res.status(500).json({ message: err.message }));
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const request = async (path, method = 'GET', body) => {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/announcements${path}`, {
      method, headers: { 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {})
    });
    return { status: response.status, body: await response.json() };
  };
  try { await run(request); } finally { await new Promise(resolve => server.close(resolve)); }
}

test('URLs accept web links and local routes and reject unsafe or malformed values', () => {
  for (const url of ['https://example.com/apply?q=1', 'http://example.com', '/event/123', '/admission']) assert.equal(validUrl(url), true, url);
  for (const url of ['', 'javascript:alert(1)', 'data:text/html,x', '//evil.test', '/\\evil.test', 'ftp://example.com', 'https://', 'example.com', '/bad path', '/bad\0path', 'https://user:pass@example.com']) assert.equal(validUrl(url), false, url);
});

test('announcement schema enforces required fields, statuses, URLs and source defaults', async () => {
  const row = new Announcement({ title: 'Admissions', module: 'institution', school_or_institution_id: id(), url: '/admission' });
  await row.validate();
  assert.equal(row.source_type, 'announcement');
  assert.equal(row.announcement_category_id, null);
  row.url = 'javascript:alert(1)';
  await assert.rejects(row.validate(), /url/);
  row.url = '/admission'; row.status = 'completed';
  await assert.rejects(row.validate(), /status/);
});

test('publication query includes start and expiry boundaries and excludes inactive records', () => {
  const now = new Date('2026-09-15T12:00:00Z');
  const filter = publicFilter(now);
  assert.equal(filter.status, 'active');
  assert.equal(filter.$and[0].$or[1].publish_date.$lte, now);
  assert.equal(filter.$and[1].$or[1].expiry_date.$gte, now);
  assert.equal(filter.$and[0].$or[0].publish_date, null);
});

for (const [path, module, field] of [
  ['institution', 'institution', 'institutionId'], ['schools', 'schools', 'school'], ['schoolDivision', 'school-division', 'schoolDivisionId']
]) test(`${module}: event create, update, unmark and delete synchronize announcement records`, async () => {
  const Model = require(`../models/${path}/eventsAndActivities`);
  let stored;
  const writes = [];
  const removes = [];
  mock.method(Announcement, 'findOneAndUpdate', async (filter, update) => { writes.push({ filter, update }); });
  mock.method(Announcement, 'deleteOne', async filter => { removes.push(filter); });
  mock.method(Model.collection, 'insertOne', async doc => { stored = doc; return { insertedId: doc._id }; });
  mock.method(Model.collection, 'findOneAndUpdate', async (filter, update) => { Object.assign(stored, update.$set); return stored; });
  mock.method(Model.collection, 'findOne', async () => stored);
  mock.method(Model.collection, 'findOneAndDelete', async () => stored);
  const event = await Model.create({ [field]: id(), name: 'Seminar', description: 'Details', eventDateTime: '2026-10-01', location: 'Campus', type: 'seminar', announcement: true });
  assert.equal(writes.length, 1);
  assert.equal(writes[0].update.$set.url, `/event/${event._id}`);
  assert.equal(writes[0].update.$set.source_type, 'event');
  assert.equal(String(writes[0].update.$set.school_or_institution_id), String(event[field]));
  await Model.findByIdAndUpdate(event._id, { name: 'Updated seminar' }, { new: true });
  assert.equal(writes.at(-1).update.$set.title, 'Updated seminar');
  await Model.findByIdAndUpdate(event._id, { announcement: false }, { new: true });
  assert.equal(removes.length, 1);
  await Model.findByIdAndDelete(event._id);
  assert.equal(removes.length, 2);
  assert.equal(String(removes[1].event_id), String(event._id));
});

test('repeated event sync uses the same unique event identity', async () => {
  const writes = [];
  mock.method(Announcement, 'findOneAndUpdate', async (filter, update, options) => writes.push({ filter, options }));
  const event = { _id: id(), school: id(), name: 'Event', announcement: true };
  await syncEvent(event, 'schools', 'school'); await syncEvent(event, 'schools', 'school');
  assert.deepEqual(writes[0].filter, writes[1].filter);
  assert.equal(writes[0].options.upsert, true);
});

test('public feed caps marquee at three, keeps categories separate and hides inactive categories', async () => {
  const cat = id(), hidden = id();
  const rows = [
    { _id: id(), title: 'Categorized', announcement_category_id: cat, source_type: 'announcement', url: '/apply' },
    { _id: id(), title: 'Inactive category', announcement_category_id: hidden, source_type: 'announcement', url: '/hidden' },
    ...Array.from({ length: 4 }, (_, i) => ({ _id: id(), title: `Marquee ${i}`, source_type: i === 0 ? 'event' : 'announcement', announcement_category_id: null, url: '/event/1' }))
  ];
  mock.method(Announcement, 'find', filter => {
    assert.equal(filter.status, 'active');
    return { sort: () => ({ lean: async () => rows }) };
  });
  mock.method(Category, 'find', filter => {
    assert.equal(filter.status, 'active');
    assert.deepEqual(filter._id.$in, [cat, hidden]);
    return { sort: () => ({ lean: async () => [{ _id: cat, name: 'Admissions' }] }) };
  });
  await api(null, async request => {
    const result = await request('/public');
    assert.equal(result.status, 200);
    assert.equal(result.body.marquee.length, 3);
    assert.equal(result.body.marquee[0].source_type, 'event');
    assert.equal(result.body.announcements.length, 1);
    assert.equal(result.body.categories.length, 1);
  });
});

test('management requires sign-in and an allowed role', async () => {
  await api(null, async request => assert.equal((await request('/categories')).status, 401));
  await api({ role: 'user' }, async request => assert.equal((await request('/categories')).status, 403));
});

test('announcement create validates module, owner scope, dates and URL and forces manual source', async () => {
  const owner = id();
  mock.method(Institution, 'find', () => ({ select: async () => [{ _id: owner, name: 'Institution' }] }));
  mock.method(Announcement, 'create', async body => { const row = new Announcement(body); await row.validate(); return row; });
  const body = { title: 'Apply', school_or_institution_id: String(owner), url: '/apply', publish_date: '2026-09-15', expiry_date: '2026-09-16', source_type: 'event', event_id: String(id()) };
  await api({ role: 'admin' }, async request => {
    const valid = await request('/?module=institution', 'POST', body);
    assert.equal(valid.status, 201);
    assert.equal(valid.body.source_type, 'announcement'); assert.equal(valid.body.event_id, null);
    const marquee = await request('/?module=institution', 'POST', { ...body, expiry_date: null, announcement_type: 'marquee', announcement_category_id: String(id()) });
    assert.equal(marquee.status, 201);
    assert.equal(marquee.body.expiry_date, null);
    assert.equal(marquee.body.announcement_category_id, null);
    assert.equal((await request('/?module=institution', 'POST', { ...body, announcement_type: 'category', announcement_category_id: null })).status, 400);
    assert.equal((await request('/?module=institution', 'POST', { ...body, publish_date: '' })).status, 400);

    assert.equal((await request('/?module=invalid', 'POST', body)).status, 400);
    assert.equal((await request('/?module=institution', 'POST', { ...body, school_or_institution_id: String(id()) })).status, 403);
    assert.equal((await request('/?module=institution', 'POST', { ...body, expiry_date: '2026-09-14' })).status, 400);
    assert.equal((await request('/?module=institution', 'POST', { ...body, url: 'javascript:alert(1)' })).status, 400);
  });
});

test('coordinator school options are scoped to the assigned institution and school', async () => {
  const user = { role: 'coordinator', instituteId: id(), schoolId: id() };
  mock.method(School, 'find', filter => {
    assert.deepEqual(filter, { institutionId: user.instituteId, _id: user.schoolId });
    return { select: async () => [{ _id: user.schoolId, name: 'School' }] };
  });
  await api(user, async request => assert.equal((await request('/owners?module=schools')).body.length, 1));
});

test('category CRUD validates names/status and prevents deleting categories in use', async () => {
  const categoryId = id();
  mock.method(Category, 'create', async body => { const row = new Category(body); await row.validate(); return row; });
  mock.method(Category, 'findByIdAndUpdate', async (key, body) => { const row = new Category({ _id: key, ...body }); await row.validate(); return row; });
  let inUse = true;
  mock.method(Announcement, 'exists', async () => inUse);
  mock.method(Category, 'findByIdAndDelete', async () => ({ _id: categoryId }));
  await api({ role: 'admin' }, async request => {
    assert.equal((await request('/categories', 'POST', { name: 'Admissions', status: 'active' })).status, 201);
    assert.equal((await request('/categories', 'POST', { name: ' ', status: 'active' })).status, 400);
    assert.equal((await request(`/categories/${categoryId}`, 'PUT', { name: 'Applications', status: 'inactive' })).body.status, 'inactive');
    assert.equal((await request(`/categories/${categoryId}`, 'DELETE')).status, 409);
    inUse = false;
    assert.equal((await request(`/categories/${categoryId}`, 'DELETE')).status, 200);
  });
});

test('announcement update/delete are scoped and cannot mutate event-owned records', async () => {
  const owner = id(), record = id();
  mock.method(Institution, 'find', () => ({ select: async () => [{ _id: owner }] }));
  for (const method of ['findOne', 'findOneAndDelete']) mock.method(Announcement, method, async filter => {
    assert.equal(filter.source_type, 'announcement');
    assert.equal(filter.module, 'institution');
    assert.deepEqual(filter.school_or_institution_id.$in, [owner]);
    return null;
  });
  await api({ role: 'admin' }, async request => {
    assert.equal((await request(`/${record}?module=institution`, 'PUT', {})).status, 404);
    assert.equal((await request(`/${record}?module=institution`, 'DELETE')).status, 404);
  });
});

test('manual announcements can change category/URL and be deleted', async () => {
  const owner = id(), categoryId = id(), record = id();
  const row = new Announcement({ _id: record, title: 'Original', module: 'schools', school_or_institution_id: owner, url: '/original' });
  mock.method(School, 'find', () => ({ select: async () => [{ _id: owner }] }));
  mock.method(Category, 'exists', async () => ({ _id: categoryId }));
  mock.method(Announcement, 'findOne', async () => row);
  mock.method(row, 'save', async () => { await row.validate(); return row; });
  mock.method(Announcement, 'findOneAndDelete', async () => row);
  await api({ role: 'admin' }, async request => {
    const updated = await request(`/${record}?module=schools`, 'PUT', {
      title: 'Updated', school_or_institution_id: String(owner), announcement_category_id: String(categoryId),
      url: 'https://example.com/apply', status: 'inactive', publish_date: '2026-09-15', expiry_date: '2026-09-16'
    });
    assert.equal(updated.status, 200);
    assert.equal(updated.body.announcement_category_id, String(categoryId));
    assert.equal(updated.body.url, 'https://example.com/apply');
    assert.equal(updated.body.status, 'inactive');
    assert.equal((await request(`/${record}?module=schools`, 'DELETE')).status, 200);
  });
});

test('division announcements use division owners and enforce coordinator scope', async () => {
  const Division = require('../models/schoolDivision/schoolsDivision');
  const instituteId = id(), schoolId = id(), divisionId = id();
  mock.method(School, 'find', filter => {
    assert.deepEqual(filter, { institutionId: instituteId, _id: schoolId });
    return { select: async () => [{ _id: schoolId }] };
  });
  mock.method(Division, 'find', filter => {
    assert.deepEqual(filter, { schoolId: { $in: [schoolId] }, _id: divisionId });
    return { select: async () => [{ _id: divisionId, name: 'Computer Science Division' }] };
  });
  mock.method(Announcement, 'create', async body => { const row = new Announcement(body); await row.validate(); return row; });
  await api({ role: 'coordinator', instituteId, schoolId, divisionId }, async request => {
    const options = await request('/owners?module=school-division');
    assert.equal(options.status, 200);
    assert.equal(options.body[0]._id, String(divisionId));
    const body = { title: 'Division update', school_or_institution_id: String(divisionId), announcement_type: 'marquee', url: '/admission', publish_date: '2026-09-15' };
    const created = await request('/?module=school-division', 'POST', body);
    assert.equal(created.status, 201);
    assert.equal(created.body.module, 'school-division');
    assert.equal(created.body.school_or_institution_id, String(divisionId));
    assert.equal((await request('/?module=school-division', 'POST', { ...body, school_or_institution_id: String(schoolId) })).status, 403);
  });
});

test('admin division dropdown lists divisions without coordinator restrictions', async () => {
  const Division = require('../models/schoolDivision/schoolsDivision');
  mock.method(Division, 'find', filter => {
    assert.deepEqual(filter, {});
    return { select: async () => [{ _id: id(), name: 'Division A' }, { _id: id(), name: 'Division B' }] };
  });
  await api({ role: 'admin' }, async request => {
    const result = await request('/owners?module=school-division');
    assert.equal(result.status, 200);
    assert.equal(result.body.length, 2);
  });
});

test('Both announcements are included in marquee and category links without duplicate records', async () => {
  const categoryId = id();
  const row = { _id: id(), title: 'Both displays', announcement_category_id: categoryId, announcement_type: 'both', source_type: 'announcement', url: '/apply' };
  mock.method(Announcement, 'find', () => ({ sort: () => ({ lean: async () => [row] }) }));
  mock.method(Category, 'find', () => ({ sort: () => ({ lean: async () => [{ _id: categoryId, name: 'Admissions' }] }) }));
  await api(null, async request => {
    const result = await request('/public');
    assert.equal(result.body.marquee[0]._id, String(row._id));
    assert.equal(result.body.announcements[0]._id, String(row._id));
  });
});

test('Both requires a category and persists through manual announcement create', async () => {
  const owner = id(), categoryId = id();
  mock.method(Institution, 'find', () => ({ select: async () => [{ _id: owner }] }));
  mock.method(Category, 'exists', async () => ({ _id: categoryId }));
  mock.method(Announcement, 'create', async body => { const row = new Announcement(body); await row.validate(); return row; });
  await api({ role: 'admin' }, async request => {
    const body = { title: 'Both displays', school_or_institution_id: String(owner), announcement_type: 'both', url: '/apply', publish_date: '2026-09-15' };
    assert.equal((await request('/?module=institution', 'POST', body)).status, 400);
    const result = await request('/?module=institution', 'POST', { ...body, announcement_category_id: String(categoryId) });
    assert.equal(result.status, 201);
    assert.equal(result.body.announcement_type, 'both');
    assert.equal(result.body.announcement_category_id, String(categoryId));
  });
});
