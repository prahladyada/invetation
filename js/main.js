/* ==========================================================================
   Priya & Rahul — Wedding Invitation
   main.js — configuration, loading screen, cover screen, navigation,
             background music, cursor effects, floating petals, calendar.
   Loaded first (via `defer`) so weddingConfig and shared helpers are
   available to animations.js / countdown.js / gallery.js / rsvp.js / share.js
   ========================================================================== */

/* --------------------------------------------------------------------
   1. Single configuration object — edit this to reuse the template
      for a different wedding. Every other script reads from here.
   -------------------------------------------------------------------- */
window.weddingConfig = {
  brideFirstName: "Priya",
  groomFirstName: "Rahul",
  brideFullName: "Priya Sharma",
  groomFullName: "Rahul Singh",

  // ISO 8601 with an explicit offset so the countdown is accurate for
  // every guest regardless of their own timezone.
  weddingDate: "2026-12-25T18:00:00+05:30",
  weddingDateDisplay: "25 December 2026",

  venueName: "The Grand Palace",
  city: "New Delhi, India",

  whatsappNumber: "919999999999", // country code + number, digits only

  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=The+Grand+Palace+New+Delhi+India",

  invitationTitle: "Priya & Rahul Wedding",
  invitationMessage: "You are invited to celebrate our special day \u2764\uFE0F"
};

/* --------------------------------------------------------------------
   2. Toast helper — shared by rsvp.js and share.js
   -------------------------------------------------------------------- */
(function toastModule(){
  var toastTimeout = null;
  window.showToast = function showToast(message){
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function(){
      toast.classList.remove('is-visible');
    }, 3200);
  };
})();

/* --------------------------------------------------------------------
   3. Shared feature checks
   -------------------------------------------------------------------- */
var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* --------------------------------------------------------------------
   4. Loading screen — shows for a minimum cinematic duration even on
      a fast connection, then hands off to the cover screen.
   -------------------------------------------------------------------- */
var PAGE_START = performance.now();
var MIN_LOADING_MS = 1800;

function setupDrawPaths(){
  var paths = document.querySelectorAll('.draw-path');
  paths.forEach(function(path){
    try {
      var length = Math.ceil(path.getTotalLength());
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
    } catch (err) { /* getTotalLength unsupported — draw-in simply skipped */ }
  });
}

function generateCoverParticles(count){
  var container = document.getElementById('coverParticles');
  if (!container || prefersReducedMotion) return;
  var frag = document.createDocumentFragment();
  for (var i = 0; i < count; i++){
    var p = document.createElement('span');
    p.className = 'cover-particle';
    var size = 2 + Math.random() * 3;
    p.style.setProperty('--s', size.toFixed(1) + 'px');
    p.style.setProperty('--d', (Math.random() * 4).toFixed(2) + 's');
    p.style.setProperty('--po', (0.35 + Math.random() * 0.5).toFixed(2));
    p.style.animationDuration = (3.5 + Math.random() * 3).toFixed(2) + 's';
    p.style.left = (Math.random() * 100).toFixed(2) + '%';
    p.style.top = (Math.random() * 100).toFixed(2) + '%';
    frag.appendChild(p);
  }
  container.appendChild(frag);
}

function activateCoverEntrance(){
  var cover = document.getElementById('coverScreen');
  if (!cover) return;
  cover.classList.add('is-active');
  document.querySelectorAll('.draw-path').forEach(function(p){
    p.style.strokeDashoffset = '0';
  });
}

function hideLoadingScreen(){
  var loadingScreen = document.getElementById('loadingScreen');
  if (!loadingScreen) { activateCoverEntrance(); return; }
  loadingScreen.classList.add('is-hidden');
  window.setTimeout(function(){
    loadingScreen.style.display = 'none';
    activateCoverEntrance();
  }, 950);
}

function beginLoadingSequence(){
  var elapsed = performance.now() - PAGE_START;
  var remaining = Math.max(0, MIN_LOADING_MS - elapsed);
  window.setTimeout(hideLoadingScreen, remaining);
}

/* --------------------------------------------------------------------
   5. Cover screen open interaction
   -------------------------------------------------------------------- */
function lockMainContent(){
  var mainInvitation = document.getElementById('mainInvitation');
  if (mainInvitation) mainInvitation.setAttribute('inert', '');
}

