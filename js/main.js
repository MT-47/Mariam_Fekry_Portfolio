// ================================
// main.js — Mariam Fekry Portfolio
// ================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Lenis Smooth Scroll ---
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Integrate Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  // --- Smooth scroll for all anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        lenis.scrollTo(target, { offset: -70, duration: 1.4 });
      }
    });
  });

  // --- Navbar: shrink on scroll ---
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // --- Active nav link on scroll ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function updateActiveLink() {
    const scrollY = window.scrollY + 120;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink);

  // --- Hero entrance animation ---
  const heroTl = gsap.timeline({ delay: 0.3 });
  heroTl
    .to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
    .to('.hero-name', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
    .to('.hero-tagline', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
    .to('.hero-cta', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');

  // --- GSAP ScrollTrigger: section reveals ---
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
    });
  });

  // --- Render project cards ---
  const grid = document.getElementById('projectsGrid');

  // Each card gets explicit grid placement for the "All" view
  const allOrder = [
    { ...projects[0], g: { gridColumn: '1', gridRow: '1 / 3' } },           // 1: Reception (tall left)
    { ...projects[3], g: { gridColumn: '2 / 4', gridRow: '1' } },           // 2: Wabi-Sabi (top right)
    { ...projects[2], g: { gridColumn: '2 / 4', gridRow: '2' } },           // 3: Modern Minimal (bottom right)
    { ...projects[1], g: { gridColumn: '1 / -1', gridRow: '3' } },          // 4: Scandinavian (full-width)
    { ...projects[4], g: { gridColumn: '1 / 3', gridRow: '4 / 5' } },               // 5: Complex Building (top right)
    { ...projects[5], g: { gridColumn: '3', gridRow: '4 / 6' } },               // 6: Residential (tall right)
    { ...projects[6], g: { gridColumn: '1 / 3', gridRow: '5 / 6' } },           // 7: Nubian Hotel (bottom right) 
    { ...projects[7], g: { gridColumn: '1 / -1', gridRow: '6' } },          // 8: Administration (full-width)
    { ...projects[8], g: { gridColumn: '1', gridRow: 'auto' }, tech: true }, // 9: Interior Shop Drawings
    { ...projects[9], g: { gridColumn: '2', gridRow: 'auto' }, tech: true }, // 10: Technical Drawings
    { ...projects[10], g: { gridColumn: '3', gridRow: 'auto' }, tech: true },// 11: Working Drawings
    { ...projects[11], g: { gridColumn: '1 / -1', gridRow: '8' } },         // 12: Al-Moez (full-width)
  ];

  function makeCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card reveal';
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    // Apply explicit grid placement
    if (project.g) {
      Object.assign(card.style, project.g);
    }
    card.innerHTML = `
      <a href="${project.behance}" target="_blank" rel="noopener noreferrer">
        <img src="${project.cover}" alt="${project.title}" loading="lazy" />
        <div class="project-card-overlay">
          <div class="overlay-line"></div>
          <h3>${project.title}</h3>
          <span class="overlay-category">${project.category}</span>
        </div>
      </a>
    `;
    return card;
  }

  function renderProjects(filter = 'all') {
    grid.innerHTML = '';

    const isAll = filter === 'all';
    const visible = isAll
      ? allOrder
      : projects.filter((p) => p.category === filter);

    let animDelay = 0;

    if (isAll) {
      // Render non-tech cards
      visible.forEach((project) => {
        if (project.tech) return;
        const card = makeCard(project);
        grid.appendChild(card);
        gsap.to(card, {
          opacity: 1, y: 0, duration: 0.6,
          delay: animDelay * 0.08, ease: 'power3.out',
        });
        animDelay++;
      });

      // Tech row wrapper
      const techRow = document.createElement('div');
      techRow.className = 'tech-row';
      visible.filter((p) => p.tech).forEach((project) => {
        const card = makeCard(project);
        techRow.appendChild(card);
        gsap.to(card, {
          opacity: 1, y: 0, duration: 0.6,
          delay: animDelay * 0.08, ease: 'power3.out',
        });
        animDelay++;
      });
      grid.appendChild(techRow);

    } else {
      visible.forEach((project, i) => {
        const card = makeCard(project);
        grid.appendChild(card);
        gsap.to(card, {
          opacity: 1, y: 0, duration: 0.6,
          delay: i * 0.08, ease: 'power3.out',
        });
      });
    }
  }

  renderProjects();

  // --- Filter tabs ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(btn.dataset.filter);
    });
  });

  // --- Skills stagger reveal ---
  gsap.utils.toArray('.skill-item').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
      },
      opacity: 0,
      y: 20,
      duration: 0.5,
      delay: i * 0.05,
      ease: 'power2.out',
    });
  });

  // --- Contact items reveal ---
  gsap.utils.toArray('.contact-item').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
      },
      opacity: 0,
      y: 30,
      duration: 0.6,
      delay: i * 0.1,
      ease: 'power2.out',
    });
  });

});
