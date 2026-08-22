/* ==========================================================================
   Priya & Rahul — Wedding Invitation
   animations.js — IntersectionObserver scroll reveals + rAF parallax
   ========================================================================== */

/* --------------------------------------------------------------------
   Scroll reveal: elements carrying .reveal (+ .fade-up/.fade-left/
   .fade-right/.fade-scale) animate in once they enter the viewport.
   Staggering is read from an optional data-delay attribute.
   -------------------------------------------------------------------- */
function initScrollReveal(){
  var items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)){
    items.forEach(function(el){ el.classList.add('active'); });
    return;
  }

  var STEP_MS = 110;

  var observer = new IntersectionObserver(function(entries, obs){
    entries.forEach(function(entry){
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var delayIndex = parseInt(el.getAttribute('data-delay'), 10) || 0;
      el.style.setProperty('--reveal-delay', (delayIndex * STEP_MS) + 'ms');
      el.classList.add('active');
      obs.unobserve(el);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  items.forEach(function(el){ observer.observe(el); });
}

/* --------------------------------------------------------------------
   Subtle parallax on sections flagged with .parallax, using
   requestAnimationFrame so scroll listeners stay cheap.
   -------------------------------------------------------------------- */
function initParallax(){
  var layers = document.querySelectorAll('.parallax');
  if (!layers.length || prefersReducedMotion) return;

  var ticking = false;

  function update(){
    var scrollY = window.scrollY;
    layers.forEach(function(el){
      var rect = el.parentElement.getBoundingClientRect();
      // Only move layers whose section is near the viewport — cheap guard
      // against unnecessary style writes while far off-screen.
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
      var offset = (scrollY - (el.parentElement.offsetTop - window.innerHeight)) * 0.08;
      el.style.transform = 'translateY(' + offset.toFixed(1) + 'px)';
    });
    ticking = false;
  }

  window.addEventListener('scroll', function(){
    if (!ticking){
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
}

initScrollReveal();
initParallax();
