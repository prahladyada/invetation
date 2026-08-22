/* ==========================================================================
   Priya & Rahul — Wedding Invitation
   countdown.js — live countdown to weddingConfig.weddingDate
   ========================================================================== */

function initCountdown(){
  var cfg = window.weddingConfig;
  var target = new Date(cfg.weddingDate).getTime();

  var daysEl = document.getElementById('cdDays');
  var hoursEl = document.getElementById('cdHours');
  var minutesEl = document.getElementById('cdMinutes');
  var secondsEl = document.getElementById('cdSeconds');
  var completeEl = document.getElementById('countdownComplete');
  var gridEl = document.getElementById('countdownGrid');
  if (!daysEl || !hoursEl || !minutesEl || !secondsEl || isNaN(target)) return;

  var last = { d: null, h: null, m: null, s: null };
  var intervalId = null;

  function pulse(el){
    el.classList.remove('is-updating');
    // eslint-disable-next-line no-unused-expressions
    void el.offsetWidth; // force reflow so the animation can restart
    el.classList.add('is-updating');
  }

  function render(){
    var diff = target - Date.now();

    if (diff <= 0){
      window.clearInterval(intervalId);
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      if (gridEl) gridEl.setAttribute('hidden', '');
      if (completeEl) completeEl.hidden = false;
      return;
    }

    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);

    var dStr = String(d).padStart(2, '0');
    var hStr = String(h).padStart(2, '0');
    var mStr = String(m).padStart(2, '0');
    var sStr = String(s).padStart(2, '0');

    if (dStr !== last.d){ daysEl.textContent = dStr; pulse(daysEl); last.d = dStr; }
    if (hStr !== last.h){ hoursEl.textContent = hStr; pulse(hoursEl); last.h = hStr; }
    if (mStr !== last.m){ minutesEl.textContent = mStr; pulse(minutesEl); last.m = mStr; }
    if (sStr !== last.s){ secondsEl.textContent = sStr; pulse(secondsEl); last.s = sStr; }
  }

  render();
  intervalId = window.setInterval(render, 1000);

  // Avoid a stale display if the tab was backgrounded for a while.
  document.addEventListener('visibilitychange', function(){
    if (!document.hidden) render();
  });
}

initCountdown();
