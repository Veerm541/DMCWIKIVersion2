(async () => {
  const { $, escapeHTML, observeReveal } = window.DMC;
  const target = $('#loreDetail');
  const id = new URLSearchParams(location.search).get('id') || 'dmc5';
  try {
    const response = await fetch('assets/js/data.json');
    if (!response.ok) throw new Error('Could not load the archive.');
    const { games = [] } = await response.json();
    const game = games.find(item => String(item.id).toLowerCase() === String(id).toLowerCase());
    if (!game) throw new Error('That game record was not found.');
    document.title = `${game.title} — Devil May Cry Wiki`;
    const lore = game.full_lore || {};
    const plot = Array.isArray(lore.plot) ? lore.plot : [];
    const characters = Array.isArray(lore.characters) ? lore.characters : [];
    const trivia = Array.isArray(lore.trivia) ? lore.trivia : [];

    target.innerHTML = `
      <section class="page-hero">
        <div class="page-hero-media"><img src="${game.cover_image}" alt="${escapeHTML(game.title)}"></div>
        <div class="container reveal">
          <div class="breadcrumb"><a href="lore.html">Game Lore</a><i class="fa-solid fa-chevron-right"></i><span>${escapeHTML(game.year)}</span></div>
          <span class="eyebrow"><i class="fa-solid fa-book-skull"></i> Classified archive</span>
          <h1 class="page-title">${escapeHTML(game.title)}</h1>
          <p>${escapeHTML(game.summary)}</p>
        </div>
      </section>
      <main>
        <section class="section compact game-hero-panel">
          <div class="container">
            <div class="game-meta reveal">
              <div><span>Release</span><strong>${escapeHTML(game.year)}</strong></div>
              <div><span>Archive ID</span><strong>${escapeHTML(game.id).toUpperCase()}</strong></div>
              <div><span>Platforms</span><strong>${escapeHTML(game.platforms.join(' · '))}</strong></div>
            </div>
          </div>
        </section>
        <section class="section compact">
          <div class="container story-grid">
            <article class="story-panel reveal">
              <span class="section-kicker">Story record</span>
              <h2>Synopsis</h2>
              <div class="lore-copy"><p>${escapeHTML(lore.synopsis || 'No synopsis available.')}</p></div>
            </article>
            <aside class="story-panel reveal from-right">
              <span class="section-kicker">Quick file</span>
              <h2>Key Cast</h2>
              ${characters.map(c => `<div class="key-character"><strong>${escapeHTML(c.name)}</strong><span>${escapeHTML(c.role)}</span><p>${escapeHTML(c.description)}</p></div>`).join('') || '<p>No character file available.</p>'}
            </aside>
          </div>
        </section>
        <section class="section compact">
          <div class="container">
            <div class="section-heading reveal"><span class="section-kicker">Mission sequence</span><h2>Main Plot Points</h2></div>
            <div class="plot-list reveal-stagger">${plot.map(point => `<article class="plot-item"><div><h3>${escapeHTML(point.chapter || point.title || 'Story beat')}</h3><p>${escapeHTML(point.content || point.description || '')}</p></div></article>`).join('')}</div>
          </div>
        </section>
        <section class="section compact">
          <div class="container story-grid">
            <article class="story-panel reveal">
              <span class="section-kicker">Extras</span><h2>Trivia</h2>
              <ul class="trivia-list">${trivia.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>
            </article>
            <aside class="story-panel reveal from-right">
              <span class="section-kicker">Continue</span><h2>More Archives</h2>
              <p>Jump back to the full game timeline and open another record.</p>
              <a class="btn small" href="lore.html" style="margin-top:1rem">Browse all games <i class="fa-solid fa-arrow-right"></i></a>
            </aside>
          </div>
        </section>
      </main>`;
    observeReveal(target);
  } catch (error) {
    target.innerHTML = `<main class="section" style="padding-top:calc(var(--nav-h) + 5rem)"><div class="container"><div class="notice">${escapeHTML(error.message)} <a href="lore.html">Return to Game Lore.</a></div></div></main>`;
  }
})();
