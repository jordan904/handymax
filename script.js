/* ============================================
   HandyMax Builders — script.js
   ============================================ */

(function () {
  'use strict';

  // --- Navbar scroll effect ---
  const navbar = document.querySelector('.navbar');
  let lastScrollY = 0;
  let ticking = false;

  function updateNavbar() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });

  // Initial check
  updateNavbar();

  // --- Mobile nav toggle ---
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');

    // Swap icon
    if (isOpen) {
      navToggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    } else {
      navToggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    }
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
      navToggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    });
  });

  // --- Scroll-triggered fade-in animations ---
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    var fadeElements = document.querySelectorAll('.fade-in');

    var fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var parent = entry.target.parentElement;
          var siblings = Array.from(parent.children).filter(function(c) {
            return c.classList.contains('fade-in');
          });
          var index = siblings.indexOf(entry.target);
          var delay = Math.min(index * 150, 600);
          setTimeout(function() {
            entry.target.classList.add('visible');
          }, delay);
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(function (el) {
      fadeObserver.observe(el);
    });
  } else {
    // Show all elements immediately if reduced motion preferred
    document.querySelectorAll('.fade-in').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // --- Gallery lightbox ---
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = lightbox.querySelector('.lightbox-close');
  var lightboxPrev = lightbox.querySelector('.lightbox-prev');
  var lightboxNext = lightbox.querySelector('.lightbox-next');
  var galleryItems = document.querySelectorAll('.gallery-item');
  var currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    var img = galleryItems[currentIndex].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    galleryItems[currentIndex].focus();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    var img = galleryItems[currentIndex].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    var img = galleryItems[currentIndex].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  }

  galleryItems.forEach(function (item, index) {
    item.addEventListener('click', function () {
      openLightbox(index);
    });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrev);
  lightboxNext.addEventListener('click', showNext);

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  // --- Contact form validation ---
  var form = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');

  function showError(inputId, errorId) {
    var input = document.getElementById(inputId);
    var error = document.getElementById(errorId);
    input.classList.add('invalid');
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorId);
    error.classList.add('visible');
  }

  function clearError(inputId, errorId) {
    var input = document.getElementById(inputId);
    var error = document.getElementById(errorId);
    input.classList.remove('invalid');
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
    error.classList.remove('visible');
  }

  // Clear errors on input
  ['name', 'phone', 'email', 'message'].forEach(function (field) {
    var input = document.getElementById(field);
    input.addEventListener('input', function () {
      clearError(field, field + 'Error');
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Honeypot check
    var hp = document.getElementById('website');
    if (hp.value) return;

    var valid = true;

    // Name
    var name = document.getElementById('name');
    if (!name.value.trim()) {
      showError('name', 'nameError');
      valid = false;
    } else {
      clearError('name', 'nameError');
    }

    // Phone
    var phone = document.getElementById('phone');
    var phonePattern = /^[\d\s\-\(\)\+]{7,}$/;
    if (!phone.value.trim() || !phonePattern.test(phone.value.trim())) {
      showError('phone', 'phoneError');
      valid = false;
    } else {
      clearError('phone', 'phoneError');
    }

    // Email
    var email = document.getElementById('email');
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailPattern.test(email.value.trim())) {
      showError('email', 'emailError');
      valid = false;
    } else {
      clearError('email', 'emailError');
    }

    // Service
    var service = document.getElementById('service');
    if (!service.value) {
      service.classList.add('invalid');
      service.setAttribute('aria-invalid', 'true');
      valid = false;
    } else {
      service.classList.remove('invalid');
      service.removeAttribute('aria-invalid');
    }

    // Message
    var message = document.getElementById('message');
    if (!message.value.trim()) {
      showError('message', 'messageError');
      valid = false;
    } else {
      clearError('message', 'messageError');
    }

    if (valid) {
      form.style.display = 'none';
      formSuccess.classList.add('visible');
    }
  });

  // --- Counter animation for hero stats ---
  if (!prefersReducedMotion) {
    var statNumbers = document.querySelectorAll('.hero-stat-number[data-count]');
    var countersStarted = false;

    function animateCounters() {
      if (countersStarted) return;
      countersStarted = true;

      statNumbers.forEach(function(el, i) {
        var target = parseInt(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1200;
        var start = 0;
        var startTime = null;
        var delay = i * 200;

        setTimeout(function() {
          function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out cubic
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(eased * target);
            el.textContent = current + suffix;

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              el.textContent = target + suffix;
              // Big bounce effect
              el.classList.add('stat-bounce');
            }
          }
          requestAnimationFrame(step);
        }, delay);
      });
    }

    // Start counters when hero stats are visible
    var statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
      var statsObserver = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) {
          animateCounters();
          statsObserver.disconnect();
        }
      }, { threshold: 0.5 });
      statsObserver.observe(statsSection);
    }
  } else {
    // Show final values immediately
    document.querySelectorAll('.hero-stat-number[data-count]').forEach(function(el) {
      el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
    });
  }

})();
