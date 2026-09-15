function validUrl(value) {
  if (typeof value !== 'string' || /[\s\\\u0000-\u001f\u007f]/.test(value)) return false;
  if (/^\/(?!\/)/.test(value)) return true;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && !!url.hostname && !url.username && !url.password;
  } catch { return false; }
}
function publicFilter(now = new Date()) {
  return { status: 'active', $and: [
    { $or: [{ publish_date: null }, { publish_date: { $lte: now } }] },
    { $or: [{ expiry_date: null }, { expiry_date: { $gte: now } }] }
  ] };
}
module.exports = { validUrl, publicFilter };
