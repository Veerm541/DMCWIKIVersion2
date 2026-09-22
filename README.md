# Devil May Cry Wiki

A fan-made Devil May Cry wiki website created as a school web development project.


## Website check it out
https://dmcwikiversion2.onrender.com/
=======
The website focuses on the characters, lore, games, and style of the Devil May Cry series while also demonstrating responsive web design, JavaScript interactivity, API integration, database usage, and form handling.

> This is an unofficial fan project. Devil May Cry and its related properties belong to Capcom and their respective rights holders.

---

## Features
>>>>>>> 2d90804 (All changes are in CHANGELOG.md)

### Character Archive

Browse major Devil May Cry characters including:

<<<<<<< HEAD
## Notes
got time to just renew the version of my first year WebTech web project lol
=======
- Dante
- Vergil
- Nero
- V
- Lady
- Trish
- Nico
- Sparda
- Mundus
- Urizen

Each character page contains information such as:

- Character description
- Full lore
- Abilities
- Weapons
- Character statistics
- Gallery
- Fan comments

---

### Game Lore

Explore the story and major events of the Devil May Cry games through dedicated lore pages.

The project focuses on the main Devil May Cry timeline and does not include the DmC reboot.

---

### Pizza Time Quiz

The website includes an interactive Devil May Cry trivia quiz.

Features:

- 30 questions stored in the question database
- 15 randomly selected questions per game
- Randomized question order
- Randomized answer choices
- Score tracking
- Devil May Cry style rank results
- Replay generates another random set of questions

---

### Fan Comments

Character pages include a shared fan comment system.

Comments are stored using Supabase instead of browser local storage, meaning comments can be seen by other visitors.

The system includes:

- Supabase PostgreSQL database
- Character-specific comments
- Cloudflare Turnstile bot protection
- Supabase Edge Function
- Akismet spam detection
- Automatic comment moderation

Comment statuses include:

- `approved`
- `pending`
- `spam`

Only approved comments are displayed publicly.

---

### Contact Form

The Contact page uses Formspree for real message delivery.

Visitors can send:

- Feedback
- Questions
- Suggestions
- Bug reports
- Other messages

The form includes:

- Client-side validation
- AJAX submission
- Loading state
- Success messages
- Error handling
- Email delivery through Formspree

---

### Responsive Design

The website is designed for:

- Desktop
- Laptop
- Tablet
- Mobile

The navigation automatically changes to a hamburger menu on smaller screens.

---

### Dark and Light Theme

Users can switch between dark and light themes.

The selected theme is saved locally in the browser.

---

### Image Gallery

Character galleries include an interactive lightbox for viewing images in a larger format.

---

## Technologies Used

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript
- Font Awesome
- Google Fonts

### Database

- Supabase
- PostgreSQL

### Backend / Serverless

- Supabase Edge Functions

### APIs and Services

- Cloudflare Turnstile
- Akismet
- Formspree

### Deployment

- Render
- GitHub

---

## Project Structure

```text
Devil-May-Cry-Wiki/
│
├── index.html
├── characters.html
├── character-detail.html
├── lore.html
├── lore-detail.html
├── quiz.html
├── contact.html
│
├── style.css
│
├── assets/
│   │
│   ├── images/
│   │
│   ├── icons/
│   │
│   └── js/
│       ├── site.js
│       ├── characters.js
│       ├── character-detail.js
│       ├── lore.js
│       ├── lore-detail.js
│       ├── quiz.js
│       ├── contact.js
│       └── data.json
│
└── README.md
>>>>>>> 2d90804 (All changes are in CHANGELOG.md)
