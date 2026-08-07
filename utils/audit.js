const AuditLog = require('../models/auth/auditLog');

async function logAudit({ userId, action, modulePage }) {
  if (!userId || !action || !modulePage) return;
  await AuditLog.create({ userId, action, modulePage });
}

function auditRequest(req, res, modulePage) {
  if (!req?.coordinator?._id) return () => {};
  const method = String(req.method || '').toUpperCase();
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) return () => {};
  const safePage = modulePage || `${req.baseUrl || ''}${req.path || ''}`.trim();
  return () => {
    if (!resStatusIsSuccess(res?.statusCode)) return;
    if (String(req.originalUrl || '').includes('/auth/audit-logs')) return;
    const verb = method === 'POST' ? 'added' : method === 'PUT' || method === 'PATCH' ? 'updated' : 'deleted';
    const target = extractTargetLabel(req);
    logAudit({
      userId: req.coordinator._id,
      action: `${req.coordinator.username || 'User'} ${verb} ${target}`,
      modulePage: safePage,
    }).catch(() => {});
  };
}

function resStatusIsSuccess(statusCode) {
  return Number(statusCode) >= 200 && Number(statusCode) < 300;
}

function extractTargetLabel(req) {
  const route = String(req.route?.path || req.path || '').toLowerCase();
  if (route.includes('faculty')) return 'faculty item';
  if (route.includes('school-division') || route.includes('division')) return 'school division';
  if (route.includes('school')) return 'school';
  if (route.includes('institution')) return 'institution';
  if (route.includes('research')) return 'research item';
  if (route.includes('programme')) return 'programme';
  if (route.includes('activity')) return 'activity item';
  if (route.includes('testimonial')) return 'testimonial';
  if (route.includes('slider')) return 'slider';
  if (route.includes('career')) return 'career item';
  if (route.includes('about')) return 'about content';
  return 'item';
}

module.exports = { logAudit, auditRequest };
