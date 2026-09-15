const mongoose = require('mongoose');
const { validUrl } = require('../utils/announcementRules');
const schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 500 },
  module: { type: String, enum: ['institution', 'schools', 'school-division'], required: true },
  school_or_institution_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  announcement_category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'AnnouncementCategory', default: null },
  url: { type: String, required: true, trim: true, validate: { validator: validUrl, message: 'Enter an HTTP(S) URL or a local path starting with /.' } },
  source_type: { type: String, enum: ['announcement', 'event'], default: 'announcement' },
  announcement_type: { type: String, enum: ['marquee', 'category', 'both'] },
  event_id: { type: mongoose.Schema.Types.ObjectId, default: null },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  publish_date: { type: Date, default: null },
  expiry_date: { type: Date, default: null }
}, { collection: 'announcements', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
schema.index({ module: 1, event_id: 1 }, { unique: true, partialFilterExpression: { source_type: 'event' } });
schema.index({ status: 1, announcement_category_id: 1, publish_date: -1 });
module.exports = mongoose.model('Announcement', schema);
