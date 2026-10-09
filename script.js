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

  if (track && slides.length > 0) {
    // Build indicator dots
    if (dotsContainer) {
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
  }

  // --------------------------------------------------------------------------
  // 3. CARD PHOTO SLIDERS (GENERIC CONTROLLER FOR ANY SERVICE CARD)
  // --------------------------------------------------------------------------
  const cardSliders = document.querySelectorAll('.card-thumb-slider');

  cardSliders.forEach(slider => {
    const slides = slider.querySelectorAll('.card-thumb-slides .card-thumb-img');
    const prevBtn = slider.querySelector('.card-slider-btn.prev');
    const nextBtn = slider.querySelector('.card-slider-btn.next');
    const badge = slider.querySelector('.card-slider-badge');
    const dotsContainer = slider.querySelector('.card-slider-dots');
    const galleryTitle = slider.getAttribute('data-gallery-title') || 'Детейлинг ELENSV';

    if (slides.length <= 1) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      if (badge) badge.style.display = 'none';
      if (dotsContainer) dotsContainer.style.display = 'none';

      slider.addEventListener('click', (e) => {
        if (e.target.closest('.card-slider-btn') || e.target.closest('.card-slider-dot')) return;
        const firstImg = slides[0];
        if (firstImg) {
          window.openLightboxGallery([{
            src: firstImg.getAttribute('src'),
            caption: galleryTitle
          }], 0);
        }
      });
      return;
    }

    let currentIdx = 0;
    const total = slides.length;

    // Build dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('span');
        dot.className = 'card-slider-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          goToCardSlide(i);
        });
        dotsContainer.appendChild(dot);
      }
    }

    function goToCardSlide(index) {
      currentIdx = (index + total) % total;
      slides.forEach((img, i) => {
        img.classList.toggle('active', i === currentIdx);
      });
      if (badge) {
        badge.textContent = `${currentIdx + 1} / ${total}`;
      }
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.card-slider-dot');
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === currentIdx);
        });
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToCardSlide(currentIdx - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToCardSlide(currentIdx + 1);
      });
    }

    // Touch swipe for card slider
    let cardTouchStartX = 0;
    let cardTouchEndX = 0;
    slider.addEventListener('touchstart', (e) => {
      cardTouchStartX = e.touches[0].clientX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      cardTouchEndX = e.changedTouches[0].clientX;
      const diff = cardTouchStartX - cardTouchEndX;
      if (Math.abs(diff) > 35) {
        if (diff > 0) goToCardSlide(currentIdx + 1);
        else goToCardSlide(currentIdx - 1);
      }
    }, { passive: true });

    // Click on slider opens Lightbox gallery at current slide
    slider.addEventListener('click', (e) => {
      // Don't trigger if clicked on arrows or dots
      if (e.target.closest('.card-slider-btn') || e.target.closest('.card-slider-dot')) return;

      const galleryItems = Array.from(slides).map((img, i) => ({
        src: img.getAttribute('src'),
        caption: `${galleryTitle} (${i + 1} из ${total})`
      }));
      window.openLightboxGallery(galleryItems, currentIdx);
    });
  });

  // --------------------------------------------------------------------------
  // 4. 4K LIGHTBOX VIEWER WITH GALLERY SUPPORT
  // --------------------------------------------------------------------------
  const lbModal = document.getElementById('lightboxModal');
  const lbImg = document.getElementById('lightboxImg');
  const lbCaption = document.getElementById('lightboxCaption');
  const lbPrevBtn = document.getElementById('lightboxPrev');
  const lbNextBtn = document.getElementById('lightboxNext');

  let currentGallery = null;
  let currentGalleryIdx = 0;

  function updateLightboxView() {
    if (!currentGallery || !lbImg) return;
    const item = currentGallery[currentGalleryIdx];
    lbImg.src = item.src;
    if (lbCaption) lbCaption.textContent = item.caption || '';
  }

  window.openLightbox = function(imageSrc, caption) {
    currentGallery = null;
    currentGalleryIdx = 0;
    if (lbPrevBtn) lbPrevBtn.classList.add('hidden');
    if (lbNextBtn) lbNextBtn.classList.add('hidden');

    if (lbModal && lbImg) {
      lbImg.src = imageSrc;
      if (lbCaption) lbCaption.textContent = caption || '';
      lbModal.classList.add('active');
    }
  };

  window.openLightboxGallery = function(items, startIdx = 0) {
    if (!items || items.length === 0) return;
    currentGallery = items;
    currentGalleryIdx = (startIdx + items.length) % items.length;

    if (items.length > 1) {
      if (lbPrevBtn) lbPrevBtn.classList.remove('hidden');
      if (lbNextBtn) lbNextBtn.classList.remove('hidden');
    } else {
      if (lbPrevBtn) lbPrevBtn.classList.add('hidden');
      if (lbNextBtn) lbNextBtn.classList.add('hidden');
    }

    updateLightboxView();
    if (lbModal) lbModal.classList.add('active');
  };

  if (lbPrevBtn) {
    lbPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!currentGallery || currentGallery.length <= 1) return;
      currentGalleryIdx = (currentGalleryIdx - 1 + currentGallery.length) % currentGallery.length;
      updateLightboxView();
    });
  }

  if (lbNextBtn) {
    lbNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!currentGallery || currentGallery.length <= 1) return;
      currentGalleryIdx = (currentGalleryIdx + 1) % currentGallery.length;
      updateLightboxView();
    });
  }

  window.closeLightbox = function(e) {
    if (lbModal) {
      if (!e || e.target.id === 'lightboxModal' || e.target.classList.contains('lightbox-close-cross')) {
        lbModal.classList.remove('active');
      }
    }
  };

  // Keyboard Navigation: Escape, ArrowLeft, ArrowRight
  document.addEventListener('keydown', (e) => {
    if (!lbModal || !lbModal.classList.contains('active')) return;

    if (e.key === 'Escape') {
      lbModal.classList.remove('active');
    } else if (e.key === 'ArrowLeft' && currentGallery && currentGallery.length > 1) {
      currentGalleryIdx = (currentGalleryIdx - 1 + currentGallery.length) % currentGallery.length;
      updateLightboxView();
    } else if (e.key === 'ArrowRight' && currentGallery && currentGallery.length > 1) {
      currentGalleryIdx = (currentGalleryIdx + 1) % currentGallery.length;
      updateLightboxView();
    }
  });

  // Touch Swipe for Lightbox
  let lbTouchStartX = 0;
  let lbTouchEndX = 0;
  if (lbModal) {
    lbModal.addEventListener('touchstart', (e) => {
      lbTouchStartX = e.touches[0].clientX;
    }, { passive: true });

    lbModal.addEventListener('touchend', (e) => {
      lbTouchEndX = e.changedTouches[0].clientX;
      const diff = lbTouchStartX - lbTouchEndX;
      if (Math.abs(diff) > 40 && currentGallery && currentGallery.length > 1) {
        if (diff > 0) {
          currentGalleryIdx = (currentGalleryIdx + 1) % currentGallery.length;
        } else {
          currentGalleryIdx = (currentGalleryIdx - 1 + currentGallery.length) % currentGallery.length;
        }
        updateLightboxView();
      }
    }, { passive: true });
  }

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

  // --------------------------------------------------------------------------
  // 5. COOKIE CONSENT BANNER (152-FZ)
  // --------------------------------------------------------------------------
  const cookieBanner = document.getElementById('cookieBanner');
  const acceptCookieBtn = document.getElementById('acceptCookieBtn');

  if (cookieBanner && acceptCookieBtn) {
    const isCookieAccepted = localStorage.getItem('elensv_cookie_consent') === 'accepted';
    if (!isCookieAccepted) {
      setTimeout(() => {
        cookieBanner.classList.add('show');
      }, 700);
    }

    acceptCookieBtn.addEventListener('click', () => {
      localStorage.setItem('elensv_cookie_consent', 'accepted');
      cookieBanner.classList.remove('show');
    });
  }

  // --------------------------------------------------------------------------
  // 6. BOOKING & FEEDBACK FORM CONTROLLER (152-FZ)
  // --------------------------------------------------------------------------
  const bookingForm = document.getElementById('bookingForm');
  const clientPhone = document.getElementById('clientPhone');
  const bookingSuccessModal = document.getElementById('bookingSuccessModal');
  const closeSuccessBtn = document.getElementById('closeSuccessBtn');

  // Russian Phone Input Mask (+7 (XXX) XXX-XX-XX)
  if (clientPhone) {
    clientPhone.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.startsWith('8') || value.startsWith('7')) {
        value = value.substring(1);
      }
      let formatted = '+7 ';
      if (value.length > 0) formatted += '(' + value.substring(0, 3);
      if (value.length >= 3) formatted += ') ' + value.substring(3, 6);
      if (value.length >= 6) formatted += '-' + value.substring(6, 8);
      if (value.length >= 8) formatted += '-' + value.substring(8, 10);
      e.target.value = formatted.trim();
    });
  }

  // Form Submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('clientName');
      const carInput = document.getElementById('clientCar');
      const serviceInput = document.getElementById('clientService');
      const commentInput = document.getElementById('clientComment');
      const pdConsent = document.getElementById('pdConsent');

      if (!nameInput.value.trim()) {
        nameInput.focus();
        return;
      }

      if (!clientPhone.value.trim() || clientPhone.value.replace(/\D/g, '').length < 11) {
        clientPhone.focus();
        alert('Пожалуйста, укажите корректный номер телефона для связи.');
        return;
      }

      if (!pdConsent.checked) {
        alert('Для отправки заявки необходимо согласие на обработку персональных данных (152-ФЗ).');
        pdConsent.focus();
        return;
      }

      // Pre-fill Telegram link in success popup
      const clientName = nameInput.value.trim();
      const clientPhoneVal = clientPhone.value.trim();
      const carVal = carInput ? carInput.value.trim() : '';
      const serviceVal = serviceInput ? serviceInput.value : '';
      const commentVal = commentInput ? commentInput.value.trim() : '';

      const tgMsg = encodeURIComponent(
        `Здравствуйте! Заявка с сайта ELENSV:\n` +
        `• Имя: ${clientName}\n` +
        `• Телефон: ${clientPhoneVal}\n` +
        (carVal ? `• Авто: ${carVal}\n` : '') +
        `• Услуга: ${serviceVal}\n` +
        (commentVal ? `• Комментарий: ${commentVal}` : '')
      );

      const tgBtn = document.querySelector('.btn-success-tg');
      if (tgBtn) {
        tgBtn.href = `https://t.me/+79249942444?text=${tgMsg}`;
      }

      // Show success modal
      if (bookingSuccessModal) {
        bookingSuccessModal.classList.add('active');
      }

      bookingForm.reset();
    });
  }

  if (closeSuccessBtn && bookingSuccessModal) {
    closeSuccessBtn.addEventListener('click', () => {
      bookingSuccessModal.classList.remove('active');
    });
  }
});
