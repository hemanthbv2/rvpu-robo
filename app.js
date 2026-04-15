/* ================================================
   RVPS SCHOOL — GAMIFIED INTERACTION ENGINE
   Robot Mascot Guide + Interactive Exploration
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNavigation();
  initMobileMenu();
  initScrollReveal();
  initRobotAssembly();
  initExploreButtons();
  initCurriculumTabs();
});

/* ================================================
   STATE: Track explored sections
   ================================================ */
const exploredSections = new Set();
const sectionOrder = ['section-campus', 'section-curriculum', 'section-learning', 'section-principal'];
const sectionLabels = {
  'section-campus': { icon: '🏫', label: 'Explore the Campus' },
  'section-curriculum': { icon: '📚', label: 'Classroom Activities & Courses' },
  'section-learning': { icon: '🧠', label: 'How Students Learn at RVPS' },
  'section-principal': { icon: '🎓', label: "What the Principal has to say" }
};

/* ================================================
   SCROLL PROGRESS BAR
   ================================================ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    bar.style.width = progress + '%';
  }, { passive: true });
}

/* ================================================
   NAVIGATION — Scroll Effects
   ================================================ */
function initNavigation() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();

        // If the target is an explore section, fully explore it (not just reveal)
        const sectionId = href.replace('#', '');
        if (sectionOrder.includes(sectionId) && !exploredSections.has(sectionId)) {
          handleExplore(sectionId);
          return; // handleExplore already scrolls
        } else if (sectionOrder.includes(sectionId)) {
          // Already explored, just scroll
          revealSection(sectionId);
        }

        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

        closeMobileMenu();
      }
    });
  });
}

/* ================================================
   MOBILE MENU
   ================================================ */
function initMobileMenu() {
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      mobileMenu.classList.add('open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}

function closeMobileMenu() {
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!mobileMenu) return;
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  if (hamburger) {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }
  document.body.style.overflow = '';
}

/* ================================================
   SCROLL REVEAL (Intersection Observer)
   ================================================ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.scroll-reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const parent = entry.target.parentElement;
        const siblings = parent ? Array.from(parent.querySelectorAll('.scroll-reveal')) : [];
        const siblingIndex = siblings.indexOf(entry.target);
        const delay = siblingIndex * 80;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ================================================
   ROBOT ASSEMBLY ANIMATION
   ================================================ */
function initRobotAssembly() {
  const robotSvg = document.getElementById('robot-svg');
  if (!robotSvg) return;

  // After all parts have assembled (~2.3s), add the idle animation class
  setTimeout(() => {
    robotSvg.classList.add('assembled');
  }, 2300);
}

/* ================================================
   GAMIFIED EXPLORATION SYSTEM
   ================================================ */
function initExploreButtons() {
  const buttonsContainer = document.getElementById('explore-buttons');
  if (!buttonsContainer) return;

  // Main hero buttons
  buttonsContainer.querySelectorAll('.explore-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      handleExplore(targetId);
    });
  });
}

function handleExplore(sectionId) {
  // Mark as explored
  exploredSections.add(sectionId);

  // Reveal the section
  revealSection(sectionId);

  // Mark the hero button as visited
  const heroBtn = document.querySelector(`[data-target="${sectionId}"]`);
  if (heroBtn) {
    heroBtn.classList.add('visited');
  }

  // Update progress
  updateProgress();

  // Build remaining buttons in the section's reappear area
  buildRemainingButtons(sectionId);

  // Scroll to the section
  setTimeout(() => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 150);
}

function revealSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  // Reveal it
  section.classList.add('revealed');

  // Re-observe scroll-reveal elements inside (they may have been hidden)
  setTimeout(() => {
    const revealElements = section.querySelectorAll('.scroll-reveal:not(.revealed)');
    if (revealElements.length) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      revealElements.forEach(el => observer.observe(el));
    }
  }, 100);
}

function updateProgress() {
  const count = exploredSections.size;
  const countEl = document.getElementById('progress-count');
  if (countEl) {
    countEl.textContent = `${count} / 4`;
  }

  // Update dots
  document.querySelectorAll('.progress-dot').forEach(dot => {
    if (exploredSections.has(dot.dataset.section)) {
      dot.classList.add('active');
    }
  });

  // If all explored, show a completion message
  if (count === 4) {
    showCompletionCelebration();
  }
}

function buildRemainingButtons(currentSectionId) {
  const remaining = sectionOrder.filter(id => id !== currentSectionId && !exploredSections.has(id));

  // Find the reappear container for this section
  const sectionKey = currentSectionId.replace('section-', '');
  const reappearEl = document.getElementById(`reappear-${sectionKey}`);
  const buttonsContainer = document.getElementById(`remaining-${sectionKey}`);

  if (!reappearEl || !buttonsContainer) return;

  buttonsContainer.innerHTML = '';

  if (remaining.length === 0) {
    // All explored — hide reappear, final CTA will show
    reappearEl.style.display = 'none';
    return;
  }

  remaining.forEach(sectionId => {
    const info = sectionLabels[sectionId];
    const btn = document.createElement('button');
    btn.className = 'explore-btn';
    btn.dataset.target = sectionId;
    btn.innerHTML = `
      <span class="btn-icon">${info.icon}</span>
      <span class="btn-label">${info.label}</span>
    `;
    btn.addEventListener('click', () => {
      handleExplore(sectionId);
    });
    buttonsContainer.appendChild(btn);
  });

  // Show the reappear section with animation
  setTimeout(() => {
    reappearEl.classList.add('visible');
  }, 800);
}

function showCompletionCelebration() {
  // Hide all reappear sections
  document.querySelectorAll('.mascot-reappear').forEach(el => {
    el.style.display = 'none';
  });

  // Make the final CTA more prominent
  const finalCta = document.getElementById('final-cta');
  if (finalCta) {
    finalCta.classList.add('revealed');
    finalCta.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

/* ================================================
   CURRICULUM TABS
   ================================================ */
function initCurriculumTabs() {
  const tabs = document.querySelectorAll('.curr-tab');
  const panels = document.querySelectorAll('.curr-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Deactivate all
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      // Activate selected
      tab.classList.add('active');
      const panelId = tab.dataset.panel;
      const panel = document.getElementById(panelId);
      if (panel) {
        panel.classList.add('active');

        // Trigger scroll reveals inside the new panel
        const revealElements = panel.querySelectorAll('.scroll-reveal:not(.revealed)');
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });
        revealElements.forEach(el => observer.observe(el));
      }
    });
  });
}

/* ================================================
   MAGNETIC BUTTONS (Subtle hover attraction)
   ================================================ */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
});
