(() => {
  const header = document.querySelector('.top-area');
  const heading = header?.querySelector('h1');
  const tagline = header?.querySelector('.tagline');

  if (!header || !heading) return;

  tagline?.remove();

  const curseLogo = document.createElement('img');
  curseLogo.src = './assets/curse.png';
  curseLogo.alt = 'Curse';
  curseLogo.className = 'curse-logo';
  curseLogo.decoding = 'async';

  heading.replaceChildren(curseLogo);

  const rizneyLogo = document.createElement('img');
  rizneyLogo.src = './assets/rizney.png';
  rizneyLogo.alt = 'Rizney';
  rizneyLogo.className = 'rizney-logo';
  rizneyLogo.decoding = 'async';
  header.appendChild(rizneyLogo);

  const style = document.createElement('style');
  style.textContent = `
    .top-area {
      padding-top: 0;
    }

    .top-area h1 {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 150px;
      margin-top: 0;
    }

    .curse-logo {
      display: block;
      max-width: min(85vw, 600px);
      max-height: 180px;
      width: auto;
      height: auto;
      object-fit: contain;
    }

    .rizney-logo {
      position: absolute;
      top: 10px;
      right: 14px;
      display: block;
      width: clamp(56px, 12vw, 120px);
      height: auto;
      max-height: 100px;
      object-fit: contain;
    }

    @media (max-width: 500px) {
      .top-area h1 {
        padding: 18px 56px 8px;
      }

      .curse-logo {
        max-width: 78vw;
        max-height: 130px;
      }

      .rizney-logo {
        top: 8px;
        right: 8px;
        width: 52px;
      }
    }
  `;
  document.head.appendChild(style);
})();
