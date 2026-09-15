# Announcement management

## Deployment

Deploy the backend, Admin Panel and frontend changes together. On backend startup,
the database connection completes before requests are accepted. The announcement
collections and indexes are initialized, and existing flagged events are copied
into announcement records. This backfill is idempotent: each event has one unique
record per source module. It also removes stale event announcement records.
Existing event documents remain in their original collections.

The project uses MongoDB. The requested tables are implemented as collections
named `announcement_categories` and `announcements`. MongoDB supplies `_id` as
the primary key. Both collections use `created_at` and `updated_at` timestamps.
Announcements also contain `module`, which distinguishes Institution, School,
and legacy School Division event references.

## Admin Panel

- Institution → Announcement: `/institution/announcement`
- Schools → Announcement: `/schools/announcement`
- Categories are shared across both modules and managed at the top of the page.
- A category in use cannot be deleted until its announcements are reassigned or
  removed. Deactivating it hides its category and announcements from the frontend.
- Announcement owner options come from the database and respect the existing
  coordinator institution/school scope.
- Manual announcements require a title, owner, valid HTTP(S) URL or root-relative
  site path, publish date, expiry date and Active/Inactive status.
- Date/time inputs use the administrator's local time and are stored as UTC.
- Event announcements are shown read-only here; use Events to change them.

## Public behavior

`GET /api/announcements/public` returns `marquee`, `categories`, and categorized
`announcements`. Only active records within their publish/expiry window appear.
The dates are inclusive. Event-derived records keep the existing behavior with
no publication or expiry restriction.

The marquee contains at most three uncategorized announcements or flagged
events, ordered newest-created first. Event links go to `/event/:id`; manual
announcements use their saved URL. The marquee is available on mobile as well.
Only active categories containing currently visible announcements appear in the
existing announcement navigation. Their listing route is
`/announcements/category/:id`. Uncategorized items never appear in category lists.
Frontend data refreshes every minute.

Event saves, updates and deletes synchronize the separate announcement record.
Unchecking the event's announcement flag removes that record. The event page
sets the source to `event`; the Announcement page always sets it to `announcement`.

## API and validation

Admin routes under `/api/announcements` use the project's existing user header
resolution and require an admin, superadmin or coordinator account:

- `GET /owners?module=institution|schools`
- `GET/POST /categories`, `PUT/DELETE /categories/:id`
- `GET/POST /?module=institution|schools`
- `PUT/DELETE /:id?module=institution|schools`

Run `npm test` in the backend. Tests exercise the Express routes, Mongoose
validation and event middleware with mocked database persistence; they do not
connect to or modify a deployed database. Run `npm run build` in both frontend
projects. Live database and browser checks should include category assignment,
date boundaries, editing/deleting events, and coordinator access scope.
