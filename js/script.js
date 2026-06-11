/**
 * LingoLand - Interactive Features
 * Bootstrap 5.3 Dark Mode Toggle & UI Enhancements
 */

(function () {
  'use strict';

  // ===== DARK MODE =====
  const htmlEl = document.documentElement;
  const toggle = document.getElementById('darkModeSwitch');

  // Load saved theme
  const savedTheme = localStorage.getItem('lingoland-theme') || 'light';
  htmlEl.setAttribute('data-bs-theme', savedTheme);
  if (toggle) {
    toggle.checked = savedTheme === 'dark';
  }

  // Toggle handler
  if (toggle) {
    toggle.addEventListener('change', function () {
      const theme = this.checked ? 'dark' : 'light';
      htmlEl.setAttribute('data-bs-theme', theme);
      localStorage.setItem('lingoland-theme', theme);
    });
  }

  // ===== SMOOTH SCROLL FOR NAV LINKS =====
  document.querySelectorAll('.nav-link[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = document.querySelector('.navbar')?.offsetHeight || 70;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });

        // Close mobile menu
        const navbarCollapse = document.getElementById('navbarMain');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
          bootstrap.Collapse.getInstance(navbarCollapse)?.hide();
        }
      }
    });
  });

  // ===== ACTIVE NAV LINK ON SCROLL =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  function updateActiveNav() {
    let current = '';
    sections.forEach(function (section) {
      const top = section.offsetTop - 120;
      if (window.pageYOffset >= top) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  window.addEventListener('load', updateActiveNav);

  // ===== COUNTER ANIMATION FOR STATS =====
  function animateCounters() {
    document.querySelectorAll('.display-5.fw-bold.text-warning, .display-5.fw-bold.text-primary, .display-5.fw-bold.text-success, .display-5.fw-bold.text-danger').forEach(function (el) {
      // Only if inside stats section
      if (!el.closest('section.bg-body-tertiary.border-bottom')) return;
      const text = el.textContent.trim();
      const num = parseInt(text.replace(/[^0-9]/g, ''));
      if (isNaN(num) || el.dataset.counted === 'true') return;
      el.dataset.counted = 'true';

      const suffix = text.replace(/[0-9]/g, '');
      let current = 0;
      const step = Math.ceil(num / 30);
      const timer = setInterval(function () {
        current += step;
        if (current >= num) {
          current = num;
          clearInterval(timer);
        }
        el.textContent = current + suffix;
      }, 40);
    });
  }

  // Trigger counter animation on scroll
  const statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  });

  const statsSection = document.querySelector('section.bg-body-tertiary.border-bottom');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // ===== NEWSLETTER FORM HANDLER =====
  const newsletterBtn = document.querySelector('.input-group .btn-warning');
  const newsletterInput = document.querySelector('.input-group input[type="email"]');

  if (newsletterBtn && newsletterInput) {
    newsletterBtn.addEventListener('click', function () {
      const email = newsletterInput.value.trim();
      if (email && email.includes('@')) {
        // Show success feedback using Bootstrap toast/alert
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show mt-3 mb-0 small';
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML =
          '<i class="fa-solid fa-circle-check me-2"></i>Terima kasih! Email ' +
          email +
          ' telah terdaftar. ' +
          '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
        newsletterInput.parentElement.parentElement.appendChild(alertDiv);
        newsletterInput.value = '';

        // Auto dismiss after 5s
        setTimeout(function () {
          alertDiv.classList.remove('show');
          setTimeout(function () { alertDiv.remove(); }, 300);
        }, 5000);
      } else {
        newsletterInput.classList.add('is-invalid');
        newsletterInput.focus();
        setTimeout(function () {
          newsletterInput.classList.remove('is-invalid');
        }, 3000);
      }
    });
  }

})();
