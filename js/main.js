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

  function renderProjects(filter = 'all') {
    grid.innerHTML = '';
    const visible = filter === 'all'
      ? projects
      : projects.filter((p) => p.category === filter);

    visible.forEach((project, i) => {
      const card = document.createElement('div');
      card.className = 'project-card reveal';
      card.style.opacity = '0';
      card.style.transform = 'translateY(40px)';
      card.innerHTML = `
        <a href="${project.behance}" target="_blank" rel="noopener noreferrer">
          <img src="${project.cover}" alt="${project.title}" loading="lazy" />
          <div class="project-card-overlay">
            <h3>${project.title}</h3>
            <span>${project.category}</span>
          </div>
        </a>
      `;
      grid.appendChild(card);

      // stagger entrance
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: i * 0.1,
        ease: 'power3.out',
      });
    });
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
