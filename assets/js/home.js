(async () => {
  const { $, escapeHTML, wireTilt, observeReveal, characterFocus } = window.DMC;
  const featured = $('#featuredGrid');
  const saga = $('#sagaGrid');
  try {
    const response = await fetch('assets/js/data.json');
    if (!response.ok) throw new Error('Unable to load archive data.');
    const data = await response.json();

    featured.innerHTML = data.characters.slice(0, 6).map((char, index) => `
      <article class="card feature-card reveal" style="--focus-y:${characterFocus(char.name)}">
        <div class="card-media"><img src="${char.thumbnail || char.image}" alt="${escapeHTML(char.name)}" loading="lazy" decoding="async"></div>
        <span class="card-rank">Popularity ${char.popularity}</span>
        <div class="card-body">
          <span class="section-kicker">${escapeHTML(char.role)}</span>
          <h3>${escapeHTML(char.name)}</h3>
          <p>${escapeHTML(char.description)}</p>
          <a class="card-link" href="character-detail.html?name=${encodeURIComponent(char.name)}">Open dossier <i class="fa-solid fa-arrow-right"></i></a>
        </div>
      </article>
    `).join('');

    saga.innerHTML = data.games.map(game => `
      <a class="saga-card reveal" href="lore-detail.html?id=${encodeURIComponent(game.id)}" aria-label="Read ${escapeHTML(game.title)} lore">
        <img src="${game.thumbnail || game.cover_image}" alt="${escapeHTML(game.title)}" loading="lazy" decoding="async">
        <div class="saga-copy">
          <span class="saga-year">${escapeHTML(game.year)} · ${escapeHTML(game.platforms.slice(0,2).join(' / '))}</span>
          <h3>${escapeHTML(game.title)}</h3>
          <p>${escapeHTML(game.summary)}</p>
        </div>
      </a>
    `).join('');

    wireTilt(featured);
    observeReveal(featured);
    observeReveal(saga);
  } catch (error) {
    featured.innerHTML = `<div class="notice">${escapeHTML(error.message)} Run the project through VS Code Live Server so JSON files can load correctly.</div>`;
    saga.innerHTML = '';
  }
})();
