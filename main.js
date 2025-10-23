// Theme Toggle
const themeToggleBtn = document.getElementById('theme-toggle');
const mobileThemeToggleBtn = document.getElementById('mobile-theme-toggle');
const darkIcon = document.getElementById('theme-toggle-dark-icon');
const lightIcon = document.getElementById('theme-toggle-light-icon');
const mobileDarkIcon = document.getElementById('mobile-theme-toggle-dark-icon');
const mobileLightIcon = document.getElementById('mobile-theme-toggle-light-icon');

const updateIcons = (isLight) => {
  // Use optional chaining to avoid runtime errors if icons are missing
  if (isLight) {
    darkIcon?.classList.remove('hidden');
    lightIcon?.classList.add('hidden');
    mobileDarkIcon?.classList.remove('hidden');
    mobileLightIcon?.classList.add('hidden');
  } else {
    darkIcon?.classList.add('hidden');
    lightIcon?.classList.remove('hidden');
    mobileDarkIcon?.classList.add('hidden');
    mobileLightIcon?.classList.remove('hidden');
  }
};

const applyTheme = (isLight) => {
  if (isLight) document.body.classList.add('light');
  else document.body.classList.remove('light');
  updateIcons(isLight);
};

const toggleTheme = () => {
  const isLight = !document.body.classList.contains('light');
  applyTheme(isLight);
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
};

// Initialize theme: prefer saved choice, otherwise follow system preference.
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  applyTheme(true);
} else if (savedTheme === 'dark') {
  applyTheme(false);
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
  applyTheme(true);
} else {
  applyTheme(false);
}

// If user hasn't chosen, listen to system preference changes and adapt automatically
if (!savedTheme && window.matchMedia) {
  const mq = window.matchMedia('(prefers-color-scheme: light)');
  const mqHandler = (e) => {
    applyTheme(e.matches);
  };
  if (typeof mq.addEventListener === 'function') {
    mq.addEventListener('change', mqHandler);
  } else if (typeof mq.addListener === 'function') {
    mq.addListener(mqHandler);
  }
}

if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
if (mobileThemeToggleBtn) mobileThemeToggleBtn.addEventListener('click', toggleTheme);

// Mobile menu toggle
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const hamburgerIcon = document.getElementById('hamburger-icon');
const closeIcon = document.getElementById('close-icon');

if (menuBtn && mobileMenu && hamburgerIcon && closeIcon) {
  menuBtn.addEventListener('click', () => {
    const isOpen = document.body.classList.contains('menu-open');

    if (!isOpen) {
      document.body.classList.add('menu-open');
      hamburgerIcon.classList.add('hidden');
      closeIcon.classList.remove('hidden');
    } else {
      document.body.classList.remove('menu-open');
      hamburgerIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
    }
  });

  // Close menu when a link is clicked
  document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
      hamburgerIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
    });
  });
}

// Smooth-scroll for in-page anchors (data-smooth-scroll)
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
  const track = testimonialCarousel.querySelector('.testimonial-carousel-track');
  const cards = Array.from(track.children);
  const nextButton = testimonialCarousel.querySelector('.testimonial-nav-btn.next');
  const prevButton = testimonialCarousel.querySelector('.testimonial-nav-btn.prev');
  const pagination = testimonialCarousel.querySelector('.testimonial-pagination');

  let cardWidth = cards[0].getBoundingClientRect().width;
  let cardsToShow = 1;

  const updateCardsToShow = () => {
    if (window.innerWidth >= 1024) {
      cardsToShow = 3;
    } else if (window.innerWidth >= 768) {
      cardsToShow = 2;
    } else {
      cardsToShow = 1;
    }
    cardWidth = track.scrollWidth / cards.length;
  };

  updateCardsToShow();
  window.addEventListener('resize', updateCardsToShow);

  // Create pagination dots
  const totalPages = Math.ceil(cards.length / cardsToShow);
  for (let i = 0; i < totalPages; i++) {
    const dot = document.createElement('button');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => moveToPage(i));
    pagination.appendChild(dot);
  }
  const dots = Array.from(pagination.children);

  let currentPage = 0;

  const moveToPage = (pageIndex) => {
    if (pageIndex < 0 || pageIndex >= totalPages) return;
    const scrollAmount = pageIndex * cardWidth * cardsToShow;
    track.style.transform = `translateX(-${scrollAmount}px)`;
    currentPage = pageIndex;
    updateDots();
  };

  const updateDots = () => {
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentPage);
    });
  };

  nextButton.addEventListener('click', () => {
    moveToPage(currentPage + 1);
  });

  prevButton.addEventListener('click', () => {
    moveToPage(currentPage - 1);
  });
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
