(() => {
  function applyHeaderImages() {
    const header = document.querySelector('.top-area');
    const heading = header?.querySelector('h1');
    const tagline = header?.querySelector('.tagline');

    if (!header || !heading) return;

    tagline?.remove();

    let curseLogo = heading.querySelector('.curse-logo');
    if (!curseLogo) {
      curseLogo = document.createElement('img');
      curseLogo.src = './assets/curse.png';
      curseLogo.alt = 'Curse';
      curseLogo.className = 'curse-logo';
      curseLogo.decoding = 'async';
      heading.replaceChildren(curseLogo);
    }

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
        .top-area {
          position: relative !important;
          padding: 0 !important;
          margin: 0 !important;
          line-height: 0 !important;
          font-size: 0 !important;
        }

        .top-area .tagline {
          display: none !important;
        }

        .top-area h1 {
          display: block !important;
          width: 100% !important;
          min-height: 0 !important;
          height: auto !important;
          margin: 0 !important;
          padding: 0 !important;
          line-height: 0 !important;
          font-size: 0 !important;
        }

        .top-area .curse-logo {
          display: block !important;
          width: min(78vw, 620px) !important;
          max-width: none !important;
          height: auto !important;
          max-height: none !important;
          margin: 0 auto !important;
          padding: 0 !important;
          border: 0 !important;
          object-fit: contain !important;
          vertical-align: top !important;
        }

        .top-area .rizney-logo {
          position: absolute !important;
          top: 10px !important;
          right: 14px !important;
          display: block !important;
          width: clamp(56px, 12vw, 120px) !important;
          height: auto !important;
          max-height: 100px !important;
          object-fit: contain !important;
          z-index: 2 !important;
        }

        @media (max-width: 500px) {
          .top-area .curse-logo {
            width: 72vw !important;
          }

          .top-area .rizney-logo {
            top: 8px !important;
            right: 8px !important;
            width: 52px !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyHeaderImages, { once: true });
  } else {
    applyHeaderImages();
  }
})();
