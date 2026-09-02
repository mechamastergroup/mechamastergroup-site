/* ==========================================================================
   MechaMaster Group - Core JavaScript Engine
   Theme Switcher | Portfolio Category Filter | Interactive Showcase
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme State Management
  let currentTheme = localStorage.getItem('mmg_theme') || 'dark';

  const htmlRoot = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggle');
  const mobileToggleBtn = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const headerEl = document.querySelector('.header');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const toastNotice = document.getElementById('toastNotice');

  // Apply Theme (Dark / Light)
  function applyTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('mmg_theme', theme);
    htmlRoot.setAttribute('data-theme', theme);

    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = theme === 'dark' 
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }
  applyTheme(currentTheme);

  // 2. Mobile Menu Drawer
  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => navMenu.classList.remove('open'));
    });
  }

  // 3. Scroll Header & Back To Top Button
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      headerEl?.classList.add('scrolled');
    } else {
      headerEl?.classList.remove('scrolled');
    }

    if (window.scrollY > 450) {
      scrollTopBtn?.classList.add('visible');
    } else {
      scrollTopBtn?.classList.remove('visible');
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 4. Portfolio Filter (All, MEP, Machines, Fluid & Thermal, CAD & Assemblies)
  const filterPills = document.querySelectorAll('.filter-pill');
  const projectCards = document.querySelectorAll('.project-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filterCat = pill.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (filterCat === 'all' || cardCat === filterCat) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 5. Toast Notification System
  function displayToast(msg) {
    if (!toastNotice) return;
    toastNotice.textContent = msg;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 4500);
  }

  // 6. Contact & Inquiry Form
  const contactForm = document.getElementById('engineeringContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      displayToast('Thank you for contacting MechaMaster Group. Your inquiry has been received and our engineering team will respond promptly.');
      contactForm.reset();
    });
  }

  const newsForm = document.getElementById('engineeringNewsletterForm');
  if (newsForm) {
    newsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      displayToast('Thank you for subscribing to MechaMaster Engineering Digest!');
      newsForm.reset();
    });
  }

   // 7. Full Screen Section Reveal Animation
  const screens = document.querySelectorAll(
    '.hero-section, .standards-bar, .services-section, .projects-section, .contact-section, .footer'
  );

  screens.forEach(screen => {
    screen.classList.add('reveal-screen');
  });

  const screenObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('screen-visible');
      } else {
        entry.target.classList.remove('screen-visible');
      }
    });
  }, {
    threshold: 0.2
  });

  screens.forEach(screen => {
    screenObserver.observe(screen);
  });


  // 8. MMG Intro Splash Screen
  const siteIntro = document.getElementById('siteIntro');

  if (siteIntro) {
    document.body.classList.add('intro-active');

    window.setTimeout(() => {
      siteIntro.classList.add('intro-hidden');
      document.body.classList.remove('intro-active');
    }, 3950);
  }

});
