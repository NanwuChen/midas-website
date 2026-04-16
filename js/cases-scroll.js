/**
 * Cases — Handles both:
 * 1. Homepage horizontal carousel (cases-preview-track)
 * 2. Cases page stacked card reveal (cases-main)
 */

document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.cases-preview-track');

  // === Homepage: Horizontal Carousel ===
  if (track) {
    const dots = document.querySelectorAll('.cases-preview-dot');
    const cards = track.querySelectorAll('.case-card');

    function updateDots() {
      let activeIndex = 0;
      let minDistance = Infinity;

      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2 - track.offsetLeft;
        const viewCenter = track.scrollLeft + track.clientWidth / 2;
        const distance = Math.abs(cardCenter - viewCenter);
        if (distance < minDistance) {
          minDistance = distance;
          activeIndex = i;
        }
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === activeIndex);
      });
    }

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.dataset.slide);
        const card = cards[index];
        if (card) {
          const scrollTo = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
          track.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
      });
    });

    track.addEventListener('scroll', updateDots);
    return;
  }

  // === Cases Page: Stacked card scroll reveal ===
  const casesMain = document.querySelector('.cases-main');
  if (!casesMain) return;

  const cards = casesMain.querySelectorAll('.case-card');
  if (cards.length === 0) return;

  // Reveal cards on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = Array.from(cards).indexOf(entry.target) * 100;
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, delay);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '-10% 0px'
  });

  cards.forEach(card => observer.observe(card));

  // Scroll-based scale + overlay effect
  function handleScroll() {
    const scrollY = window.pageYOffset;
    const windowHeight = window.innerHeight;

    cards.forEach(card => {
      const cardRect = card.getBoundingClientRect();
      const cardTop = cardRect.top + scrollY;
      const scrollStart = cardTop;
      const scrollEnd = cardTop - windowHeight * 1.5;
      const scrollProgress = Math.max(0, Math.min(1, (scrollY - scrollStart) / (scrollEnd - scrollStart)));

      const scaleProgress = 1 - Math.pow(1 - scrollProgress, 4);
      const scale = 1 - (scaleProgress * 0.15);
      const opacity = scrollProgress * 0.6;

      if (scrollProgress > 0) {
        card.style.transform = `scale(${scale})`;
        card.style.transformOrigin = 'top center';
        const overlay = card.querySelector('.case-card__overlay');
        if (overlay) overlay.style.opacity = Math.min(opacity, 0.6);
      } else {
        card.style.transform = 'scale(1)';
        const overlay = card.querySelector('.case-card__overlay');
        if (overlay) overlay.style.opacity = '0';
      }
    });
  }

  function throttle(func, limit) {
    let inThrottle;
    return function() {
      if (!inThrottle) {
        func.apply(this, arguments);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  handleScroll();
  window.addEventListener('scroll', throttle(handleScroll, 16));

  // If URL has a hash, reveal that card immediately
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target && target.classList.contains('case-card')) {
      target.classList.add('is-visible');
      // Small delay to let browser scroll to anchor
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }

  // Inject reveal styles for cases page
  const style = document.createElement('style');
  style.textContent = `
    .cases-main .case-card.is-visible {
      opacity: 1;
      transform: translateY(0);
      transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
  `;
  document.head.appendChild(style);
});
