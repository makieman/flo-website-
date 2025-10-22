
// Mobile menu toggle
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const hamburgerIcon = document.getElementById('hamburger-icon');
const closeIcon = document.getElementById('close-icon');

if (menuBtn && mobileMenu && hamburgerIcon && closeIcon) {
  menuBtn.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.contains('hidden');

    if (isHidden) {
      mobileMenu.classList.remove('hidden', 'opacity-0', 'invisible');
      mobileMenu.classList.add('flex', 'flex-col', 'opacity-100', 'visible', 'animate-fadeInDown');
      hamburgerIcon.classList.add('hidden');
      closeIcon.classList.remove('hidden');
    } else {
      mobileMenu.classList.add('opacity-0');
      setTimeout(() => {
        mobileMenu.classList.add('hidden', 'invisible');
        hamburgerIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
      }, 300);
    }
  });

  // Close menu when a link is clicked
  document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('opacity-0');
      setTimeout(() => {
        mobileMenu.classList.add('hidden', 'invisible');
        hamburgerIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
      }, 300);
    });
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
