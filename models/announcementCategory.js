const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 150 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { collection: 'announcement_categories', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
schema.index({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });
module.exports = mongoose.model('AnnouncementCategory', schema);
