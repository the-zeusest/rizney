/* Rizney header images and song-to-animal icons. */
(() => {
  "use strict";

  const API_BASE = "https://api.github.com/repos/the-zeusest/rizney/contents/assets/animal-icons";
  const RAW_PREFIX = "./assets/animal-icons/";
  const FALLBACK_ICON = "🐾";
  let iconFiles = [];
  let updatingCards = false;

  function applyHeaderImages() {
    const header = document.querySelector('.top-area');
    const heading = header?.querySelector('h1');
    const tagline = header?.querySelector('.tagline');
    if (!header || !heading) return;

    tagline?.remove();
    let donate = header.querySelector('.donate');
    let context = header.querySelector('.context-link');
    if (!context) {
      context = document.createElement('a');
      context.className = 'context-link';
      donate?.insertAdjacentElement('afterend', context);
      if (!context.isConnected) header.appendChild(context);
    }
    context.href = './context.html';
    context.textContent = 'CONTEXT';
    context.setAttribute('aria-label', 'Read context');
    context.setAttribute('title', 'Read context');

    let curseLogo = document.querySelector('.curse-logo');
    if (!curseLogo) {
      curseLogo = document.createElement('img');
      curseLogo.src = './assets/curse.png';
      curseLogo.alt = 'Curse';
      curseLogo.className = 'curse-logo';
      curseLogo.decoding = 'async';
    }
    let footer = document.querySelector('#site-footer');
    if (!footer) {
      footer = document.createElement('footer');
      footer.id = 'site-footer';
      footer.setAttribute('aria-label', 'Site footer');
      document.body.appendChild(footer);
    }
    footer.appendChild(curseLogo);

    heading.textContent = '';
    let rizneyLogo = header.querySelector('.rizney-logo');
    if (!rizneyLogo) {
      rizneyLogo = document.createElement('img');
      rizneyLogo.src = './assets/rizney.png';
      rizneyLogo.alt = 'Rizney';
      rizneyLogo.className = 'rizney-logo';
      rizneyLogo.decoding = 'async';
      header.appendChild(rizneyLogo);
    }
    if (!document.querySelector('#header-image-overrides')) {
      const style = document.createElement('style');
      style.id = 'header-image-overrides';
      style.textContent = `
        .top-area { position: relative !important; min-height: clamp(88px, 14vw, 120px) !important; margin: 0 0 14px !important; padding: 0 !important; line-height: 0 !important; font-size: 0 !important; }
        .top-area h1 { display: block !important; width: 100% !important; min-height: clamp(88px, 14vw, 120px) !important; height: clamp(88px, 14vw, 120px) !important; margin: 0 !important; padding: 0 !important; }
        .top-area .tagline { display: none !important; }
        .top-area .donate, .top-area .context-link { display: block !important; position: absolute !important; top: 12px !important; z-index: 10 !important; border: 1px solid var(--gold) !important; padding: 8px 12px !important; line-height: 1 !important; font-size: .85rem !important; }
        .top-area .donate { left: 12px !important; } .top-area .context-link { left: 105px !important; }
        .top-area .donate:hover, .top-area .context-link:hover, .top-area .donate:focus-visible, .top-area .context-link:focus-visible { color: #fff !important; background: #24132f !important; }
        .top-area .rizney-logo { position: absolute !important; top: 12px !important; right: 16px !important; display: block !important; width: clamp(76px, 17vw, 165px) !important; height: auto !important; }
        main { padding-bottom: 0 !important; }
        #site-footer { display: flex !important; justify-content: center !important; align-items: flex-end !important; width: 100% !important; margin: 0 !important; padding: 0 !important; border-top: 0 !important; }
        #site-footer .curse-logo { display: block !important; width: min(62vw, 500px) !important; max-width: none !important; height: auto !important; max-height: none !important; margin: 0 auto !important; }
        @media (max-width: 500px) { .top-area { min-height: 82px !important; margin-bottom: 10px !important; } .top-area h1 { min-height: 82px !important; height: 82px !important; } .top-area .donate, .top-area .context-link { top: 8px !important; padding: 7px 11px !important; font-size: .78rem !important; } .top-area .donate { left: 8px !important; } .top-area .context-link { left: 91px !important; } .top-area .rizney-logo { top: 8px !important; right: 8px !important; width: 72px !important; } #site-footer .curse-logo { width: 60vw !important; } }
      `;
      document.head.appendChild(style);
    }
  }

  function addStyles() {
    if (document.getElementById('animal-icon-styles')) return;
    const style = document.createElement('style');
    style.id = 'animal-icon-styles';
    style.textContent = `
      #song-list .song { display:grid; grid-template-columns:52px minmax(0,1fr); gap:10px; width:100%; min-width:0; align-items:center; }
      #song-list .song-number, #song-list .song .play { display:none; }
      .song-animal-button { display:grid; place-items:center; width:52px; height:52px; padding:0; border:1px solid var(--gold,#d4af37); border-radius:10px; background:#000; cursor:pointer; overflow:hidden; }
      .song-animal-button:hover { background:#261334; }
      .song-animal-button:focus-visible { outline:2px solid var(--bright-gold,#f5d76e); outline-offset:2px; }
      .song-animal-icon,.song-animal-fallback { width:48px; height:48px; object-fit:contain; border-radius:8px; background:#000; padding:2px; }
      .song-animal-fallback { display:grid; place-items:center; font-size:1.9rem; }
      .song-title { min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .song-title small { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      #cards { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px; }
      #cards .card { min-height:0; height:auto; padding:10px 8px; background:#000; display:flex; flex-direction:column; justify-content:space-between; align-items:center; }
      #cards .card .symbol { display:none; } #cards .card strong { margin:0 0 4px; }
      .card-animal-icon,.card-animal-fallback { display:block; width:112px; height:112px; margin:0 auto 6px; object-fit:contain; border-radius:12px; background:#000; padding:0; }
      .card-animal-fallback { padding-top:28px; box-sizing:border-box; text-align:center; font-size:3rem; line-height:1; }
      @media (max-width:640px) { #song-list .song { grid-template-columns:46px minmax(0,1fr); gap:8px; padding:8px; } .song-animal-button { width:46px; height:46px; } .song-animal-icon,.song-animal-fallback { width:42px; height:42px; } #cards { grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; } #cards .card { padding:8px 5px; } .card-animal-icon,.card-animal-fallback { width:82px; height:82px; } .card-animal-fallback { padding-top:20px; font-size:2.3rem; } }
    `;
    document.head.appendChild(style);
  }

  const iconLabel = filename => filename.replace(/\.(png|jpe?g|webp|gif)$/i,'').replace(/[-_]+/g,' ').replace(/\b\w/g, c => c.toUpperCase());
  const fallback = (className='song-animal-fallback') => { const el=document.createElement('span'); el.className=className; el.textContent=FALLBACK_ICON; el.setAttribute('aria-label','Animal icon'); return el; };
  function makeImage(file, className) { const image=document.createElement('img'); image.className=className; image.src=RAW_PREFIX + encodeURIComponent(file.name); image.alt=iconLabel(file.name); image.loading='lazy'; image.decoding='async'; image.onerror=()=>image.replaceWith(fallback(className.replace('-icon','-fallback'))); return image; }
  const rows = () => [...document.querySelectorAll('#song-list .song, .song')];

  function putIcons() {
    rows().forEach((row,index) => {
      if (row.querySelector('.song-animal-button')) return;
      const icon = iconFiles[index] ? makeImage(iconFiles[index],'song-animal-icon') : fallback();
      const button=document.createElement('button'); button.type='button'; button.className='song-animal-button'; button.title=`Play ${iconFiles[index] ? iconLabel(iconFiles[index].name) : 'song'}`; button.setAttribute('aria-label',button.title); button.append(icon); button.onclick=()=>row.querySelector('.play')?.click(); row.prepend(button);
    });
  }

  function songIndexFromCard(card) {
    const text = card.textContent || '';
    const match = text.match(/(?:Song|Track)\s+(\d+)/i) || card.querySelector('a')?.textContent.match(/(\d+)/);
    return match ? Number(match[1])-1 : -1;
  }
  function addCardIcons() {
    if (updatingCards) return; updatingCards=true;
    try { document.querySelectorAll('#cards .card').forEach(card => { const index=songIndexFromCard(card); const file=iconFiles[index]; const heading=card.querySelector('strong'); if (heading && file) heading.textContent=iconLabel(file.name); card.querySelector('.symbol')?.remove(); if (card.querySelector('.card-animal-icon,.card-animal-fallback')) return; const icon=file ? makeImage(file,'card-animal-icon') : fallback('card-animal-fallback'); card.prepend(icon); }); }
    finally { updatingCards=false; }
  }

  async function loadIcons() {
    const pages = await Promise.all([1,2,3].map(page => fetch(`${API_BASE}?ref=main&per_page=100&page=${page}`, {headers:{Accept:'application/vnd.github+json'}}).then(r => r.ok ? r.json() : []).catch(() => [])));
    iconFiles = pages.flat().filter(file => file?.type === 'file' && /\.(png|jpe?g|webp|gif)$/i.test(file.name)).sort((a,b) => a.name.localeCompare(b.name, undefined, {numeric:true}));
  }

  async function init() {
    applyHeaderImages(); addStyles();
    const cards=document.getElementById('cards'); if (cards) new MutationObserver(addCardIcons).observe(cards,{childList:true,subtree:true});
    await loadIcons(); putIcons(); addCardIcons();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true}); else init();
})();
