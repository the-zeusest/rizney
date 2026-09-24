(() => {
  "use strict";

  const ICONS_URL = "https://api.github.com/repos/the-zeusest/rizney/contents/assets/animal-icons?ref=main";
  const RAW_BASE = "https://raw.githubusercontent.com/the-zeusest/rizney/main/assets/animal-icons/";
  let iconFiles = [];

  const animalName = filename => {
    const name = filename.replace(/\.(png|jpe?g|webp|gif)$/i, "");
    return name
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, letter => letter.toUpperCase());
  };

  const safeFile = index => {
    if (!iconFiles.length) return null;
    return iconFiles[index % iconFiles.length] || null;
  };

  function fallback(className) {
    const element = document.createElement("span");
    element.className = className;
    element.textContent = "🐾";
    element.setAttribute("aria-label", "Animal icon unavailable");
    return element;
  }

  function makeImage(file, className, label) {
    const image = document.createElement("img");
    image.className = className;
    image.alt = label;
    image.title = label;
    image.loading = "lazy";
    image.decoding = "async";
    image.src = file?.download_url || `${RAW_BASE}${encodeURIComponent(file.name)}`;
    image.addEventListener("error", () => {
      image.replaceWith(fallback(className.replace("-icon", "-fallback")));
    }, { once: true });
    return image;
  }

  function ensureStyles() {
    if (document.getElementById("animal-icons-style")) return;

    const style = document.createElement("style");
    style.id = "animal-icons-style";
    style.textContent = `
      .song-animal-button {
        display: grid;
        place-items: center;
        width: 52px;
        height: 52px;
        padding: 0;
        margin-right: 10px;
        border: 1px solid rgba(212, 175, 55, 0.7);
        border-radius: 12px;
        background: rgba(0, 0, 0, 0.6);
        cursor: pointer;
        transition: transform 0.15s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        box-shadow: 0 0 0 1px rgba(255,255,255,0.04) inset;
      }

      .song-animal-button:hover {
        transform: translateY(-1px);
        border-color: rgba(245, 215, 110, 1);
        box-shadow: 0 8px 24px rgba(245, 215, 110, 0.14);
      }

      .song-animal-button:focus-visible {
        outline: 2px solid #f5d76e;
        outline-offset: 2px;
      }

      .song-animal-icon,
      .song-animal-fallback {
        width: 42px;
        height: 42px;
        object-fit: contain;
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.8);
        display: grid;
        place-items: center;
      }

      .song-animal-fallback {
        font-size: 1.8rem;
      }

      #cards {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
      }

      #cards .card {
        min-height: 220px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        text-align: center;
        padding: 12px 10px 10px;
        background: rgba(13, 13, 13, 0.9);
        border: 1px solid rgba(212, 175, 55, 0.55);
        border-radius: 16px;
        box-shadow: 0 12px 30px rgba(0,0,0,0.25);
      }

      #cards .card .symbol {
        display: none !important;
      }

      .card-animal-icon,
      .card-animal-fallback {
        width: 110px;
        height: 110px;
        object-fit: contain;
        border-radius: 14px;
        display: block;
        margin: 0 auto 8px;
        background: rgba(0, 0, 0, 0.8);
      }

      .card-animal-fallback {
        display: grid;
        place-items: center;
        font-size: 3rem;
      }

      #cards .card strong {
        margin: 0;
        font-size: 0.82rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: #f5d76e;
      }

      #cards .card a {
        margin-top: 6px;
        font-size: 0.8rem;
        color: #f3f0e7;
        text-decoration: none;
      }

      @media (max-width: 640px) {
        #cards {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .card-animal-icon,
        .card-animal-fallback {
          width: 84px;
          height: 84px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  async function loadIcons() {
    try {
      const response = await fetch(ICONS_URL, {
        headers: { Accept: "application/vnd.github+json" }
      });

      if (!response.ok) throw new Error(`icon fetch failed: ${response.status}`);

      const files = await response.json();
      iconFiles = (Array.isArray(files) ? files : [])
        .filter(file => file && file.type === "file" && /\.(png|jpe?g|webp|gif)$/i.test(file.name))
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    } catch (error) {
      console.warn("Animal icons not available right now:", error);
      iconFiles = [];
    }
  }

  function decorateRows() {
    const rows = [...document.querySelectorAll("#song-list .song, .song")];

    rows.forEach((row, index) => {
      if (row.querySelector(".song-animal-button")) return;

      const file = safeFile(index);
      const label = file ? animalName(file.name) : `Song ${index + 1}`;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "song-animal-button";
      button.title = `Play ${label}`;
      button.setAttribute("aria-label", `Play ${label}`);

      const image = file ? makeImage(file, "song-animal-icon", label) : fallback("song-animal-fallback");
      button.appendChild(image);

      const playButton = row.querySelector(".play, button.play");
      if (playButton) {
        button.addEventListener("click", () => playButton.click());
      }

      row.prepend(button);
    });
  }

  function getCardSongIndex(card) {
    const anchor = card.querySelector("a");
    if (!anchor) return -1;

    const match = anchor.textContent.match(/(\d+)/);
    return match ? Number(match[1]) - 1 : -1;
  }

  function decorateCards() {
    const cards = document.querySelectorAll("#cards .card");

    cards.forEach(card => {
      const songIndex = getCardSongIndex(card);
      const file = songIndex >= 0 ? safeFile(songIndex) : null;
      const label = file ? animalName(file.name) : "Animal";

      const existingSymbol = card.querySelector(".symbol");
      if (existingSymbol) existingSymbol.remove();

      const existingImage = card.querySelector(".card-animal-icon, .card-animal-fallback");
      if (existingImage) existingImage.remove();

      const title = card.querySelector("strong");
      if (title) title.textContent = label;

      const image = file ? makeImage(file, "card-animal-icon", label) : fallback("card-animal-fallback");
      card.prepend(image);
    });
  }

  function start() {
    ensureStyles();
    decorateRows();
    decorateCards();

    const listRoot = document.getElementById("song-list");
    if (listRoot) {
      const rowObserver = new MutationObserver(() => decorateRows());
      rowObserver.observe(listRoot, { childList: true, subtree: true });
    }

    const cardsRoot = document.getElementById("cards");
    if (cardsRoot) {
      const cardObserver = new MutationObserver(() => decorateCards());
      cardObserver.observe(cardsRoot, { childList: true, subtree: true });
    }

    document.addEventListener("click", event => {
      if (event.target.closest && event.target.closest("#draw-cards")) {
        setTimeout(decorateCards, 0);
      }
    }, true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", async () => {
      await loadIcons();
      start();
    }, { once: true });
  } else {
    loadIcons().then(start);
  }
})();
