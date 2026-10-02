/**
 * Snaker site interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --------------------------------------------------------------------------
  // 0. Scroll reveal
  // --------------------------------------------------------------------------
  try {
    const revealElements = document.querySelectorAll('[data-reveal]');
    if (revealElements.length > 0) {
      document.documentElement.classList.add('reveal-init');

      const revealEl = (el) => el.classList.add('is-revealed');

      if (prefersReducedMotion) {
        revealElements.forEach(revealEl);
      } else {
        const vh = window.innerHeight || document.documentElement.clientHeight;
        revealElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.top <= vh + 250) {
            revealEl(el);
          }
        });

        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                revealEl(entry.target);
                observer.unobserve(entry.target);
              }
            });
          }, {
            threshold: 0.05,
            rootMargin: '0px 0px 120px 0px'
          });

          revealElements.forEach(el => {
            if (!el.classList.contains('is-revealed')) {
              observer.observe(el);
            }
          });
        }

        let ticking = false;
        window.addEventListener('scroll', () => {
          if (!ticking) {
            requestAnimationFrame(() => {
              const currentVh = window.innerHeight || document.documentElement.clientHeight;
              revealElements.forEach(el => {
                if (!el.classList.contains('is-revealed')) {
                  const rect = el.getBoundingClientRect();
                  if (rect.top <= currentVh + 100) {
                    revealEl(el);
                  }
                }
              });
              ticking = false;
            });
            ticking = true;
          }
        }, { passive: true });
      }
    }
  } catch (err) {
    console.warn('Scroll reveal init handled:', err);
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-revealed'));
  }

  // --------------------------------------------------------------------------
  // 1. Light and dark mode
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
  // 2. Sticky navbar
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
  // 3. Mobile navigation
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
  // 4. Store customizer preview
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
  // 4b. Hero card parallax
  // --------------------------------------------------------------------------
  const heroSection = document.getElementById('hero');
  const card1 = document.getElementById('float-card-1');
  const card2 = document.getElementById('float-card-2');
  const card3 = document.getElementById('float-card-3');
  const card4 = document.getElementById('float-card-4');
  const centralStore = document.getElementById('hero-central-store');

  if (heroSection && !prefersReducedMotion) {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x;
      mouseY = y;
    });

    heroSection.addEventListener('mouseleave', () => {
      mouseX = 0;
      mouseY = 0;
    });

    const updateParallax = () => {
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;

      if (window.innerWidth >= 768) {
        if (card1) {
          card1.style.transform = `translate3d(${(currentX * -28).toFixed(1)}px, ${(currentY * -24).toFixed(1)}px, 0)`;
        }
        if (card2) {
          card2.style.transform = `translate3d(${(currentX * 24).toFixed(1)}px, ${(currentY * 20).toFixed(1)}px, 0)`;
        }
        if (card3) {
          card3.style.transform = `translate3d(${(currentX * 32).toFixed(1)}px, ${(currentY * -26).toFixed(1)}px, 0)`;
        }
        if (card4) {
          card4.style.transform = `translate3d(${(currentX * -20).toFixed(1)}px, ${(currentY * 24).toFixed(1)}px, 0)`;
        }
        if (centralStore) {
          centralStore.style.transform = `perspective(1000px) rotateX(${(-currentY * 5).toFixed(2)}deg) rotateY(${(currentX * 5).toFixed(2)}deg)`;
        }
      }

      requestAnimationFrame(updateParallax);
    };

    requestAnimationFrame(updateParallax);
  }

  // --------------------------------------------------------------------------
  // 4c. Elevated experiences tabs
  // --------------------------------------------------------------------------
  const elevatedBox = document.getElementById('elevated-showcase');
  if (elevatedBox) {
    const tabBtns = elevatedBox.querySelectorAll('.elevated-tab-btn');
    const panes = elevatedBox.querySelectorAll('.elevated-tab-pane');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        panes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetId = 'pane-' + btn.getAttribute('data-tab');
        const targetPane = document.getElementById(targetId);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 5. Scroll-linked snake path
  // --------------------------------------------------------------------------
  const trackerEl = document.getElementById('snake-narrator-tracker');
  const svgEl = document.getElementById('snake-continuous-svg');
  const snakePaths = [
    document.getElementById('snake-path-shadow'),
    document.getElementById('snake-path-glow'),
    document.getElementById('snake-path-base'),
    document.getElementById('snake-path-body'),
    document.getElementById('snake-path-scales'),
    document.getElementById('snake-path-spine')
  ].filter(Boolean);
  const snakeHeadGroup = document.getElementById('snake-head-group');

  if (trackerEl && svgEl && snakePaths.length > 0 && !prefersReducedMotion) {
    let totalLength = 0;
    let currentProgress = 0;
    let targetProgress = 0;
    let isAnimating = false;

    // Smooth Catmull-Rom spline interpolation converted to cubic Bezier curves
    const generateSmoothPath = (points) => {
      if (points.length < 2) return '';
      let d = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(0, i - 1)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(points.length - 1, i + 2)];

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
      }
      return d;
    };

    const buildSnakeWaypoints = () => {
      try {
        const siteMain = document.getElementById('main-content') || trackerEl.parentElement;
        if (!siteMain) return;
        const mainRect = siteMain.getBoundingClientRect();
        const mainTop = mainRect.top + window.scrollY;
        const w = trackerEl.offsetWidth || window.innerWidth;
        const h = trackerEl.offsetHeight || siteMain.scrollHeight;
        const isMobile = w < 768;

        svgEl.setAttribute('viewBox', `0 0 ${w} ${h}`);

        const getSectionPoint = (id, xFraction, yFraction = 0.5) => {
          const el = document.getElementById(id);
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          const y = (rect.top + window.scrollY - mainTop) + rect.height * yFraction;
          const x = w * xFraction;
          return { x, y };
        };

        // Waypoints weaving naturally down through sections and around/behind mockups
        const waypoints = [
          // Point 0: Hero stage
          getSectionPoint('hero', isMobile ? 0.75 : 0.82, 0.40),
          // Point 1: Hero exit curving towards brands
          getSectionPoint('hero', isMobile ? 0.50 : 0.62, 0.90),
          // Point 1b: Client brands marquee section
          getSectionPoint('client-brands', isMobile ? 0.40 : 0.35, 0.50),
          // Point 2: Platform Hub section
          getSectionPoint('platform-hub', isMobile ? 0.70 : 0.78, 0.50),
          // Point 3: Elevated Experiences
          getSectionPoint('elevated', isMobile ? 0.30 : 0.25, 0.50),
          // Point 4: Economics
          getSectionPoint('economics', isMobile ? 0.65 : 0.60, 0.60),
          // Point 5: Journey
          getSectionPoint('journey', isMobile ? 0.80 : 0.82, 0.50),
          // Point 6: Free plan WhatsApp
          getSectionPoint('free-start', isMobile ? 0.20 : 0.22, 0.55),
          // Point 7: Customizer widget
          getSectionPoint('customization', isMobile ? 0.80 : 0.82, 0.50),
          // Point 8: Behind dashboard mockup (occlusion!)
          getSectionPoint('product', isMobile ? 0.35 : 0.32, 0.58),
          // Point 9: Product section exit
          getSectionPoint('product', isMobile ? 0.68 : 0.72, 0.90),
          // Point 10: Storefronts row
          getSectionPoint('storefronts', isMobile ? 0.25 : 0.25, 0.52),
          // Point 11: Scale section
          getSectionPoint('scale', isMobile ? 0.75 : 0.74, 0.50),
          // Point 12: Pricing section
          getSectionPoint('pricing', isMobile ? 0.50 : 0.48, 0.55),
          // Point 13: FAQ section
          getSectionPoint('faq', isMobile ? 0.25 : 0.20, 0.50),
          // Point 14: Final CTA banner
          getSectionPoint('start', isMobile ? 0.50 : 0.52, 0.45)
        ].filter(pt => pt && Number.isFinite(pt.x) && Number.isFinite(pt.y));

        if (waypoints.length < 2) return;

        const pathData = generateSmoothPath(waypoints);
        snakePaths.forEach(p => p.setAttribute('d', pathData));

        // Calculate total path length safely
        const guidePath = document.getElementById('snake-path-body') || snakePaths[0];
        if (guidePath && typeof guidePath.getTotalLength === 'function') {
          totalLength = guidePath.getTotalLength() || 0;
        }

        if (totalLength > 0) {
          snakePaths.forEach(p => {
            p.style.strokeDasharray = `${totalLength} ${totalLength}`;
            p.style.strokeDashoffset = `${totalLength}`;
          });
          renderSnake(currentProgress);
        }
      } catch (err) {
        console.warn('Snake waypoints build handled safely:', err);
      }
    };

    const renderSnake = (progress) => {
      try {
        if (!totalLength || totalLength <= 0) return;
        const clamped = Math.max(0, Math.min(1, progress));
        const drawOffset = totalLength * (1 - clamped);
        snakePaths.forEach(p => {
          p.style.strokeDashoffset = drawOffset;
        });

        if (snakeHeadGroup) {
          if (progress <= 0.003) {
            snakeHeadGroup.style.opacity = '0';
          } else {
            snakeHeadGroup.style.opacity = '1';
            const currentDist = clamped * totalLength;
            const guidePath = document.getElementById('snake-path-body') || snakePaths[0];
            if (guidePath && typeof guidePath.getPointAtLength === 'function') {
              const point = guidePath.getPointAtLength(currentDist);
              const nextDist = Math.min(totalLength, currentDist + 10);
              const nextPoint = guidePath.getPointAtLength(nextDist);
              
              const dx = nextPoint.x - point.x;
              const dy = nextPoint.y - point.y;
              const angle = Math.atan2(dy, dx) * (180 / Math.PI);
              
              if (Number.isFinite(point.x) && Number.isFinite(point.y) && Number.isFinite(angle)) {
                snakeHeadGroup.setAttribute('transform', `translate(${point.x.toFixed(1)}, ${point.y.toFixed(1)}) rotate(${angle.toFixed(1)})`);
              }
            }
          }
        }
      } catch (e) {
        // silent calculation fallback
      }
    };

    const tickAnimation = () => {
      const diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.0004) {
        currentProgress += diff * 0.09;
        renderSnake(currentProgress);
        requestAnimationFrame(tickAnimation);
      } else {
        currentProgress = targetProgress;
        renderSnake(currentProgress);
        isAnimating = false;
      }
    };

    const onScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      const snakeHeroImg = document.getElementById('hero-snake-img');
      if (snakeHeroImg && scrollY < 1200) {
        snakeHeroImg.style.transform = `translate3d(0, ${(scrollY * 0.12).toFixed(1)}px, 0)`;
      }

      targetProgress = Math.max(0, Math.min(1, scrollY / maxScroll));

      if (!isAnimating) {
        isAnimating = true;
        requestAnimationFrame(tickAnimation);
      }
    };

    window.addEventListener('load', buildSnakeWaypoints);
    buildSnakeWaypoints();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildSnakeWaypoints, 150);
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
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
      const loadingText = form.getAttribute('data-loading-text') || 'Sending...';
      submitBtn.innerHTML = `<span>${loadingText}</span>`;
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
          feedback.textContent = data.error || (form.getAttribute('data-error-text') || 'Failed to submit. Please check your information.');
          feedback.classList.add('error');
        }
      } catch (err) {
        feedback.textContent = form.getAttribute('data-network-error-text') || 'Network error. Please check your internet connection.';
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
