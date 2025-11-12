// --- DOM Element Caching ---
// Cache frequently accessed elements to avoid repeated DOM queries.
const DOM = {
  header: document.getElementById('main-header'),
  menuBtn: document.getElementById('menu-btn'),
  mobileMenu: document.getElementById('mobile-menu'),
  hamburgerIcon: document.getElementById('hamburger-icon'),
  closeIcon: document.getElementById('close-icon'),
  mobileMenuCloseBtn: document.getElementById('mobile-menu-close-btn'),
  openBookingBtn: document.getElementById('open-booking'),
  bookingModal: document.getElementById('booking-modal'),
  servicesSection: document.getElementById('services'),
  testimonialsCarousel: document.querySelector('#testimonials'),
  statsSection: document.getElementById('stats-section'),
  theme: {
    toggleBtn: document.getElementById('theme-toggle'),
    darkIcon: document.getElementById('theme-toggle-dark-icon'),
    lightIcon: document.getElementById('theme-toggle-light-icon'),
  }
};

/**
 * A simple debounce function to limit the rate at which a function can fire.
 * @param {Function} func The function to debounce.
 * @param {number} delay The delay in milliseconds.
 * @returns {Function} The debounced function.
 */
function debounce(func, delay = 20) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

function initThemeToggle() {
  const { toggleBtn, darkIcon, lightIcon } = DOM.theme;

  // Apply saved theme on load
  if (localStorage.getItem('color-theme') === 'dark' ||
      (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    if(darkIcon) darkIcon.classList.remove('hidden');
  } else {
    if(lightIcon) lightIcon.classList.remove('hidden');
  }

  // Toggle theme event listener
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if(darkIcon) darkIcon.classList.toggle('hidden');
      if(lightIcon) lightIcon.classList.toggle('hidden');
      
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
      }
    });
  }
}

function initMobileMenu() {
  const { menuBtn, mobileMenu, hamburgerIcon, closeIcon, mobileMenuCloseBtn } = DOM;
  const openMobileMenu = () => {
    document.body.classList.add('menu-open');
    if (hamburgerIcon) hamburgerIcon.classList.add('hidden');
    if (closeIcon) closeIcon.classList.remove('hidden');
  };

  const closeMobileMenu = () => {
    document.body.classList.remove('menu-open');
    if (hamburgerIcon) hamburgerIcon.classList.remove('hidden');
    if (closeIcon) closeIcon.classList.add('hidden');
  };

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent the body click listener from firing immediately
      if (document.body.classList.contains('menu-open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    if (mobileMenuCloseBtn) {
      mobileMenuCloseBtn.addEventListener('click', closeMobileMenu);
    }

    // Close menu when a link is clicked
    document.querySelectorAll('#mobile-menu a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close menu when clicking outside on the overlay
    document.body.addEventListener('click', (e) => {
      if (document.body.classList.contains('menu-open') && !mobileMenu.contains(e.target) && e.target !== menuBtn) {
        closeMobileMenu();
      }
    });
  }
}

function initSmoothScroll() {
  document.querySelectorAll('a[data-smooth-scroll]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function initBookingModal() {
  const { openBookingBtn, bookingModal } = DOM;
  if (openBookingBtn && bookingModal) {
    const closeBookingBtn = bookingModal.querySelector('#close-booking');
    const showModal = () => {
      bookingModal.classList.remove('hidden');
      // trap focus minimally by focusing close button
      const closeBtn = bookingModal.querySelector('#close-booking');
      if (closeBtn) closeBtn.focus();
    };

    const hideModal = () => {
      bookingModal.classList.add('hidden');
      openBookingBtn.focus();
    };

    openBookingBtn.addEventListener('click', showModal);

    if (closeBookingBtn) closeBookingBtn.addEventListener('click', hideModal);

    // Close when clicking overlay
    bookingModal.querySelectorAll('[data-close-modal]').forEach(el => {
      el.addEventListener('click', hideModal);
    });

    // Close on Esc
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !bookingModal.classList.contains('hidden')) {
        hideModal();
      }
    });
  }
}

function initServicesSection() {
  if (DOM.servicesSection) {
    const scrollWrapper = DOM.servicesSection.querySelector('.services-scroll-wrapper');
    const cards = servicesSection.querySelectorAll('.flip-card');
    const paginationContainer = servicesSection.querySelector('.service-pagination');

    if (scrollWrapper && cards.length > 0 && paginationContainer) {
      // 1. Create pagination dots
      cards.forEach((card, index) => {
        const dot = document.createElement('div');
        dot.classList.add('pagination-dot');
        dot.dataset.index = index;
        if (index === 0) {
          dot.classList.add('active');
        }
        paginationContainer.appendChild(dot);
      });

      const dots = paginationContainer.querySelectorAll('.pagination-dot');

      // 2. Handle dot clicks
      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          const index = parseInt(dot.dataset.index, 10);
          const cardWidth = cards[0].offsetWidth;
          const gap = parseInt(window.getComputedStyle(cards[0].parentElement).gap, 10);

          scrollWrapper.scrollTo({
            left: index * (cardWidth + gap),
            behavior: 'smooth'
          });
        });
      });

      // 3. Update active dot on scroll
      let scrollTimeout;
      scrollWrapper.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const cardWidth = cards[0].offsetWidth;
          const gap = parseInt(window.getComputedStyle(cards[0].parentElement).gap, 10);
          const scrollLeft = scrollWrapper.scrollLeft;

          const activeIndex = Math.round(scrollLeft / (cardWidth + gap));

          dots.forEach((dot, index) => {
            if (index === activeIndex) {
              dot.classList.add('active');
            } else {
              dot.classList.remove('active');
            }
          });
        }, 100);
      });
    }
  }
}

