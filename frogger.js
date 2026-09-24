/* Animal controls and animal cards for the Rizney playlist. */
(() => {
  "use strict";

  const API = "https://api.github.com/repos/the-zeusest/rizney/contents/assets/animal-icons";
  const RAW = "https://raw.githubusercontent.com/the-zeusest/rizney/main/assets/animal-icons/";
  const FALLBACK = "🐾";
  let iconFiles = [];
  let iconPromise;
  let cardsObserver;

  const $ = selector => document.querySelector(selector);
  const all = selector => [...document.querySelectorAll(selector)];
  const animalName = name => name.replace(/\.(png|jpe?g|webp|gif)$/i, "").replace(/[-_]+/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  function placeholder(className) {
    const span = document.createElement("span");
    span.className = className;
    span.textContent = FALLBACK;
    span.setAttribute("aria-label", "Animal icon unavailable");
    return span;
  }

  function icon(file, className) {
    const img = document.createElement("img");
    img.className = className;
    img.alt = animalName(file.name);
    img.loading = "lazy";
    img.decoding = "async";
    img.src = file.download_url || `${RAW}${encodeURIComponent(file.name)}`;
    img.onerror = () => img.replaceWith(placeholder(className.replace("-icon", "-fallback")));
    return img;
  }

  function styles() {
    if (document.getElementById("animal-icon-styles")) return;
    const style = document.createElement("style");
    style.id = "animal-icon-styles";
    style.textContent = `
      #song-list .song { display:grid; grid-template-columns:52px minmax(0,1fr); gap:10px; align-items:center; }
      #song-list .song-number, #song-list .song .play { display:none; }
      .song-animal-button { display:grid; place-items:center; width:52px; height:52px; padding:0; border:1px solid var(--gold,#d4af37); border-radius:10px; background:#000; cursor:pointer; overflow:hidden; }
      .song-animal-button:hover { background:#261334; }
      .song-animal-button:focus-visible { outline:2px solid var(--bright-gold,#f5d76e); outline-offset:2px; }
      .song-animal-icon,.song-animal-fallback { width:48px; height:48px; object-fit:contain; border-radius:8px; background:#000; padding:2px; }
      .song-animal-fallback { display:grid; place-items:center; font-size:1.8rem; }
      #cards { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px; }
      #cards .card { min-height:0; height:auto; padding:10px 8px; background:#000; display:flex; flex-direction:column; align-items:center; justify-content:space-between; }
      #cards .card .symbol { display:none; }
      .card-animal-icon,.card-animal-fallback { display:block; width:112px; height:112px; margin:0 auto 6px; object-fit:contain; border-radius:12px; background:#000; }
      .card-animal-fallback { padding-top:28px; box-sizing:border-box; text-align:center; font-size:3rem; }
      @media(max-width:640px) { #song-list .song { grid-template-columns:46px minmax(0,1fr); gap:8px; padding:8px; } .song-animal-button { width:46px; height:46px; } .song-animal-icon,.song-animal-fallback { width:42px; height:42px; } #cards { grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; } .card-animal-icon,.card-animal-fallback { width:82px; height:82px; } }
    `;
    document.head.appendChild(style);
  }

  async function loadIcons() {
    if (iconPromise) return iconPromise;
    iconPromise = (async () => {
      const result = [];
      for (let page = 1; page <= 5; page += 1) {
        const response = await fetch(`${API}?ref=main&per_page=100&page=${page}`, { headers: { Accept: "application/vnd.github+json" } });
        if (!response.ok) throw new Error(`Icon request failed: ${response.status}`);
        const pageFiles = await response.json();
        if (!Array.isArray(pageFiles) || pageFiles.length === 0) break;
        result.push(...pageFiles);
        if (pageFiles.length < 100) break;
      }
      iconFiles = result
        .filter(file => file && file.type === "file" && /\.(png|jpe?g|webp|gif)$/i.test(file.name))
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
      return iconFiles;
    })();
    return iconPromise;
  }

  function playlistRows() {
    return all("#song-list > .song");
  }

  function decorateRows() {
    const rows = playlistRows();
    rows.forEach((row, index) => {
      row.dataset.songIndex = String(index);
      if (row.querySelector(":scope > .song-animal-button")) return;
      const file = iconFiles[index];
      const button = document.createElement("button");
      button.type = "button";
      button.className = "song-animal-button";
      button.title = `Play ${file ? animalName(file.name) : `Song ${index + 1}`}`;
      button.setAttribute("aria-label", button.title);
      button.appendChild(file ? icon(file, "song-animal-icon") : placeholder("song-animal-fallback"));
      button.addEventListener("click", () => row.querySelector(".play")?.click());
      row.prepend(button);
    });
  }

  function cardIndex(card) {
    const link = card.querySelector("a");
    const match = link?.textContent.match(/(\d+)/);
    return match ? Number(match[1]) - 1 : -1;
  }

  function decorateCards() {
    all("#cards .card").forEach(card => {
      const index = cardIndex(card);
      const file = iconFiles[index];
      card.querySelector(".symbol")?.remove();
      card.querySelector(".card-animal-icon,.card-animal-fallback")?.remove();
      const heading = card.querySelector("strong");
      if (heading && file) heading.textContent = animalName(file.name);
      card.prepend(file ? icon(file, "card-animal-icon") : placeholder("card-animal-fallback"));
    });
  }

  function ensureCardsFallback() {
    const button = $("#draw-cards");
    if (!button || button.dataset.animalCardsBound === "true") return;
    button.dataset.animalCardsBound = "true";
    button.addEventListener("click", () => {
      // The main playlist handler normally creates the cards. This delayed
      // pass makes the icons appear after that handler has finished.
      setTimeout(decorateCards, 0);
    });
  }

  async function init() {
    styles();
    const list = $("#song-list");
    const cards = $("#cards");
    if (list) new MutationObserver(decorateRows).observe(list, { childList: true, subtree: true });
    if (cards) {
      cardsObserver = new MutationObserver(decorateCards);
      cardsObserver.observe(cards, { childList: true, subtree: true });
    }
    ensureCardsFallback();
    try { await loadIcons(); } catch (error) { console.warn("Animal icons could not be loaded.", error); }
    decorateRows();
    decorateCards();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
