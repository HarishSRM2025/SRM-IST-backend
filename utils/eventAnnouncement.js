const Announcement = require('../models/announcement');
async function syncEvent(event, module, ownerField) {
  if (!event) return;
  const filter = { module, event_id: event._id, source_type: 'event' };
  if (!event.announcement) { await Announcement.deleteOne(filter); return; }
  await Announcement.findOneAndUpdate(filter, { $set: {
    title: event.name, module, school_or_institution_id: event[ownerField],
    announcement_category_id: null, url: `/event/${event._id}`,
    source_type: 'event', event_id: event._id, status: 'active',
    publish_date: null, expiry_date: null
  }, $setOnInsert: { created_at: event.createdAt || new Date() } }, { upsert: true, runValidators: true });
}
function eventAnnouncementPlugin(schema, { module, ownerField }) {
  schema.post('save', async function(doc) { await syncEvent(doc, module, ownerField); });
  schema.post('findOneAndUpdate', async function() {
    await syncEvent(await this.model.findOne(this.getFilter()), module, ownerField);
  });
  schema.post('findOneAndDelete', async function(doc) {
    if (doc) await Announcement.deleteOne({ module, event_id: doc._id, source_type: 'event' });
  });
}
async function backfillEventAnnouncements() {
  const sources = [
    [require('../models/institution/eventsAndActivities'), 'institution', 'institutionId'],
    [require('../models/schools/eventsAndActivities'), 'schools', 'school'],
    [require('../models/schoolDivision/eventsAndActivities'), 'school-division', 'schoolDivisionId']
  ];
  await Announcement.init();
  await require('../models/announcementCategory').init();
  for (const [Model, module, field] of sources) {
    const liveIds = [];
    for await (const event of Model.find({ announcement: true }).cursor()) {
      await syncEvent(event, module, field);
      liveIds.push(event._id);
    }
    await Announcement.deleteMany({ module, source_type: 'event', event_id: { $nin: liveIds } });
  }
}
module.exports = { syncEvent, eventAnnouncementPlugin, backfillEventAnnouncements };
