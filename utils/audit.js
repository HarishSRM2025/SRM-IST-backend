const AuditLog = require('../models/auth/auditLog');

async function logAudit({ userId, action, modulePage }) {
  if (!userId || !action || !modulePage) return;
  await AuditLog.create({ userId, action, modulePage });
}

function auditRequest(req, res, modulePage) {
  const user = req.currentUser || req.coordinator || req.user;
  if (!user?._id) return () => {};

  const method = String(req.method || '').toUpperCase();
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) return () => {};

  const safePage = modulePage || extractModulePage(req);

  return () => {
    if (!resStatusIsSuccess(res?.statusCode)) return;
    const url = String(req.originalUrl || req.baseUrl || req.path || '');
    if (url.includes('/auth/audit-logs') || url.includes('/auth/signin')) return;

    const verb = method === 'POST' ? 'added' : (method === 'PUT' || method === 'PATCH') ? 'updated' : 'deleted';
    const target = extractTargetLabel(req);
    const userIdentifier = user.username || user.email || user.role || 'User';

    logAudit({
      userId: user._id,
      action: `${userIdentifier} ${verb} ${target}`,
      modulePage: safePage,
    }).catch((err) => {
      console.error('Audit log creation failed:', err);
    });
  };
}

function resStatusIsSuccess(statusCode) {
  return Number(statusCode) >= 200 && Number(statusCode) < 300;
}

function extractModulePage(req) {
  const route = String(req.originalUrl || req.baseUrl || req.path || '').toLowerCase();
  if (route.includes('school-division') || route.includes('schooldivision')) return 'school division';
  if (route.includes('faculty')) return 'faculty';
  if (route.includes('school')) return 'school';
  if (route.includes('institution')) return 'institution';
  if (route.includes('research')) return 'research item';
  if (route.includes('programme')) return 'programme';
  if (route.includes('activity')) return 'activity item';
  if (route.includes('testimonial') || route.includes('student')) return 'testimonial';
  if (route.includes('slider')) return 'slider';
  if (route.includes('career')) return 'career item';
  if (route.includes('about')) return 'about content';
  return 'general module';
}

function extractTargetLabel(req) {
  const route = String(req.originalUrl || req.baseUrl || req.path || '').toLowerCase();
  if (route.includes('faculty')) return 'faculty item';
  if (route.includes('school-division') || route.includes('schooldivision')) return 'school division';
  if (route.includes('school')) return 'school';
  if (route.includes('institution')) return 'institution';
  if (route.includes('research')) return 'research item';
  if (route.includes('programme')) return 'programme';
  if (route.includes('activity')) return 'activity item';
  if (route.includes('testimonial') || route.includes('student')) return 'testimonial';
  if (route.includes('slider')) return 'slider';
  if (route.includes('career')) return 'career item';
  if (route.includes('about')) return 'about content';
  return 'item';
}

module.exports = { logAudit, auditRequest };
