/* ========================================
   MAIN.JS — Scroll reveal + Mobile nav
   ======================================== */

// Scroll reveal with IntersectionObserver
document.addEventListener('DOMContentLoaded', function() {

  // --- Scroll Reveal ---
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal').forEach(function(el) {
    observer.observe(el);
  });

  // --- Mobile Nav Toggle ---
  var toggle = document.querySelector('.header__toggle');
  var mobileNav = document.querySelector('.header__mobile-nav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function() {
      toggle.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });

    // Close mobile nav when clicking a link
    mobileNav.querySelectorAll('.header__link').forEach(function(link) {
      link.addEventListener('click', function() {
        toggle.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }

  // --- Get Started Form Functions ---
  // FAQ Toggle
  var faqToggles = document.querySelectorAll('.getstarted__faq-toggle');
  faqToggles.forEach(function(toggle) {
    toggle.addEventListener('click', function() {
      var faqIndex = toggle.getAttribute('data-faq');
      var faqItem = toggle.closest('.getstarted__faq-item');
      var isOpen = faqItem.classList.contains('open');

      // Close all FAQ items
      document.querySelectorAll('.getstarted__faq-item').forEach(function(item) {
        item.classList.remove('open');
      });

      // Open clicked item if it wasn't already open
      if (!isOpen) {
        faqItem.classList.add('open');
      }
    });
  });

  // Form Submission
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      var formData = new FormData(contactForm);
      var submitButton = contactForm.querySelector('.getstarted__submit');
      var originalText = submitButton.textContent;

      // Show loading state
      submitButton.textContent = 'SUBMITTING...';
      submitButton.disabled = true;

      // Add timestamp to form data
      formData.append('timestamp', new Date().toISOString());

      // Submit to Google Apps Script (using FormData, not JSON)
      fetch(contactForm.action, {
        method: 'POST',
        body: formData
      })
      .then(function(response) {
        if (response.ok) {
          // Show success state
          contactForm.style.display = 'none';
          document.getElementById('success-state').style.display = 'flex';
        } else {
          throw new Error('Form submission failed');
        }
      })
      .catch(function(error) {
        console.error('Form submission error:', error);
        alert('There was an error submitting the form. Please try again or contact us directly at business@midastouch.partners');

        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      });
    });
  }

});
