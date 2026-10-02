/**
 * Snaker - High-Performance Promotional Website
 * Motion System, Snake Progress Path, & Conversion Form Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Sticky Navbar Transition on Scroll
  const siteHeader = document.getElementById('site-header');
  const handleScroll = () => {
    if (!siteHeader) return;
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Mobile Navigation Toggle
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

  // 3. Hero Snake Mouse Parallax & Radial Glow (Desktop Only)
  const heroSection = document.getElementById('hero');
  const snakeWrapper = document.getElementById('snake-image-wrapper');
  const cursorGlow = document.getElementById('hero-cursor-glow');

  if (heroSection && snakeWrapper && !prefersReducedMotion && window.innerWidth > 1024) {
    let ticking = false;

    heroSection.addEventListener('mousemove', (e) => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const rect = heroSection.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (cursorGlow) {
          cursorGlow.style.left = `${mouseX}px`;
          cursorGlow.style.top = `${mouseY}px`;
          cursorGlow.classList.add('active');
        }

        const xOffset = ((mouseX / rect.width) - 0.5) * -18;
        const yOffset = ((mouseY / rect.height) - 0.5) * -14;
        snakeWrapper.style.transform = `translate(${xOffset}px, ${yOffset}px)`;

        ticking = false;
      });
    });

    heroSection.addEventListener('mouseleave', () => {
      if (cursorGlow) cursorGlow.classList.remove('active');
      snakeWrapper.style.transform = '';
    });
  }

  // 4. Reusable Scroll Reveal System ([data-reveal])
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
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach(el => revealObserver.observe(el));
    }
  }

  // 5. Animated Snake Progress Path (Connecting Steps 01 → 02 → 03)
  const snakeProgress = document.getElementById('snake-progress-path');
  const stepsTimeline = document.getElementById('steps-timeline');

  if (snakeProgress && stepsTimeline && !prefersReducedMotion) {
    const pathLength = 800;
    snakeProgress.style.strokeDasharray = pathLength;
    snakeProgress.style.strokeDashoffset = pathLength;

    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          snakeProgress.style.strokeDashoffset = '0';
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    timelineObserver.observe(stepsTimeline);
  }

  // 6. Demo Request Form AJAX Handler
  const demoForm = document.getElementById('demo-request-form');
  const demoFeedback = document.getElementById('demo-form-feedback');

  if (demoForm && demoFeedback) {
    demoForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = demoForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending request...</span>';
      demoFeedback.textContent = '';
      demoFeedback.className = 'form-feedback';

      const formData = {
        name: demoForm.name.value.trim(),
        email: demoForm.email.value.trim(),
        store_name: demoForm.store_name.value.trim(),
        selling_category: demoForm.selling_category ? demoForm.selling_category.value.trim() : '',
        website: demoForm.website ? demoForm.website.value.trim() : '',
        lang: (demoForm.lang && demoForm.lang.value) ? demoForm.lang.value : (document.documentElement.lang || 'az')
      };

      try {
        const response = await fetch('/request-demo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok && data.success) {
          demoFeedback.textContent = '✓ ' + data.message;
          demoFeedback.classList.add('success');
          demoForm.reset();
        } else {
          demoFeedback.textContent = data.error || 'Failed to submit request. Please verify fields.';
          demoFeedback.classList.add('error');
        }
      } catch (err) {
        demoFeedback.textContent = 'Network error. Please check your internet connection.';
        demoFeedback.classList.add('error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // 7. Interactive Single FAQ Accordion
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
