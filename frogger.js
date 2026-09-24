/* Rizney animal icons: one icon is paired with each song by filename order. */
(() => {
  "use strict";

  const API = "https://api.github.com/repos/the-zeusest/rizney/contents/assets/animal-icons";
  const RAW = "https://raw.githubusercontent.com/the-zeusest/rizney/main/assets/animal-icons/";
  const FALLBACK = "🐾";
  let files = [];
  let busy = false;

  const label = name => name
    .replace(/\.(png|jpe?g|webp|gif)$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());

  function fallback(className) {
    const el = document.createElement("span");
    el.className = className;
    el.textContent = FALLBACK;
    el.setAttribute("aria-label", "Animal icon unavailable");
    return el;
  }

  function image(file, className) {
    const img = document.createElement("img");
    img.className = className;
    img.alt = label(file.name);
    img.loading = "lazy";
    img.decoding = "async";
    // Prefer GitHub's URL from the directory API. This handles spaces and
    // parentheses in filenames more reliably than constructing a URL by hand.
    img.src = file.download_url || RAW + encodeURIComponent(file.name);
    img.onerror = () => img.replaceWith(fallback(className.replace("-icon", "-fallback")));
    return img;
  }

  function addStyles() {
    if (document.getElementById("animal-icon-styles")) return;
    const style = document.createElement("style");
    style.id = "animal-icon-styles";
    style.textContent = `
      .song { position: relative; }
      .song-animal-button { display:grid; place-items:center; width:52px; height:52px; padding:0; border:1px solid var(--gold,#d4af37); border-radius:10px; background:#000; cursor:pointer; overflow:hidden; }
      .song-animal-button:hover { background:#261334; }
      .song-animal-button:focus-visible { outline:2px solid var(--bright-gold,#f5d76e); outline-offset:2px; }
      .song-animal-icon,.song-animal-fallback { width:48px; height:48px; object-fit:contain; border-radius:8px; background:#000; padding:2px; }
      .song-animal-fallback { display:grid; place-items:center; font-size:1.8rem; }
      #song-list .song { display:grid; grid-template-columns:52px minmax(0,1fr); gap:10px; align-items:center; }
      #song-list .song-number,#song-list .song .play { display:none; }
      #cards { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px; }
      #cards .card { background:#000; min-height:0; height:auto; padding:10px 8px; display:flex; flex-direction:column; align-items:center; justify-content:space-between; }
      #cards .card .symbol { display:none; }
      .card-animal-icon,.card-animal-fallback { display:block; width:112px; height:112px; margin:0 auto 6px; object-fit:contain; border-radius:12px; background:#000; }
      .card-animal-fallback { padding-top:28px; box-sizing:border-box; text-align:center; font-size:3rem; }
      @media(max-width:640px) { #song-list .song { grid-template-columns:46px minmax(0,1fr); gap:8px; padding:8px; } .song-animal-button { width:46px; height:46px; } .song-animal-icon,.song-animal-fallback { width:42px; height:42px; } #cards { grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; } .card-animal-icon,.card-animal-fallback { width:82px; height:82px; } }
    `;
    document.head.appendChild(style);
  }

  const rows = () => [...document.querySelectorAll("#song-list .song, .song")];

  function addRowIcons() {
    rows().forEach((row, index) => {
      if (row.querySelector(".song-animal-button")) return;
      const file = files[index];
      const icon = file ? image(file, "song-animal-icon") : fallback("song-animal-fallback");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "song-animal-button";
      button.title = `Play ${file ? label(file.name) : `song ${index + 1}`}`;
      button.setAttribute("aria-label", button.title);
      button.appendChild(icon);
      button.addEventListener("click", () => row.querySelector(".play")?.click());
      row.prepend(button);
    });
  }

  function cardSongIndex(card) {
    const link = card.querySelector("a");
    const match = link?.textContent.match(/(\d+)/);
    return match ? Number(match[1]) - 1 : -1;
  }

  function addCardIcons() {
    if (busy) return;
    busy = true;
    try {
      document.querySelectorAll("#cards .card").forEach(card => {
        const index = cardSongIndex(card);
        const file = files[index];
        card.querySelector(".symbol")?.remove();
        const heading = card.querySelector("strong");
        if (heading && file) heading.textContent = label(file.name);
        if (card.querySelector(".card-animal-icon,.card-animal-fallback")) return;
        card.prepend(file ? image(file, "card-animal-icon") : fallback("card-animal-fallback"));
      });
    } finally { busy = false; }
  }

  async function loadFiles() {
    const all = [];
    for (let page = 1; page <= 5; page += 1) {
      const response = await fetch(`${API}?ref=main&per_page=100&page=${page}`, { headers: { Accept: "application/vnd.github+json" } });
      if (!response.ok) throw new Error(`Animal icon request failed: ${response.status}`);
      const pageFiles = await response.json();
      if (!Array.isArray(pageFiles) || !pageFiles.length) break;
      all.push(...pageFiles);
      if (pageFiles.length < 100) break;
    }
    files = all.filter(file => file?.type === "file" && /\.(png|jpe?g|webp|gif)$/i.test(file.name))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  }

  async function init() {
    addStyles();
    const list = document.querySelector("#song-list") || document.body;
    const cards = document.querySelector("#cards");
    new MutationObserver(addRowIcons).observe(list, { childList: true, subtree: true });
    if (cards) new MutationObserver(addCardIcons).observe(cards, { childList: true, subtree: true });
    try { await loadFiles(); } catch (error) { console.warn("Animal icons could not be loaded.", error); }
    addRowIcons();
    addCardIcons();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
