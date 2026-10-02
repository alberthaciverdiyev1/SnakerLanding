/**
 * Snaker — Interactive Client Engine
 * Light/Dark Mode Toggle | Live Store Customizer | Continuous Snake Scroll Reveal | AJAX Forms
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --------------------------------------------------------------------------
  // 1. Light & Dark Mode System
  // --------------------------------------------------------------------------
  const themeToggle = document.getElementById('theme-toggle');
  const mobileThemeToggle = document.getElementById('mobile-theme-toggle');

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('snaker-theme', theme);
    } catch (e) {}
  };

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  };

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', toggleTheme);
  }

  // --------------------------------------------------------------------------
  // 2. Sticky Navbar Transition
  // --------------------------------------------------------------------------
  const siteHeader = document.getElementById('site-header');
  const handleScroll = () => {
    if (!siteHeader) return;
    if (window.scrollY > 30) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --------------------------------------------------------------------------
  // 3. Mobile Navigation Drawer
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const mainNav = document.getElementById('main-nav');
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    mainNav.querySelectorAll('.nav-link, .btn').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4. Interactive Live Store Customizer Mockup (Brief Section 20)
  // --------------------------------------------------------------------------
  const previewCanvas = document.getElementById('customizer-preview-canvas');
  const customizerWidget = document.getElementById('customizer-widget');

  if (previewCanvas && customizerWidget) {
    // Color Palette Selector
    const colorBtns = customizerWidget.querySelectorAll('.cw-color-btn');
    colorBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        colorBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const colorClass = btn.getAttribute('data-color');
        previewCanvas.classList.remove('theme-emerald', 'theme-obsidian', 'theme-amber', 'theme-clay');
        previewCanvas.classList.add(colorClass);
      });
    });

    // Header Alignment Selector
    const headerBtns = customizerWidget.querySelectorAll('[data-header]');
    headerBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        headerBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const headerClass = btn.getAttribute('data-header');
        previewCanvas.classList.remove('align-left', 'align-center', 'align-split');
        previewCanvas.classList.add(headerClass);
      });
    });

    // Product Grid Columns Selector
    const gridBtns = customizerWidget.querySelectorAll('[data-grid]');
    gridBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        gridBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const gridClass = btn.getAttribute('data-grid');
        previewCanvas.classList.remove('grid-2col', 'grid-3col');
        previewCanvas.classList.add(gridClass);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 5. Continuous Snake Scroll Animation (Brief Section 8 & 9)
  // --------------------------------------------------------------------------
  const continuousSnakePath = document.getElementById('snake-continuous-path');
  if (continuousSnakePath && !prefersReducedMotion) {
    const totalLength = 3500;
    continuousSnakePath.style.strokeDasharray = totalLength;
    continuousSnakePath.style.strokeDashoffset = totalLength;

    const onScrollSnake = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      
      const scrollFraction = Math.min(Math.max(scrollY / (docHeight * 0.75), 0), 1);
      const drawLength = totalLength * (1 - scrollFraction);
      continuousSnakePath.style.strokeDashoffset = drawLength;
    };

    window.addEventListener('scroll', onScrollSnake, { passive: true });
    onScrollSnake();
  }

  // --------------------------------------------------------------------------
  // 6. Scroll Reveal System ([data-reveal])
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (revealElements.length > 0) {
    if (prefersReducedMotion) {
      revealElements.forEach(el => el.classList.add('is-revealed'));
    } else {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach(el => revealObserver.observe(el));
    }
  }

  // --------------------------------------------------------------------------
  // 7. Generic AJAX Form Handler for Demo & Contact Forms
  // --------------------------------------------------------------------------
  const setupAjaxForm = (formId, feedbackId) => {
    const form = document.getElementById(formId);
    const feedback = document.getElementById(feedbackId);
    if (!form || !feedback) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending...</span>';
      feedback.textContent = '';
      feedback.className = 'form-feedback';

      const formData = {};
      new FormData(form).forEach((value, key) => {
        formData[key] = value.trim();
      });

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (response.ok && data.success) {
          feedback.textContent = '✓ ' + data.message;
          feedback.classList.add('success');
          form.reset();
        } else {
          feedback.textContent = data.error || 'Failed to submit. Please check your information.';
          feedback.classList.add('error');
        }
      } catch (err) {
        feedback.textContent = 'Network error. Please check your internet connection.';
        feedback.classList.add('error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  };

  setupAjaxForm('demo-page-form', 'demo-page-feedback');
  setupAjaxForm('business-contact-form', 'biz-form-feedback');
  setupAjaxForm('partner-apply-form', 'partner-form-feedback');
  setupAjaxForm('general-contact-form', 'contact-form-feedback');

  // --------------------------------------------------------------------------
  // 8. FAQ Accordion Single-Item Open
  // --------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.open) {
            otherItem.removeAttribute('open');
          }
        });
      }
    });
  });
});
