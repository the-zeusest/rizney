/* Animal artwork for the playlist and six-card music reading. */
(() => {
  "use strict";

  const ICONS_API = "https://api.github.com/repos/the-zeusest/rizney/contents/assets/animal-icons?ref=main";
  const ICONS_RAW = "https://raw.githubusercontent.com/the-zeusest/rizney/main/assets/animal-icons/";
  let iconFiles = [];

  const animalName = filename => filename
    .replace(/\.(png|jpe?g|webp|gif)$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, letter => letter.toUpperCase());

  function fallback(className) {
    const element = document.createElement("span");
    element.className = className;
    element.textContent = "🐾";
    element.setAttribute("aria-label", "Animal icon unavailable");
    return element;
  }

  function makeImage(file, className) {
    const image = document.createElement("img");
    image.className = className;
    image.alt = animalName(file.name);
    image.title = animalName(file.name);
    image.loading = "lazy";
    image.decoding = "async";
    image.src = file.download_url || `${ICONS_RAW}${encodeURIComponent(file.name)}`;
    image.addEventListener("error", () => {
      image.replaceWith(fallback(className.replace("-icon", "-fallback")));
    }, { once: true });
    return image;
  }

  function addStyles() {
    if (document.getElementById("animal-icons-style")) return;
    const style = document.createElement("style");
    style.id = "animal-icons-style";
    style.textContent = `
      #song-list .song {
        display: grid;
        grid-template-columns: 56px minmax(0, 1fr);
        gap: 10px;
        align-items: center;
      }
      #song-list .song-number,
      #song-list .song .play { display: none; }
      .song-animal-button {
        display: grid;
        place-items: center;
        width: 56px;
        height: 56px;
        padding: 0;
        border: 1px solid var(--gold, #d4af37);
        border-radius: 10px;
        background: #000;
        cursor: pointer;
        overflow: hidden;
      }
      .song-animal-button:hover { background: #261334; }
      .song-animal-button:focus-visible {
        outline: 2px solid var(--bright-gold, #f5d76e);
        outline-offset: 2px;
      }
      .song-animal-icon,
      .song-animal-fallback {
        width: 50px;
        height: 50px;
        object-fit: contain;
        border-radius: 8px;
        background: #000;
        padding: 2px;
      }
      .song-animal-fallback {
        display: grid;
        place-items: center;
        font-size: 1.8rem;
      }
      #cards {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
      }
      #cards .card {
        min-height: 0;
        height: auto;
        padding: 10px 8px;
        background: #000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        text-align: center;
      }
      #cards .card .symbol { display: none; }
      #cards .card strong { margin: 0 0 6px; }
      .card-animal-icon,
      .card-animal-fallback {
        display: block;
        width: 112px;
        height: 112px;
        margin: 0 auto 6px;
        object-fit: contain;
        border-radius: 12px;
        background: #000;
      }
      .card-animal-fallback {
        display: grid;
        place-items: center;
        font-size: 3rem;
      }
      @media (max-width: 640px) {
        #song-list .song {
          grid-template-columns: 46px minmax(0, 1fr);
          gap: 8px;
          padding: 8px;
        }
        .song-animal-button { width: 46px; height: 46px; }
        .song-animal-icon,
        .song-animal-fallback { width: 42px; height: 42px; }
        #cards { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
        #cards .card { padding: 8px 5px; }
        .card-animal-icon,
        .card-animal-fallback { width: 82px; height: 82px; }
      }
    `;
    document.head.appendChild(style);
  }

  async function loadIconFiles() {
    const response = await fetch(ICONS_API, {
      headers: { Accept: "application/vnd.github+json" }
    });
    if (!response.ok) throw new Error(`Animal icon request failed: ${response.status}`);
    const data = await response.json();
    iconFiles = data
      .filter(file => file?.type === "file" && /\.(png|jpe?g|webp|gif)$/i.test(file.name))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  }

  function getRows() {
    return [...document.querySelectorAll("#song-list > .song")];
  }

  function decorateRows() {
    getRows().forEach((row, index) => {
      if (row.querySelector(":scope > .song-animal-button")) return;
      const file = iconFiles[index];
      const button = document.createElement("button");
      button.type = "button";
      button.className = "song-animal-button";
      button.title = file ? `Play ${animalName(file.name)}` : `Play song ${index + 1}`;
      button.setAttribute("aria-label", button.title);
      button.appendChild(file ? makeImage(file, "song-animal-icon") : fallback("song-animal-fallback"));
      button.addEventListener("click", () => row.querySelector(".play")?.click());
      row.prepend(button);
    });
  }

  function getCardSongIndex(card) {
    const link = card.querySelector("a");
    const match = link?.textContent.match(/(\d+)/);
    return match ? Number(match[1]) - 1 : -1;
  }

  function decorateCards() {
    document.querySelectorAll("#cards .card").forEach(card => {
      const file = iconFiles[getCardSongIndex(card)];
      card.querySelector(".symbol")?.remove();
      card.querySelector(".card-animal-icon, .card-animal-fallback")?.remove();
      const heading = card.querySelector("strong");
      if (heading && file) heading.textContent = animalName(file.name);
      card.prepend(file ? makeImage(file, "card-animal-icon") : fallback("card-animal-fallback"));
    });
  }

  async function init() {
    addStyles();
    const list = document.getElementById("song-list");
    const cards = document.getElementById("cards");
    if (list) new MutationObserver(decorateRows).observe(list, { childList: true, subtree: true });
    if (cards) new MutationObserver(decorateCards).observe(cards, { childList: true, subtree: true });
    document.addEventListener("click", event => {
      if (event.target.closest?.("#draw-cards")) setTimeout(decorateCards, 0);
    }, true);
    try {
      await loadIconFiles();
    } catch (error) {
      console.warn("Animal icons could not be loaded.", error);
    }
    decorateRows();
    decorateCards();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
