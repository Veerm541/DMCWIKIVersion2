(async () => {
  const { $, escapeHTML, observeReveal, characterFocus } = window.DMC;
  const target = $('#characterDetail');
  const params = new URLSearchParams(location.search);
  const requested = params.get('name') || 'Dante';
  let characterName = requested;

  const renderComments = () => {
    const list = $('#commentsList');
    if (!list) return;
    const all = JSON.parse(localStorage.getItem('dmc-comments') || '{}');
    const comments = [...(all[characterName] || [])].sort((a,b) => new Date(b.date) - new Date(a.date));
    list.innerHTML = comments.length ? comments.map(comment => `
      <article class="comment-card">
        <div class="comment-head">
          <div class="comment-avatar">${escapeHTML((comment.name || '?').charAt(0).toUpperCase())}</div>
          <div class="comment-meta"><strong>${escapeHTML(comment.name || 'Anonymous')}</strong><span>${new Date(comment.date).toLocaleString()}</span></div>
        </div>
        <p>${escapeHTML(comment.text)}</p>
      </article>`).join('') : '<div class="notice">No fan comments yet. You can be the first.</div>';
  };

  const wireComments = () => {
    const form = $('#commentForm');
    form?.addEventListener('submit', event => {
      event.preventDefault();
      const name = $('#commentName').value.trim();
      const text = $('#commentText').value.trim();
      const status = $('#commentStatus');
      if (!text || text.length < 2) {
        status.textContent = 'Write a short comment before posting.';
        status.style.color = 'var(--danger)';
        return;
      }
      const all = JSON.parse(localStorage.getItem('dmc-comments') || '{}');
      if (!all[characterName]) all[characterName] = [];
      all[characterName].push({ name, text, date: new Date().toISOString() });
      localStorage.setItem('dmc-comments', JSON.stringify(all));
      form.reset();
      status.textContent = 'Comment posted on this device.';
      status.style.color = 'var(--success)';
      renderComments();
    });
  };

  try {
    const response = await fetch('assets/js/data.json');
    if (!response.ok) throw new Error('Could not load character archive.');
    const { characters = [] } = await response.json();
    const character = characters.find(c => c.name.toLowerCase() === requested.toLowerCase());
    if (!character) throw new Error('Character dossier not found.');
    characterName = character.name;
    document.title = `${character.name} — Devil May Cry Wiki`;
    const lore = character.lore || {};
    const stats = lore.stats || {};
    const abilities = lore.abilities || [];
    const gallery = lore.gallery || [];
    const quotes = lore.quotes || [];

    const focusY = characterFocus(character.name);
    target.innerHTML = `
      <section class="page-hero character-detail-page" style="min-height:42svh;--focus-y:${focusY}">
        <div class="page-hero-media"><img src="${character.image}" alt="${escapeHTML(character.name)}"></div>
        <div class="container reveal">
          <div class="breadcrumb"><a href="characters.html">Characters</a><i class="fa-solid fa-chevron-right"></i><span>${escapeHTML(character.name)}</span></div>
          <span class="eyebrow"><i class="fa-solid fa-file-shield"></i> Hunter dossier</span>
          <h1 class="page-title">${escapeHTML(character.name)}</h1>
          <p>${escapeHTML(character.description)}</p>
        </div>
      </section>
      <main>
        <section class="section">
          <div class="container detail-layout character-detail-page" style="--focus-y:${focusY}">
            <aside class="detail-poster reveal from-left">
              <img src="${character.image}" alt="${escapeHTML(character.name)} portrait" data-lightbox="${character.image}" data-caption="${escapeHTML(character.name)}">
              <div class="detail-poster-overlay"></div>
              <div class="poster-caption"><span class="rank-chip"><i class="fa-solid fa-fire-flame-curved"></i> Popularity ${character.popularity}</span></div>
            </aside>
            <div class="detail-copy">
              <div class="reveal">
                <span class="section-kicker">${escapeHTML(character.role)}</span>
                <h1>${escapeHTML(character.name)}</h1>
                <p class="role-line">Archive subject · ${escapeHTML(character.role)}</p>
              </div>
              <div class="reveal">
                <h2 class="footer-title">Signature Gear</h2>
                <div class="weapon-row">${character.weapons.map(item => `<span class="weapon-pill">${escapeHTML(item)}</span>`).join('')}</div>
              </div>
              <div class="stats-grid reveal-stagger">
                ${Object.entries(stats).map(([label,value]) => `<div class="stat-card"><div class="stat-top"><span>${escapeHTML(label)}</span><strong>${escapeHTML(value)}</strong></div><div class="stat-bar"><span style="--value:${Number(value) || 0}%"></span></div></div>`).join('')}
              </div>
              <article class="story-panel reveal">
                <span class="section-kicker">Character record</span><h2>Lore</h2>
                <div class="lore-copy">${lore.full || '<p>No lore file available.</p>'}</div>
              </article>
              <section class="reveal">
                <div class="section-heading"><span class="section-kicker">Combat identity</span><h2>Signature Abilities</h2></div>
                <div class="abilities-grid">${abilities.map(a => `<article class="ability-card"><div class="ability-icon"><i class="${escapeHTML(a.icon || 'fa-solid fa-star')}"></i></div><h3>${escapeHTML(a.name)}</h3><p>${escapeHTML(a.description)}</p></article>`).join('')}</div>
              </section>
              ${quotes.length ? `<section class="reveal"><div class="section-heading"><span class="section-kicker">Voice archive</span><h2>Quotes</h2></div><div class="quote-wall">${quotes.map(q => `<blockquote class="quote-card">“${escapeHTML(q)}”</blockquote>`).join('')}</div></section>` : ''}
              <section class="reveal">
                <div class="section-heading"><span class="section-kicker">Visual archive</span><h2>Gallery</h2><p>Click any image to open the lightbox.</p></div>
                <div class="gallery-grid">${gallery.map(item => `<figure class="gallery-item" data-lightbox="${item.image}" data-caption="${escapeHTML(item.caption)}" tabindex="0"><img src="${item.image}" alt="${escapeHTML(item.caption)}" loading="lazy" decoding="async"><figcaption class="gallery-caption">${escapeHTML(item.caption)}</figcaption></figure>`).join('')}</div>
              </section>
            </div>
          </div>
        </section>
        <section class="section compact">
          <div class="container">
            <div class="section-heading reveal"><span class="section-kicker">Community</span><h2>Fan Comments</h2><p>Comments are stored locally in your browser for this project demo.</p></div>
            <div class="comments-shell">
              <form class="comment-form reveal" id="commentForm" novalidate>
                <div class="form-group"><label for="commentName">Name (optional)</label><input class="field" id="commentName" maxlength="40" placeholder="Anonymous hunter"></div>
                <div class="form-group" style="margin-top:.8rem"><label for="commentText">Comment</label><textarea class="field" id="commentText" maxlength="500" required placeholder="Share your thoughts..."></textarea></div>
                <button class="btn small" type="submit" style="margin-top:.8rem">Post comment <i class="fa-solid fa-arrow-up-right-from-square"></i></button>
                <p class="form-status" id="commentStatus" aria-live="polite"></p>
              </form>
              <div class="comments-list reveal from-right" id="commentsList"></div>
            </div>
          </div>
        </section>
      </main>`;
    observeReveal(target);
    renderComments();
    wireComments();
  } catch (error) {
    target.innerHTML = `<main class="section" style="padding-top:calc(var(--nav-h) + 5rem)"><div class="container"><div class="notice">${escapeHTML(error.message)} <a href="characters.html">Return to character archive.</a></div></div></main>`;
  }
})();
