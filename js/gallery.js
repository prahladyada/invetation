/* ==========================================================================
   Priya & Rahul — Wedding Invitation
   gallery.js — fullscreen lightbox: prev/next, keyboard, swipe, focus trap
   ========================================================================== */

function initGallery(){
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  var lightbox = document.getElementById('lightbox');
  if (!items.length || !lightbox) return;

  var lightboxImg = document.getElementById('lightboxImg');
  var counterEl = document.getElementById('lightboxCounter');
  var closeBtn = document.getElementById('lightboxClose');
  var prevBtn = document.getElementById('lightboxPrev');
  var nextBtn = document.getElementById('lightboxNext');
  var backdrop = document.getElementById('lightboxBackdrop');
  var focusable = [prevBtn, closeBtn, nextBtn].filter(Boolean);

  var images = items.map(function(item){
    var img = item.querySelector('img');
    return { src: img.getAttribute('src'), alt: img.getAttribute('alt') || '' };
  });

  var currentIndex = 0;
  var lastFocusedEl = null;
  var hideTimeoutId = null;

  function updateImage(){
    var data = images[currentIndex];
    lightboxImg.src = data.src;
    lightboxImg.alt = data.alt;
    counterEl.textContent = (currentIndex + 1) + ' / ' + images.length;
  }

  function showNext(){ currentIndex = (currentIndex + 1) % images.length; updateImage(); }
  function showPrev(){ currentIndex = (currentIndex - 1 + images.length) % images.length; updateImage(); }

  function trapFocus(e){
    if (e.key !== 'Tab' || focusable.length < 2) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first){
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last){
      e.preventDefault();
      first.focus();
    }
  }

  function onKeydown(e){
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowRight') showNext();
    else if (e.key === 'ArrowLeft') showPrev();
    else trapFocus(e);
  }

  function openLightbox(index){
    currentIndex = index;
    lastFocusedEl = document.activeElement;
    window.clearTimeout(hideTimeoutId);
    updateImage();
    lightbox.hidden = false;
    requestAnimationFrame(function(){ lightbox.classList.add('is-visible'); });
    document.addEventListener('keydown', onKeydown);
    closeBtn.focus();
  }

  function closeLightbox(){
    lightbox.classList.remove('is-visible');
    document.removeEventListener('keydown', onKeydown);
    hideTimeoutId = window.setTimeout(function(){ lightbox.hidden = true; }, 350);
    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') lastFocusedEl.focus();
  }

  items.forEach(function(item, index){
    item.addEventListener('click', function(){ openLightbox(index); });
  });

  closeBtn.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);
  nextBtn.addEventListener('click', showNext);
  prevBtn.addEventListener('click', showPrev);

  // Swipe support on mobile
  var touchStartX = 0;
  var touchStartY = 0;
  lightbox.addEventListener('touchstart', function(e){
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });

  lightbox.addEventListener('touchend', function(e){
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)){
      if (dx < 0) showNext(); else showPrev();
    }
  }, { passive: true });
}

initGallery();