function initTestimonialCarousel() {
  if (DOM.testimonialsCarousel) {
    const wrapper = DOM.testimonialsCarousel.querySelector('.testimonial-carousel-wrapper');
    const track = DOM.testimonialsCarousel.querySelector('.testimonial-carousel-track');
    const paginationContainer = DOM.testimonialsCarousel.querySelector('.testimonial-pagination');

    if (wrapper && track && paginationContainer) {
      // Clone cards for seamless looping
      const originalCards = Array.from(track.children);
      const cardsToClone = Array.from(track.children);
      cardsToClone.forEach(card => {
        track.appendChild(card.cloneNode(true));
      });

      // 1. Create pagination dots
      const cards = originalCards; // Use original cards for dot count
      cards.forEach(card => {
        const dot = document.createElement('div');
        dot.classList.add('pagination-dot');
        paginationContainer.appendChild(dot);
      });
      const dots = paginationContainer.querySelectorAll('.pagination-dot');
      if (dots.length > 0) dots[0].classList.add('active');

      // 2. Handle dot clicks
      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          const cardWidth = cards[0].offsetWidth;
          const gap = parseInt(window.getComputedStyle(track).gap, 10) || 32;

          wrapper.scrollTo({
            left: index * (cardWidth + gap),
            behavior: 'smooth'
          });
        });
      });

      // 3. Update active dot on scroll
      let scrollTimeout;
      wrapper.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const cardWidth = cards[0].offsetWidth;
          const gap = parseInt(window.getComputedStyle(track).gap, 10) || 32;
          const scrollLeft = wrapper.scrollLeft;
          const activeIndex = Math.round(scrollLeft / (cardWidth + gap));

          dots.forEach((dot, index) => dot.classList.toggle('active', index === activeIndex));
        }, 100);
      });

      // --- JavaScript-driven Carousel Logic ---
      let isInteracting = false;
      let autoplay;

      const startAutoplay = () => {
        if (isInteracting) return;
        autoplay = setInterval(() => {
          let currentScroll = wrapper.scrollLeft;
          let totalScrollWidth = track.scrollWidth - wrapper.clientWidth;

          // If at the end, jump back to the start without animation
          if (currentScroll >= totalScrollWidth - 1) {
            wrapper.scrollTo({ left: 0, behavior: 'auto' });
          } else {
            // Otherwise, scroll smoothly to the next card
            const cardWidth = originalCards[0].offsetWidth;
            const gap = parseInt(window.getComputedStyle(track).gap, 10) || 32;
            const nextScroll = Math.floor(currentScroll / (cardWidth + gap)) * (cardWidth + gap) + (cardWidth + gap);
            wrapper.scrollTo({ left: nextScroll, behavior: 'smooth' });
          }
        }, 4000); // Change slide every 4 seconds
      };

      const stopAutoplay = () => {
        clearInterval(autoplay);
      };

      // Pause on interaction
      ['touchstart', 'mouseenter', 'focusin'].forEach(event => {
        wrapper.addEventListener(event, () => {
          isInteracting = true;
          stopAutoplay();
        }, { passive: true });
      });

      // Resume when interaction ends
      ['touchend', 'mouseleave', 'focusout'].forEach(event => {
        wrapper.addEventListener(event, () => {
          isInteracting = false;
          startAutoplay();
        }, { passive: true });
      });

      // Start the carousel
      startAutoplay();
    }
  }
}

function initStatsAnimation() {
  if (!DOM.statsSection) return;

  const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    const decimalCounters = document.querySelectorAll('.stat-number-decimal');
    const speed = 200; // The lower the faster

    counters.forEach(counter => {
      const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const inc = Math.max(Math.ceil(target / speed), 1);

        if (count < target) {
          counter.innerText = Math.min(count + inc, target);
          setTimeout(updateCount, 10);
        } else {
          counter.innerText = target + '+';
        }
      };
      updateCount();
    });

    decimalCounters.forEach(counter => {
      const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const inc = target / speed;

        if (count < target) {
          counter.innerText = (count + inc).toFixed(1);
          setTimeout(updateCount, 15);
        } else {
          counter.innerText = target;
        }
      };
      updateCount();
    });
  };

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
      observer.disconnect(); // Animate only once
    }
  }, { threshold: 0.5 });

  observer.observe(DOM.statsSection);
}

function initHeaderScroll() {
  if (DOM.header) {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        DOM.header.classList.add('scrolled');
      } else {
        DOM.header.classList.remove('scrolled');
      }
    };
    // Debounce the scroll event to improve performance
    window.addEventListener('scroll', debounce(handleScroll, 15));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS scroll animations if the library is present
  if (window.AOS) {
    AOS.init({
      duration: 800, // A good default duration
      once: true      // Animate elements only once
    });
  }

  // Initialize all custom scripts
    initThemeToggle();
    initMobileMenu();
    initSmoothScroll();
    initHeaderScroll();
    initBookingModal();
    initServicesSection();
    initTestimonialCarousel();
    initStatsAnimation();
});
