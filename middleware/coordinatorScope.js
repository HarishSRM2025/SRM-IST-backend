const User = require('../models/auth/user');
const School = require('../models/schools/schools');
const SchoolDivision = require('../models/schoolDivision/schoolsDivision');
const { auditRequest } = require('../utils/audit');

async function resolveCoordinator(req) {
  const userId = req.headers['x-user-id'];
  if (!userId) return null;
  const user = await User.findById(userId);
  if (!user || user.role !== 'coordinator' || user.status === 'inactive') return null;
  return user;
}

function parseId(value) {
  if (!value) return null;
  if (typeof value === 'object') return String(value._id || value.id || '');
  return String(value);
}

async function canAccessSchool(user, schoolId) {
  if (!schoolId) return false;
  const school = await School.findById(schoolId);
  if (!school) return false;
  return String(school.institutionId) === String(user.instituteId);
}

async function canAccessDivision(user, divisionId) {
  if (!divisionId) return false;
  const division = await SchoolDivision.findById(divisionId);
  if (!division) return false;
  const school = await School.findById(division.schoolId);
  if (!school) return false;
  return String(school.institutionId) === String(user.instituteId) && String(school._id) === String(user.schoolId || school._id) && String(division.schoolId) === String(user.schoolId);
}

function coordinatorHeaders(req, user) {
  return {
    role: user.role,
    mappingLevel: user.mappingLevel || '',
    instituteId: String(user.instituteId || ''),
    schoolId: String(user.schoolId || ''),
    divisionId: String(user.divisionId || ''),
  };
}

async function requireCoordinatorScope(req, res, next) {
  const user = await resolveCoordinator(req);
  if (!user) return next();
  req.coordinator = user;
  req.coordinatorScope = coordinatorHeaders(req, user);
  const finishAudit = auditRequest(req, res);
  res.on('finish', finishAudit);
  next();
}

async function restrictByCoordinatorList(req, res, next) {
  const user = await resolveCoordinator(req);
  if (!user) return next();
  req.coordinator = user;
  req.coordinatorScope = coordinatorHeaders(req, user);
  const finishAudit = auditRequest(req, res);
  res.on('finish', finishAudit);
  next();
}

function assertBodyScope(user, body) {
  const mapping = String(user.mappingLevel || '').toLowerCase();
  const instituteId = parseId(body.institution || body.instituteId);
  const schoolId = parseId(body.school || body.schoolId);
  const divisionId = parseId(body.schoolDivision || body.divisionId);

  if (mapping === 'institute') {
    return instituteId && String(instituteId) === String(user.instituteId);
  }
  if (mapping === 'school') {
    return instituteId && String(instituteId) === String(user.instituteId) && schoolId && String(schoolId) === String(user.schoolId);
  }
  if (mapping === 'division') {
    return instituteId && String(instituteId) === String(user.instituteId) && schoolId && String(schoolId) === String(user.schoolId) && divisionId && String(divisionId) === String(user.divisionId);
  }
  return true;
}

module.exports = {
  requireCoordinatorScope,
  restrictByCoordinatorList,
  resolveCoordinator,
  assertBodyScope,
  canAccessSchool,
  canAccessDivision,
};
