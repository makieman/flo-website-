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
  const closeBookingBtn = document.getElementById('close-booking');
  if (openBookingBtn && bookingModal) {
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const firstFocusableElement = bookingModal.querySelectorAll(focusableElements)[0];
    const focusableContent = bookingModal.querySelectorAll(focusableElements);
    const lastFocusableElement = focusableContent[focusableContent.length - 1];

    const showModal = () => {
      bookingModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden'; // Prevent background scroll
      // Focus the first focusable element in the modal
      if (firstFocusableElement) firstFocusableElement.focus();
    };

    const hideModal = () => {
      bookingModal.classList.add('hidden');
      document.body.style.overflow = ''; // Restore background scroll
      openBookingBtn.focus();
    };

    openBookingBtn.addEventListener('click', showModal);

    if (closeBookingBtn) closeBookingBtn.addEventListener('click', hideModal);

    // Event delegation for closing modal
    bookingModal.addEventListener('click', (e) => {
      if (e.target.hasAttribute('data-close-modal')) {
        hideModal();
      }
    });

    // Close on Esc and trap focus
    document.addEventListener('keydown', (e) => {
      if (bookingModal.classList.contains('hidden')) return;

      if (e.key === 'Escape') hideModal();

      if (e.key === 'Tab') {
        if (e.shiftKey) { // if shift + tab
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
          }
        } else { // if tab
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            e.preventDefault();
          }
        }
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
      const updateActiveDot = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const cardWidth = originalCards[0].offsetWidth;
          const gap = parseInt(window.getComputedStyle(track).gap, 10) || 32;
          const scrollLeft = wrapper.scrollLeft;
          const activeIndex = Math.round(scrollLeft / (cardWidth + gap));

          dots.forEach((dot, index) => dot.classList.toggle('active', index === activeIndex));
        }, 100);
      };
      wrapper.addEventListener('scroll', updateActiveDot);

      // --- JavaScript-driven Carousel Logic ---
      let isInteracting = false;
      let autoplay;

      const startAutoplay = () => {
        stopAutoplay(); // Clear any existing interval
        autoplay = setInterval(() => {
          if (isInteracting) return;
          
          const cardWidth = originalCards[0].offsetWidth;
          const gap = parseInt(window.getComputedStyle(track).gap, 10) || 32;
          const itemWidth = cardWidth + gap;

          // Scroll to the next item
          wrapper.scrollLeft += itemWidth;
        }, 4000); // Change slide every 4 seconds
      };

      const stopAutoplay = () => {
        clearInterval(autoplay);
        autoplay = null;
      };

      // Infinite loop logic
      wrapper.addEventListener('scroll', () => {
        const cardWidth = originalCards[0].offsetWidth;
        const gap = parseInt(window.getComputedStyle(track).gap, 10) || 32;
        const itemWidth = cardWidth + gap;
        const scrollEnd = track.scrollWidth - wrapper.clientWidth;

        // When it reaches the cloned part, silently jump back to the beginning
        if (wrapper.scrollLeft >= scrollEnd - itemWidth) {
          wrapper.scrollTo({ left: wrapper.scrollLeft - (originalCards.length * itemWidth), behavior: 'auto' });
        }
      }, { passive: true });

      // Pause on interaction
      ['touchstart', 'mouseenter', 'focusin'].forEach(event => {
        wrapper.addEventListener(event, () => { isInteracting = true; stopAutoplay(); }, { passive: true });
      });

      // Resume when interaction ends
      ['touchend', 'mouseleave', 'focusout'].forEach(event => {
        wrapper.addEventListener(event, () => { isInteracting = false; startAutoplay(); }, { passive: true });
      });

      // Start the carousel
      window.addEventListener('load', startAutoplay); // Start after all resources are loaded
    }
  }
}

function initStatsAnimation() {
  if (!DOM.statsSection) return;

  const animateCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    const suffix = counter.getAttribute('data-suffix') || '';
    const duration = 2000; // 2 seconds
    const isDecimal = target % 1 !== 0;
    let startTimestamp = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentValue = progress * target;

      if (isDecimal) {
        counter.innerText = currentValue.toFixed(1);
      } else {
        counter.innerText = Math.floor(currentValue);
      }

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        counter.innerText = (isDecimal ? target.toFixed(1) : target) + suffix;
      }
    };
    window.requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('[data-target]').forEach(animateCounter);
      observer.disconnect(); // Animate only once
    }
  }, { threshold: 0.5 });

  observer.observe(DOM.statsSection);
}

function initHeaderScroll() {
  if (DOM.header) {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        DOM.header.classList.add('backdrop-blur-sm');
        DOM.header.classList.remove('bg-white/80', 'text-gray-900', 'shadow-md');
        DOM.header.classList.add('text-white');
      } else {
        DOM.header.classList.remove('backdrop-blur-sm');
        DOM.header.classList.add('text-white');
      }
    };
    // Debounce the scroll event to improve performance
    window.addEventListener('scroll', debounce(handleScroll, 15));
    // Initial check on page load
    handleScroll();
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
