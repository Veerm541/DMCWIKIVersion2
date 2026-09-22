(async () => {
  const { $, escapeHTML, observeReveal, characterFocus } = window.DMC;
  const SUPABASE_URL =
    'https://frsgxoxalhzcdxlaprtt.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY =
    'sb_publishable_CaEyqGYm4XAVLzDpEVjKJg_u1oXfSPR';
  const TURNSTILE_SITE_KEY =
    '0x4AAAAAAE_8vDaUIxqSom4N';

  let turnstileWidgetId = null;
  const target = $('#characterDetail');
  const params = new URLSearchParams(location.search);
  const requested = params.get('name') || 'Dante';
  let characterName = requested;

  const renderComments = async () => {
    const list = $('#commentsList');

    if (!list) return;

    list.innerHTML = `
    <div class="notice">
      Loading fan comments...
    </div>
  `;

    try {
      const url = new URL(
        `${SUPABASE_URL}/rest/v1/comments`
      );

      url.searchParams.set(
        'select',
        'id,display_name,comment_text,created_at'
      );

      url.searchParams.set(
        'character_name',
        `eq.${characterName}`
      );

      url.searchParams.set(
        'status',
        'eq.approved'
      );

      url.searchParams.set(
        'order',
        'created_at.desc'
      );

      const response = await fetch(url, {
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY
        }
      });

      if (!response.ok) {
        throw new Error(
          'Unable to load comments.'
        );
      }

      const comments = await response.json();

      if (!comments.length) {
        list.innerHTML = `
        <div class="notice">
          No fan comments yet. You can be the first.
        </div>
      `;

        return;
      }

      list.innerHTML = comments.map(comment => {

        const name =
          comment.display_name || 'Anonymous';

        return `
        <article class="comment-card">

          <div class="comment-head">

            <div class="comment-avatar">
              ${escapeHTML(
          name.charAt(0).toUpperCase()
        )}
            </div>

            <div class="comment-meta">

              <strong>
                ${escapeHTML(name)}
              </strong>

              <span>
                ${new Date(
          comment.created_at
        ).toLocaleString()}
              </span>

            </div>

          </div>

          <p>
            ${escapeHTML(comment.comment_text)}
          </p>

        </article>
      `;

      }).join('');

    } catch (error) {

      console.error(error);

      list.innerHTML = `
      <div class="notice">
        Could not load fan comments.
      </div>
    `;
    }
  };

  const wireComments = () => {
    const form = $('#commentForm');
    const status = $('#commentStatus');

    if (!form) return;


    /* ==============================================
       RENDER CLOUDFLARE TURNSTILE
       ============================================== */

    const renderTurnstile = () => {

      if (!window.turnstile) {
        setTimeout(renderTurnstile, 200);
        return;
      }

      const widget =
        document.querySelector(
          '#turnstileWidget'
        );

      if (!widget) return;

      turnstileWidgetId =
        window.turnstile.render(
          widget,
          {
            sitekey: TURNSTILE_SITE_KEY,
            theme: 'auto'
          }
        );
    };


    renderTurnstile();


    /* ==============================================
       SUBMIT COMMENT
       ============================================== */

    form.addEventListener(
      'submit',
      async event => {

        event.preventDefault();


        const nameInput =
          $('#commentName');

        const textInput =
          $('#commentText');


        const displayName =
          nameInput.value.trim() ||
          'Anonymous';


        const commentText =
          textInput.value.trim();


        /* ------------------------------------------
           Basic validation
           ------------------------------------------ */

        if (commentText.length < 2) {

          status.textContent =
            'Write a short comment before posting.';

          status.style.color =
            'var(--danger)';

          return;
        }


        if (commentText.length > 500) {

          status.textContent =
            'Comments can only contain 500 characters.';

          status.style.color =
            'var(--danger)';

          return;
        }


        /* ------------------------------------------
           Get Turnstile token
           ------------------------------------------ */

        const turnstileToken =
          window.turnstile &&
            turnstileWidgetId !== null

            ? window.turnstile.getResponse(
              turnstileWidgetId
            )

            : '';


        if (!turnstileToken) {

          status.textContent =
            'Please complete the verification first.';

          status.style.color =
            'var(--danger)';

          return;
        }


        /* ------------------------------------------
           Disable button while submitting
           ------------------------------------------ */

        const submitButton =
          form.querySelector(
            'button[type="submit"]'
          );


        submitButton.disabled = true;

        status.textContent =
          'Submitting comment...';

        status.style.color =
          'var(--muted)';


        try {

          /* ==========================================
             SEND TO SUPABASE EDGE FUNCTION
             ========================================== */

          const response = await fetch(
            `${SUPABASE_URL}/functions/v1/submit-comment`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',

                apikey:
                  SUPABASE_PUBLISHABLE_KEY
              },

              body: JSON.stringify({
                character_name:
                  characterName,

                display_name:
                  displayName,

                comment_text:
                  commentText,

                turnstile_token:
                  turnstileToken
              })
            }
          );


          const result =
            await response.json();


          if (!response.ok) {

            throw new Error(
              result.error ||
              'Unable to submit comment.'
            );

          }


          /* ==========================================
             SUCCESS
             ========================================== */

          nameInput.value = '';
          textInput.value = '';


         status.textContent =
          result.message ||
          'Comment submitted successfully!';

          status.style.color =
            'var(--success)';

          /*
            Reset Turnstile so another
            comment can be submitted.
          */

          if (
            window.turnstile &&
            turnstileWidgetId !== null
          ) {

            window.turnstile.reset(
              turnstileWidgetId
            );

          }


          await renderComments();

        } catch (error) {

          console.error(error);


          status.textContent =
            error.message ||
            'Something went wrong.';


          status.style.color =
            'var(--danger)';


          if (
            window.turnstile &&
            turnstileWidgetId !== null
          ) {

            window.turnstile.reset(
              turnstileWidgetId
            );

          }

        } finally {

          submitButton.disabled = false;

        }

      }
    );
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
                ${Object.entries(stats).map(([label, value]) => `<div class="stat-card"><div class="stat-top"><span>${escapeHTML(label)}</span><strong>${escapeHTML(value)}</strong></div><div class="stat-bar"><span style="--value:${Number(value) || 0}%"></span></div></div>`).join('')}
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
            <<div class="section-heading reveal">

  <span class="section-kicker">
    Community
  </span>

  <h2>
    Fan Comments
  </h2>

  <p>
    Share your thoughts with other Devil May Cry fans.
  </p>

</div>
            <div class="comments-shell">
              <form class="comment-form reveal" id="commentForm" novalidate>
                <div class="form-group"><label for="commentName">Name (optional)</label><input class="field" id="commentName" maxlength="40" placeholder="Anonymous hunter"></div>
                <div class="form-group" style="margin-top:.8rem"><label for="commentText">Comment</label><textarea class="field" id="commentText" maxlength="500" required placeholder="Share your thoughts..."></textarea></div>
                <div
  id="turnstileWidget"
  style="margin-top:1rem">
</div>
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
