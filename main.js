// Initialize theme toggle functionality
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const darkIcon = document.getElementById('theme-toggle-dark-icon');
  const lightIcon = document.getElementById('theme-toggle-light-icon');

  // Apply saved theme on load
  if (localStorage.getItem('color-theme') === 'dark' ||
      (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    if(darkIcon) darkIcon.classList.remove('hidden');
  } else {
    if(lightIcon) lightIcon.classList.remove('hidden');
  }

  // Toggle theme event listener
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
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

// Initialize mobile menu functionality
function initMobileMenu() {
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const closeIcon = document.getElementById('close-icon');
  const mobileMenuCloseBtn = document.getElementById('mobile-menu-close-btn');

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
      if (document.body.classList.contains('menu-open') && !mobileMenu.contains(e.target)) {
        closeMobileMenu();
      }
    });
  }
}

// Initialize smooth-scroll functionality
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

// Initialize booking modal functionality
function initBookingModal() {
  const openBookingBtn = document.getElementById('open-booking');
  const bookingModal = document.getElementById('booking-modal');
  const closeBookingBtn = document.getElementById('close-booking');

  if (openBookingBtn && bookingModal) {
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

// Initialize flip card and pagination functionality
function initServicesSection() {
  const servicesSection = document.getElementById('services');
  if (servicesSection) {
    const scrollWrapper = servicesSection.querySelector('.services-scroll-wrapper');
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

// Initialize testimonial carousel functionality
function initTestimonialCarousel() {
  const testimonialCarousel = document.querySelector('#testimonials');
  if (testimonialCarousel) {
    const wrapper = testimonialCarousel.querySelector('.testimonial-carousel-wrapper');
    const track = testimonialCarousel.querySelector('.testimonial-carousel-track');
    const paginationContainer = testimonialCarousel.querySelector('.testimonial-pagination');

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

      track.classList.add('scroll-animation');
    }
  }
}

// Initialize stats counter animation
function initStatsAnimation() {
  const statsSection = document.getElementById('stats-section');

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

  if (statsSection) {
    observer.observe(statsSection);
  }
}

// Main initialization function to call all the above functions on DOMContentLoaded
function initializeAll() {
  document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMobileMenu();
    initSmoothScroll();
    initBookingModal();
    initServicesSection();
    initTestimonialCarousel();
    initStatsAnimation();
  });
}

// Call the initialization function when the script loads
initializeAll();

// Mobile menu handled by initMobileMenu() on DOMContentLoaded

// Booking modal logic
const openBookingBtn = document.getElementById('open-booking');
const bookingModal = document.getElementById('booking-modal');
const closeBookingBtn = document.getElementById('close-booking');

if (openBookingBtn && bookingModal) {
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

// Flip card and pagination logic
const servicesSection = document.getElementById('services');
if (servicesSection) {
  const scrollWrapper = servicesSection.querySelector('.services-scroll-wrapper');
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
      }, 100); // Debounce to avoid performance issues
    });
  }
}

// Testimonial Carousel
const testimonialCarousel = document.querySelector('#testimonials');
if (testimonialCarousel) {
  const wrapper = testimonialCarousel.querySelector('.testimonial-carousel-wrapper');
  const track = testimonialCarousel.querySelector('.testimonial-carousel-track');
  const paginationContainer = testimonialCarousel.querySelector('.testimonial-pagination');

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
        const gap = parseInt(window.getComputedStyle(track).gap, 10) || 32; // 2rem

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

    track.classList.add('scroll-animation');
  }
}

// -------------------
// AOS initialization
// -------------------
AOS.init({
  duration: 700,
  once: true,
});

// -------------------
// WhatsApp booking form
// -------------------
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value || 'Client';
    const phone = document.getElementById('phone').value || '';
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value || 'ASAP';

    const message = encodeURIComponent(
      `Hello Flo, my name is ${name}. I am interested in ${service}. Preferred date: ${date}. Phone: ${phone}`
    );

    const wa = `https://wa.me/254721530120?text=${message}`;
    window.open(wa, '_blank');

    document.getElementById('formMsg').classList.remove('hidden');
  });
}

// -------------------
// Stats Counter Animation
// -------------------
const statsSection = document.getElementById('stats-section');

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

if (statsSection) {
  observer.observe(statsSection);
}
