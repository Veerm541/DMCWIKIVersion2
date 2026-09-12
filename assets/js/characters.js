(async () => {
  const { $, $$, escapeHTML, wireTilt, observeReveal, characterFocus } = window.DMC;
  const grid = $('#characterGrid');
  const search = $('#characterSearch');
  const role = $('#roleFilter');
  const sort = $('#sortCharacters');
  const count = $('#resultCount');
  const viewToggle = $('#viewToggle');
  let characters = [];
  let view = localStorage.getItem('dmc-characters-view') === 'list' ? 'list' : 'cards';

  const cardMarkup = (char, index) => `
      <article class="card character-card reveal" style="--focus-y:${characterFocus(char.name)}">
        <div class="card-media"><img src="${char.thumbnail || char.image}" alt="${escapeHTML(char.name)}" loading="lazy" decoding="async"></div>
        <span class="card-rank">${escapeHTML(char.role)}</span>
        <div class="card-body">
          <span class="card-index">${String(index + 1).padStart(2,'0')}</span>
          <h3>${escapeHTML(char.name)}</h3>
          <p>${escapeHTML(char.description)}</p>
          <div class="card-meta">
            <span class="tag"><i class="fa-solid fa-bolt"></i> ${char.popularity}% popularity</span>
            <span class="tag">${char.weapons.length} signature gear</span>
          </div>
          <a class="card-link" href="character-detail.html?name=${encodeURIComponent(char.name)}">View profile <i class="fa-solid fa-arrow-right"></i></a>
        </div>
      </article>
  `;

  const setView = (next) => {
    view = next;
    localStorage.setItem('dmc-characters-view', view);
    $$('.view-toggle-btn', viewToggle).forEach(btn => {
      const isActive = btn.dataset.view === view;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
    render();
  };

  const render = () => {
    const q = search.value.trim().toLowerCase();
    const wantedRole = role.value;
    let list = characters.filter(char => {
      const matchesSearch = !q || `${char.name} ${char.role} ${char.description}`.toLowerCase().includes(q);
      return matchesSearch && (!wantedRole || char.role === wantedRole);
    });

    if (sort.value === 'pop-desc') list.sort((a,b) => b.popularity - a.popularity);
    if (sort.value === 'pop-asc') list.sort((a,b) => a.popularity - b.popularity);
    if (sort.value === 'name-asc') list.sort((a,b) => a.name.localeCompare(b.name));
    if (sort.value === 'name-desc') list.sort((a,b) => b.name.localeCompare(a.name));

    count.textContent = `${list.length} ${list.length === 1 ? 'dossier' : 'dossiers'} found`;
    grid.dataset.view = view;

    if (!list.length) {
      grid.innerHTML = '<div class="empty-state"><i class="fa-solid fa-magnifying-glass"></i><p>No character matches those filters.</p></div>';
      return;
    }

    if (view === 'list') {
      // Organized by role, alphabetically, each group sorted by the active sort.
      const groups = new Map();
      list.forEach(char => {
        if (!groups.has(char.role)) groups.set(char.role, []);
        groups.get(char.role).push(char);
      });
      const roles = [...groups.keys()].sort((a, b) => a.localeCompare(b));
      grid.innerHTML = roles.map(roleName => {
        const members = groups.get(roleName);
        return `
          <div class="role-group">
            <div class="role-group-heading"><h3>${escapeHTML(roleName)}</h3><span class="tag">${members.length} ${members.length === 1 ? 'entry' : 'entries'}</span></div>
            <div class="role-list">${members.map((char) => cardMarkup(char, characters.indexOf(char))).join('')}</div>
          </div>
        `;
      }).join('');
    } else {
      grid.innerHTML = list.map((char, index) => cardMarkup(char, index)).join('');
    }

    wireTilt(grid);
    observeReveal(grid);
  };

  try {
    const response = await fetch('assets/js/data.json');
    if (!response.ok) throw new Error('Could not load character data.');
    characters = (await response.json()).characters || [];
    [...new Set(characters.map(c => c.role))].sort().forEach(item => {
      const option = document.createElement('option');
      option.value = item; option.textContent = item; role.append(option);
    });
    setView(view);
    [search, role, sort].forEach(control => control.addEventListener(control === search ? 'input' : 'change', render));
    viewToggle.addEventListener('click', (event) => {
      const btn = event.target.closest('.view-toggle-btn');
      if (btn) setView(btn.dataset.view);
    });
  } catch (error) {
    grid.innerHTML = `<div class="notice">${escapeHTML(error.message)} Try opening the project using Live Server.</div>`;
  }
})();
