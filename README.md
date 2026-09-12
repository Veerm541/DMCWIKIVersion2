# Devil May Cry Wiki — Organized Stylish Renovation

A responsive multi-page fan wiki rebuilt with plain HTML, CSS, and JavaScript.

## Run
Use a local web server because the site loads `assets/js/data.json` with `fetch()`.

Recommended: open the folder in VS Code and use **Live Server**, or run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Pages
- `index.html` — full-screen looping video hero, featured character grid, game saga
- `characters.html` — searchable/filterable/sortable character grid
- `character-detail.html` — dynamic dossier, stats, lore, gallery lightbox, local comments
- `lore.html` — game archive grid
- `lore-detail.html` — dynamic game story record
- `quiz.html` — 15-question shuffled quiz with instant feedback and style rank
- `contact.html` — validated contact form and FAQ

## Renovation features
- Fixed glass navigation
- Responsive hamburger menu
- Dark/light mode with localStorage
- Organized crimson design system using CSS variables
- Google Fonts typography
- Smooth scroll and scroll progress bar
- Scroll-triggered fade/reveal animation
- Smooth, restrained pointer tilt and sheen on cards
- Reusable image lightbox
- Back-to-top button
- Multi-column footer
- Newsletter validation demo
- Custom desktop cursor
- Reduced-motion accessibility support
- Mobile/tablet/desktop responsive layouts

## Notes
The contact and newsletter forms are front-end demos. Connect them to your preferred backend or form service to send real submissions.

This is an unofficial fan project. Devil May Cry and related properties belong to their respective rights holders.

## CSS location
The shared stylesheet is `style.css` in the project root. All seven HTML pages are connected directly to that file.
