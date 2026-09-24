(() => {
  "use strict";

  function restoreHeader() {
    const header = document.querySelector(".top-area");
    const heading = header && header.querySelector("h1");
    if (!header || !heading) return;

    header.querySelector(".tagline")?.remove();

    let donate = header.querySelector(".donate");
    let context = header.querySelector(".context-link");

    if (!context) {
      context = document.createElement("a");
      context.className = "context-link";
      context.href = "context.html";
      context.textContent = "Context";
      context.target = "_blank";
      context.rel = "noopener";
      context.setAttribute("aria-label", "Open the music context page");
      if (donate) {
        donate.insertAdjacentElement("afterend", context);
      } else {
        header.appendChild(context);
      }
    }

    if (!header.querySelector(".header-logo")) {
      const logo = document.createElement("img");
      logo.className = "header-logo";
      logo.src = "./assets/rizney.png";
      logo.alt = "Rizney";
      logo.loading = "eager";
      logo.style.display = "block";
      logo.style.maxWidth = "180px";
      logo.style.margin = "0 auto 10px";
      header.prepend(logo);
    }

    if (!header.querySelector(".header-curse")) {
      const curse = document.createElement("img");
      curse.className = "header-curse";
      curse.src = "./assets/curse.png";
      curse.alt = "Curse";
      curse.loading = "eager";
      curse.style.display = "block";
      curse.style.maxWidth = "110px";
      curse.style.margin = "10px auto 0";
      header.appendChild(curse);
    }
  }

  function loadAnimals() {
    if (document.querySelector("script[data-animal-icons]")) return;
    const script = document.createElement("script");
    script.src = "./animal-icons.js";
    script.dataset.animalIcons = "true";
    script.async = true;
    document.body.appendChild(script);
  }

  function unblockCards() {
    const button = document.getElementById("draw-cards");
    if (!button || button.dataset.cardsCleaned) return;

    const clean = button.cloneNode(true);
    clean.onclick = button.onclick;
    button.replaceWith(clean);
    clean.dataset.cardsCleaned = "true";
  }

  function init() {
    restoreHeader();
    unblockCards();
    loadAnimals();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
