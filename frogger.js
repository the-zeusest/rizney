(() => {
  function applyHeaderImages() {
    const header = document.querySelector('.top-area');
    const heading = header?.querySelector('h1');
    const tagline = header?.querySelector('.tagline');

    if (!header || !heading) return;

    tagline?.remove();

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

    // Keep the original heading as the visible header container so the
    // Donate button and Rizney logo have room to render.
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
        .top-area {
          position: relative !important;
          min-height: clamp(88px, 14vw, 120px) !important;
          margin: 0 0 14px !important;
          padding: 0 !important;
          line-height: 0 !important;
          font-size: 0 !important;
        }

        .top-area h1 {
          display: block !important;
          width: 100% !important;
          min-height: clamp(88px, 14vw, 120px) !important;
          height: clamp(88px, 14vw, 120px) !important;
          margin: 0 !important;
          padding: 0 !important;
          line-height: 0 !important;
          font-size: 0 !important;
        }

        .top-area .tagline {
          display: none !important;
        }

        .top-area .donate {
          top: 12px !important;
          left: 12px !important;
          padding: 8px 13px !important;
          font-size: .82rem !important;
          line-height: 1.2 !important;
          z-index: 2 !important;
        }

        .top-area .rizney-logo {
          position: absolute !important;
          top: 12px !important;
          right: 16px !important;
          display: block !important;
          width: clamp(76px, 17vw, 165px) !important;
          height: auto !important;
          max-height: 120px !important;
          object-fit: contain !important;
          z-index: 2 !important;
        }

        /* Keep the footer directly under the final song while adding the
           same gold divider used elsewhere on the site. */
        main {
          padding-bottom: 0 !important;
        }

        #site-footer {
          display: flex !important;
          justify-content: center !important;
          align-items: flex-end !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          border-top: 1px solid var(--gold, #d4af37) !important;
          line-height: 0 !important;
        }

        #site-footer .curse-logo {
          display: block !important;
          width: min(62vw, 500px) !important;
          max-width: none !important;
          height: auto !important;
          max-height: none !important;
          margin: 0 auto !important;
          padding: 0 !important;
          border: 0 !important;
          object-fit: contain !important;
          vertical-align: bottom !important;
        }

        @media (max-width: 500px) {
          .top-area {
            min-height: 82px !important;
            margin-bottom: 10px !important;
          }

          .top-area h1 {
            min-height: 82px !important;
            height: 82px !important;
          }

          .top-area .donate {
            top: 8px !important;
            left: 8px !important;
            padding: 7px 11px !important;
            font-size: .78rem !important;
          }

          .top-area .rizney-logo {
            top: 8px !important;
            right: 8px !important;
            width: 72px !important;
          }

          #site-footer .curse-logo {
            width: 60vw !important;
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