function unlockMainContent(){
  var mainInvitation = document.getElementById('mainInvitation');
  var nav = document.getElementById('mainNav');
  var fabStack = document.querySelector('.fab-stack');

  document.documentElement.classList.add('scroll-unlocked');
  document.body.classList.add('scroll-unlocked');

  if (mainInvitation){
    mainInvitation.removeAttribute('inert');
    mainInvitation.classList.add('is-visible');
  }
  if (nav) nav.classList.add('is-visible');
  if (fabStack) fabStack.classList.add('is-visible');

  initPetals();

  // Move focus into the page for keyboard and screen-reader users.
  var homeHeading = document.querySelector('#home .hero-heading');
  if (homeHeading){
    homeHeading.setAttribute('tabindex', '-1');
    homeHeading.focus({ preventScroll: true });
  }
}

function initCoverOpen(){
  var openBtn = document.getElementById('openInvitationBtn');
  var cover = document.getElementById('coverScreen');
  if (!openBtn || !cover) return;

  openBtn.addEventListener('click', function(e){
    e.preventDefault();
    if (cover.classList.contains('is-opening')) return;
    cover.classList.add('is-opening');

    attemptPlayMusic();

    window.setTimeout(function(){
      cover.classList.add('is-hidden');
      unlockMainContent();
    }, 1050);
  });
}

/* --------------------------------------------------------------------
   6. Navigation — sticky state, mobile menu, smooth-scroll offset is
      handled by CSS `scroll-margin-top`, active-section highlighting.
   -------------------------------------------------------------------- */
