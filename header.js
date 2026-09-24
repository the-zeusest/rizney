(() => {
  "use strict";

  function restoreHeader() {
    const header = document.querySelector(".top-area");
    const heading = header?.querySelector("h1");
    if (!header || !heading) return;

    header.querySelector(".tagline")?.remove();

    let donate = header.querySelector(".donate");
    let context = header.querySelector(".context-link");
    if (!context) {
      context = document.createElement("a");
      context.className = "context-link";
      donate?.insertAdjacentElement("afterend", context);
      if (!context.isConnected) header.appendChild(context);
    }
    context.href = "./context.html";
    context.textContent = "CONTEXT";
    context.setAttribute("aria-label", "Read context");
    context.title = "Read context";

    let logo = header.querySelector(".rizney-logo");
    if (!logo) {
      logo = document.createElement("img");
      logo.className = "rizney-logo";
      logo.src = "./assets/rizney.png";
      logo.alt = "Rizney";
      logo.decoding = "async";
      header.appendChild(logo);
    }

    let footer = document.getElementById("site-footer");
    if (!footer) {
      footer = document.createElement("footer");
      footer.id = "site-footer";
      footer.setAttribute("aria-label", "Site footer");
      document.body.appendChild(footer);
    }

    let curse = footer.querySelector(".curse-logo");
    if (!curse) {
      curse = document.createElement("img");
      curse.className = "curse-logo";
      curse.src = "./assets/curse.png";
      curse.alt = "Curse";
      curse.decoding = "async";
      footer.appendChild(curse);
    }

    heading.textContent = "";

    if (!document.getElementById("header-image-overrides")) {
      const style = document.createElement("style");
      style.id = "header-image-overrides";
      style.textContent = `
        .top-area { position:relative!important; min-height:clamp(88px,14vw,120px)!important; margin:0 0 14px!important; padding:0!important; line-height:0!important; font-size:0!important; }
        .top-area h1 { display:block!important; width:100%!important; min-height:clamp(88px,14vw,120px)!important; height:clamp(88px,14vw,120px)!important; margin:0!important; padding:0!important; }
        .top-area .tagline { display:none!important; }
        .top-area .donate, .top-area .context-link { display:block!important; position:absolute!important; top:12px!important; z-index:10!important; border:1px solid var(--gold)!important; border-radius:999px!important; padding:8px 12px!important; line-height:1!important; font-size:.85rem!important; color:var(--bright-gold)!important; background:#160c1c!important; text-decoration:none!important; }
        .top-area .donate { left:12px!important; }
        .top-area .context-link { left:105px!important; }
        .top-area .donate:hover, .top-area .context-link:hover, .top-area .donate:focus-visible, .top-area .context-link:focus-visible { color:#fff!important; background:#24132f!important; }
        .top-area .rizney-logo { position:absolute!important; top:12px!important; right:16px!important; display:block!important; width:clamp(76px,17vw,165px)!important; height:auto!important; }
        main { padding-bottom:0!important; }
        #site-footer { display:flex!important; justify-content:center!important; align-items:flex-end!important; width:100%!important; margin:0!important; padding:0!important; }
        #site-footer .curse-logo { display:block!important; width:min(62vw,500px)!important; height:auto!important; margin:0 auto!important; }
        @media(max-width:500px) { .top-area,.top-area h1{min-height:82px!important;height:82px!important}.top-area{margin-bottom:10px!important}.top-area .donate,.top-area .context-link{top:8px!important;padding:7px 11px!important;font-size:.78rem!important}.top-area .donate{left:8px!important}.top-area .context-link{left:91px!important}.top-area .rizney-logo{top:8px!important;right:8px!important;width:72px!important}#site-footer .curse-logo{width:60vw!important} }
      `;
      document.head.appendChild(style);
    }
  }

  function loadAnimals() {
    if (document.querySelector("script[data-animal-icons]")) return;
    const script = document.createElement("script");
    script.src = "./animal-icons.js";
    script.dataset.animalIcons = "true";
    document.body.appendChild(script);
  }

  function init() {
    restoreHeader();
    loadAnimals();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once:true });
  else init();
})();
