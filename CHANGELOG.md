# Changelog

All notable changes to the Devil May Cry Wiki project will be documented in this file.

---

## [1.1.0] - 2026-09-22

### Added

- Supabase-powered fan comment system.
- Shared comments between website visitors.
- Cloudflare Turnstile protection for comment submissions.
- Supabase Edge Function named `submit-comment`.
- Akismet automatic spam filtering.
- Comment moderation statuses:
  - `approved`
  - `pending`
  - `spam`
- Formspree integration for the Contact page.
- Real email delivery for Contact form submissions.
- Formspree integration for the Devil Hunter Dispatch newsletter.
- Real newsletter email collection through the footer form.
- 30-question Devil May Cry quiz database.
- Random selection of 15 questions from the 30-question bank.
- Randomized answer choices for every quiz session.
- Improved loading, success, and error messages for forms.

### Changed

- Replaced the old browser-only comment system with Supabase.
- Replaced the old `approved` boolean comment field with a `status` field.
- Character comments are now filtered using `character_name`.
- Clean comments can automatically become `approved`.
- Spam comments are automatically marked as `spam`.
- Updated character lore to sound more natural and fan-written.
- Improved the Characters page search and filter section.
- Improved dropdown styling and positioning.
- Improved Cards/List toggle styling.
- Updated Contact page content.
- Changed the Contact button from `Validate Message` to `Send Message`.
- Contact form now submits through AJAX without leaving the page.
- Updated footer newsletter text.
- Newsletter subscription now submits through AJAX using `site.js`.
- Improved mobile navigation layout and responsiveness.

### Fixed

- Mobile hamburger menu transparency issue.
- Mobile navigation positioning.
- Large empty space below mobile navigation links.
- Dropdown arrows appearing in the wrong position.
- Missing Lady `Explosives Expert` icon.
- Missing Sparda `Sparda Sword Mastery` icon.
- Broken and malformed Contact page HTML.
- Broken Contact form attributes.
- Broken Google Fonts URLs.
- Broken social media links.
- Broken `mailto:` formatting.
- Broken Contact subject and message fields.
- Newsletter email input missing its `name="email"` attribute.
- Comment system previously storing data only in `localStorage`.

### Security

- Enabled Supabase Row Level Security for comments.
- Public visitors can only read comments with `status = approved`.
- Public visitors cannot directly approve, update, or delete comments.
- Comment submissions are handled server-side through a Supabase Edge Function.
- Added Cloudflare Turnstile bot verification.
- Added Akismet spam checking.
- Stored private credentials inside Supabase Secrets.
- Kept Turnstile secret keys and Akismet API keys out of frontend JavaScript.

### Optimized

- Removed unused images.
- Removed unused videos.
- Removed old GIF files.
- Removed duplicate media assets.
- Removed unused background files.
- Removed unused favicon files.
- Removed an unused large Devil May Cry trailer video.
- Removed unnecessary `.git` files from the distributable website package.
- Compressed oversized character images while keeping good visual quality.
- Reduced the project size from roughly 96 MB to around 8.8 MB zipped.

### Quiz Improvements

- Moved quiz questions into `data.json`.
- Increased the question bank to 30 questions.
- Users answer only 15 questions per quiz session.
- Questions are randomly selected every time the quiz starts.
- Answer choices are also randomized.
- Restarting the quiz produces a new randomized set.

### External Services Added

- Supabase
  - PostgreSQL database
  - Comments
  - Row Level Security
  - Edge Functions
  - Server-side secrets

- Cloudflare Turnstile
  - Bot protection for comments

- Akismet
  - Automatic comment spam detection

- Formspree
  - Contact form email delivery
  - Newsletter subscription collection

---

## [1.0.0] - Initial Release

### Added

- Homepage.
- Character archive.
- Dynamic character detail pages.
- Game lore pages.
- Dynamic lore detail pages.
- Devil May Cry trivia quiz.
- Contact page.
- Dark and light themes.
- Responsive desktop, tablet, and mobile layouts.
- Character image galleries.
- Image lightbox.
- Cards and list character views.
- Search and filter controls.
- Devil May Cry themed visual design.

---

## Production Testing Remaining

- Test Cloudflare Turnstile on the deployed domain.
- Test comment submission on the deployed site.
- Confirm normal comments are marked as `approved`.
- Confirm spam comments are marked as `spam`.
- Test Formspree Contact email delivery.
- Test Devil Hunter Dispatch subscriptions.
- Check all pages on desktop and mobile.
- Check browser console for errors.
- Check for broken links or missing images.