function initNav(){
  var nav = document.getElementById('mainNav');
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');
  if (!nav || !toggle || !menu) return;

  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));

  toggle.addEventListener('click', function(){
    var isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.forEach(function(link){
    link.addEventListener('click', function(){
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', function(e){
    if (!nav.contains(e.target) && menu.classList.contains('is-open')){
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && menu.classList.contains('is-open')){
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });

  window.addEventListener('scroll', function(){
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  }, { passive: true });

  var sections = links
    .map(function(l){ return document.getElementById(l.dataset.section); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length){
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          var id = entry.target.id;
          links.forEach(function(l){
            l.classList.toggle('active', l.dataset.section === id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function(s){ observer.observe(s); });
  }
}

/* --------------------------------------------------------------------
   7. Background music
   -------------------------------------------------------------------- */
var attemptPlayMusic = function(){}; // reassigned inside initMusic

function initMusic(){
  var audio = document.getElementById('weddingMusic');
  var btn = document.getElementById('musicToggle');
  if (!audio || !btn) return;

  var STORAGE_KEY = 'weddingMusicPreference';
  var storedPref = localStorage.getItem(STORAGE_KEY); // 'on' | 'off' | null

  function setPlayingUI(isPlaying){
    btn.classList.toggle('is-playing', isPlaying);
    btn.setAttribute('aria-pressed', String(isPlaying));
    btn.setAttribute('aria-label', isPlaying ? 'Pause wedding music' : 'Play wedding music');
  }

  btn.addEventListener('click', function(){
    if (audio.paused){
      audio.play().then(function(){
        setPlayingUI(true);
        try { localStorage.setItem(STORAGE_KEY, 'on'); } catch (err) {}
      }).catch(function(){ /* no audio source provided yet — ignore */ });
    } else {
      audio.pause();
      setPlayingUI(false);
      try { localStorage.setItem(STORAGE_KEY, 'off'); } catch (err) {}
    }
  });

  attemptPlayMusic = function(){
    if (storedPref === 'off') return;
    audio.play().then(function(){ setPlayingUI(true); }).catch(function(){ setPlayingUI(false); });
  };
}

/* --------------------------------------------------------------------
   8. Custom cursor + mouse glow (desktop, fine-pointer only)
   -------------------------------------------------------------------- */
function initCursorEffects(){
  if (!isFinePointer || prefersReducedMotion) return;

  var cursor = document.getElementById('customCursor');
  var ring = document.getElementById('cursorRing');
  var glow = document.getElementById('mouseGlow');
  if (!cursor || !ring || !glow) return;

  document.body.classList.add('custom-cursor-active');

  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;
  var ringX = mouseX, ringY = mouseY;
  var rafId = null;

  window.addEventListener('mousemove', function(e){
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = 'translate(' + mouseX + 'px,' + mouseY + 'px) translate(-50%,-50%)';
    glow.style.setProperty('--mx', mouseX + 'px');
    glow.style.setProperty('--my', mouseY + 'px');
  }, { passive: true });

  function animateRing(){
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = 'translate(' + ringX + 'px,' + ringY + 'px) translate(-50%,-50%)';
    rafId = requestAnimationFrame(animateRing);
  }
  rafId = requestAnimationFrame(animateRing);

  document.addEventListener('visibilitychange', function(){
    if (document.hidden){ cancelAnimationFrame(rafId); }
    else { rafId = requestAnimationFrame(animateRing); }
  });

  var hoverSelector = 'a, button, input, textarea, select, .gallery-item';
  document.addEventListener('mouseover', function(e){
    if (e.target.closest && e.target.closest(hoverSelector)) ring.classList.add('is-hovering');
  });
  document.addEventListener('mouseout', function(e){
    if (e.target.closest && e.target.closest(hoverSelector)) ring.classList.remove('is-hovering');
  });
}

/* --------------------------------------------------------------------
   9. Floating petals — generated after the invitation opens.
      Capped and paused off-screen to avoid runaway DOM growth.
   -------------------------------------------------------------------- */
var petalsStarted = false;
function initPetals(){
  if (petalsStarted) return;
  petalsStarted = true;

  var container = document.getElementById('petalContainer');
  if (!container || prefersReducedMotion) return;

  var MAX_PETALS = 24;
  var SPAWN_MS = 700;
  var activeCount = 0;
  var intervalId = null;

  function createPetal(){
    if (document.hidden || activeCount >= MAX_PETALS) return;
    var petal = document.createElement('div');
    petal.className = 'petal';
    var size = 8 + Math.random() * 8;
    var duration = 7 + Math.random() * 6;
    var drift = Math.round(Math.random() * 160 - 80);
    petal.style.setProperty('--ps', size.toFixed(1) + 'px');
    petal.style.setProperty('--pd', duration.toFixed(2) + 's');
    petal.style.setProperty('--px', drift + 'px');
    petal.style.setProperty('--po', (0.5 + Math.random() * 0.35).toFixed(2));
    petal.style.left = (Math.random() * 100).toFixed(2) + '%';
    petal.style.transform = 'rotate(' + Math.floor(Math.random() * 360) + 'deg)';
    container.appendChild(petal);
    activeCount++;
    window.setTimeout(function(){
      petal.remove();
      activeCount--;
    }, duration * 1000 + 200);
  }

  intervalId = window.setInterval(createPetal, SPAWN_MS);

  document.addEventListener('visibilitychange', function(){
    window.clearInterval(intervalId);
    if (!document.hidden) intervalId = window.setInterval(createPetal, SPAWN_MS);
  });
}

/* --------------------------------------------------------------------
   10. Add to calendar — generates a .ics file, no backend required.
   -------------------------------------------------------------------- */
function pad2(n){ return String(n).padStart(2, '0'); }

function toICSDate(date){
  return date.getUTCFullYear() +
    pad2(date.getUTCMonth() + 1) +
    pad2(date.getUTCDate()) + 'T' +
    pad2(date.getUTCHours()) +
    pad2(date.getUTCMinutes()) +
    pad2(date.getUTCSeconds()) + 'Z';
}

function escapeICSText(text){
  return String(text).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

function generateICS(){
  var cfg = window.weddingConfig;
  var start = new Date(cfg.weddingDate);
  var end = new Date(start.getTime() + 4 * 60 * 60 * 1000); // 4-hour default duration
  var now = new Date();
  var uid = 'wedding-' + start.getTime() + '@' + (cfg.brideFirstName + cfg.groomFirstName).toLowerCase().replace(/\s+/g, '') + '.invitation';

  var lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//' + escapeICSText(cfg.invitationTitle) + '//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'UID:' + uid,
    'DTSTAMP:' + toICSDate(now),
    'DTSTART:' + toICSDate(start),
    'DTEND:' + toICSDate(end),
    'SUMMARY:' + escapeICSText(cfg.invitationTitle),
    'DESCRIPTION:' + escapeICSText(cfg.invitationMessage),
    'LOCATION:' + escapeICSText(cfg.venueName + ', ' + cfg.city),
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ];
  return lines.join('\r\n');
}

function downloadICS(){
  var blob = new Blob([generateICS()], { type: 'text/calendar;charset=utf-8' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'priya-rahul-wedding.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(function(){ URL.revokeObjectURL(url); }, 2000);
  window.showToast('Calendar event downloaded');
}

function initCalendarButtons(){
  document.querySelectorAll('#addToCalendarBtn, [data-calendar-trigger]').forEach(function(btn){
    btn.addEventListener('click', downloadICS);
  });
}

/* --------------------------------------------------------------------
   11. PWA service worker registration
   -------------------------------------------------------------------- */
function registerServiceWorker(){
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', function(){
    navigator.serviceWorker.register('./service-worker.js').catch(function(){
      /* offline support just won't be available — the site still works */
    });
  });
}

/* --------------------------------------------------------------------
   12. Init
   -------------------------------------------------------------------- */
lockMainContent();
setupDrawPaths();
generateCoverParticles(36);
beginLoadingSequence();
initCoverOpen();
initNav();
initMusic();
initCursorEffects();
initCalendarButtons();
registerServiceWorker();
