(async () => {
  const { $, escapeHTML, wireTilt, observeReveal } = window.DMC;
  const grid = $('#loreGrid');
  try {
    const response = await fetch('assets/js/data.json');
    if (!response.ok) throw new Error('Could not load game archive.');
    const { games = [] } = await response.json();
    grid.innerHTML = games.map((game, index) => `
      <article class="card reveal ${index % 2 ? 'medium' : 'tall'}">
        <div class="card-media"><img src="${game.thumbnail || game.cover_image}" alt="${escapeHTML(game.title)}" loading="lazy" decoding="async"></div>
        <span class="card-rank">Archive ${game.year}</span>
        <div class="card-body">
          <span class="card-index">0${index + 1}</span>
          <h3>${escapeHTML(game.title)}</h3>
          <p>${escapeHTML(game.summary)}</p>
          <div class="card-meta">${game.platforms.slice(0,4).map(p => `<span class="tag">${escapeHTML(p)}</span>`).join('')}</div>
          <a class="card-link" href="lore-detail.html?id=${encodeURIComponent(game.id)}">Read full record <i class="fa-solid fa-arrow-right"></i></a>
        </div>
      </article>
    `).join('');
    wireTilt(grid); observeReveal(grid);
  } catch (error) {
    grid.innerHTML = `<div class="notice">${escapeHTML(error.message)} Try opening the project using Live Server.</div>`;
  }
})();
