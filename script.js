/**
 * ELENSV DETAILING STUDIO — JAVASCRIPT CONTROLLER (САЙТ-ВИЗИТКА)
 * Synchronized Portfolio Carousel, 4K Lightbox Viewer & Responsive Mobile Nav
 * Studio: @elensv2444 • +7 924 994 2444
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. MOBILE NAVIGATION DRAWER
  // --------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navItems = document.querySelectorAll('.nav-item, .drawer-link');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('active');
      hamburgerBtn.classList.toggle('active', isOpen);
    });

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburgerBtn.classList.remove('active');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        navMenu.classList.remove('active');
        hamburgerBtn.classList.remove('active');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. SYNCHRONIZED PORTFOLIO CAROUSEL (6 PROJECTS)
  // --------------------------------------------------------------------------
  const track = document.getElementById('carouselTrack');
  const slides = document.querySelectorAll('.slider-slide');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('carouselDots');
  const tabs = document.querySelectorAll('.stage-tab');
  const carouselWrapper = document.getElementById('worksCarousel');

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoplayTimer = null;

  // Build indicator dots
  if (dotsContainer && totalSlides > 0) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = 'c-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => {
        goToSlide(i);
        resetAutoplay();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateCarousel() {
    if (!track) return;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update dots
    const dots = document.querySelectorAll('.c-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });

    // Update category tabs and scroll active tab inside tabs container ONLY (no window scroll)
    tabs.forEach((tab, idx) => {
      const isActive = idx === currentIndex;
      tab.classList.toggle('active', isActive);
      if (isActive && window.innerWidth <= 900) {
        const scrollWrap = tab.closest('.stage-tabs-scroll-wrap');
        if (scrollWrap) {
          const tabOffset = tab.offsetLeft;
          const targetScroll = tabOffset - (scrollWrap.clientWidth / 2) + (tab.clientWidth / 2);
          scrollWrap.scrollTo({ left: targetScroll, behavior: 'smooth' });
        }
      }
    });
  }

  function goToSlide(index) {
    currentIndex = (index + totalSlides) % totalSlides;
    updateCarousel();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      nextSlide();
      resetAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prevSlide();
      resetAutoplay();
    });
  }

  // Tab click bindings (e.preventDefault prevents native focus jump)
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const tabIdx = parseInt(tab.getAttribute('data-tab'), 10);
      goToSlide(tabIdx);
      resetAutoplay();
    });
  });

  // Touch Swipe for Mobile
  let startX = 0;
  let endX = 0;

  if (carouselWrapper) {
    carouselWrapper.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      stopAutoplay();
    }, { passive: true });

    carouselWrapper.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      handleSwipe();
      resetAutoplay();
    }, { passive: true });
  }

  function handleSwipe() {
    const threshold = 40;
    if (startX - endX > threshold) {
      nextSlide();
    } else if (endX - startX > threshold) {
      prevSlide();
    }
  }

  // Smooth Autoplay
  function startAutoplay() {
    if (totalSlides <= 1) return;
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      nextSlide();
    }, 7000);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  if (carouselWrapper) {
    carouselWrapper.addEventListener('mouseenter', stopAutoplay);
    carouselWrapper.addEventListener('mouseleave', startAutoplay);
  }

  startAutoplay();

  // --------------------------------------------------------------------------
  // 3. 4K LIGHTBOX VIEWER
  // --------------------------------------------------------------------------
  window.openLightbox = function(imageSrc, caption) {
    const lbModal = document.getElementById('lightboxModal');
    const lbImg = document.getElementById('lightboxImg');
    const lbCaption = document.getElementById('lightboxCaption');

    if (lbModal && lbImg) {
      lbImg.src = imageSrc;
      if (lbCaption) lbCaption.textContent = caption || '';
      lbModal.classList.add('active');
    }
  };

  window.closeLightbox = function(e) {
    const lbModal = document.getElementById('lightboxModal');
    if (lbModal) {
      if (!e || e.target.id === 'lightboxModal' || e.target.classList.contains('lightbox-close-cross')) {
        lbModal.classList.remove('active');
      }
    }
  };

  // Keyboard Escape Handler
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const lbModal = document.getElementById('lightboxModal');
      if (lbModal) lbModal.classList.remove('active');
    }
  });

  // Strict guard against horizontal viewport drift
  window.addEventListener('scroll', () => {
    if (window.scrollX !== 0) {
      window.scrollTo(0, window.scrollY);
    }
  }, { passive: true });

  // --------------------------------------------------------------------------
  // 4. SMART FLOATING TELEGRAM BUTTON (STOPS ABOVE FOOTER LINE)
  // --------------------------------------------------------------------------
  const floatingBtn = document.querySelector('.floating-tg-btn');
  const footer = document.querySelector('.cyber-footer');

  function adjustFloatingBtn() {
    if (!floatingBtn || !footer) return;

    const footerRect = footer.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const isMobile = window.innerWidth <= 768;
    const defaultBottom = isMobile ? 20 : 28;
    const clearance = isMobile ? 20 : 24; // Margin above the footer top border line

    // Calculate required bottom position to stay above footer
    const bottomFromFooter = (windowHeight - footerRect.top) + clearance;

    if (bottomFromFooter > defaultBottom) {
      floatingBtn.style.bottom = `${bottomFromFooter}px`;
    } else {
      floatingBtn.style.bottom = '';
    }
  }

  let floatTicking = false;
  function handleScrollForFloatingBtn() {
    if (!floatTicking) {
      window.requestAnimationFrame(() => {
        adjustFloatingBtn();
        floatTicking = false;
      });
      floatTicking = true;
    }
  }

  window.addEventListener('scroll', handleScrollForFloatingBtn, { passive: true });
  window.addEventListener('resize', adjustFloatingBtn, { passive: true });
  adjustFloatingBtn();
});
