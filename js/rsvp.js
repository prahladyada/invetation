/* ==========================================================================
   Priya & Rahul — Wedding Invitation
   rsvp.js — validation, local persistence, success UI, WhatsApp RSVP
   ========================================================================== */

function initRSVP(){
  var form = document.getElementById('rsvpForm');
  var successPanel = document.getElementById('rsvpSuccess');
  var errorEl = document.getElementById('rsvpError');
  if (!form) return;

  var nameInput = document.getElementById('rsvpName');
  var emailInput = document.getElementById('rsvpEmail');
  var phoneInput = document.getElementById('rsvpPhone');
  var guestsInput = document.getElementById('rsvpGuests');
  var mealInput = document.getElementById('rsvpMeal');
  var messageInput = document.getElementById('rsvpMessage');
  var whatsappLink = document.getElementById('whatsappRsvpBtn');
  var isSubmitting = false;

  function showError(message){
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  function clearError(){
    if (!errorEl) return;
    errorEl.hidden = true;
    errorEl.textContent = '';
  }

  function isValidEmail(value){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function updateWhatsAppLink(name){
    if (!whatsappLink) return;
    var cfg = window.weddingConfig;
    var message = [
      'Hello ' + cfg.brideFirstName + ' & ' + cfg.groomFirstName + ' \u2764\uFE0F',
      '',
      'I would love to attend your wedding celebration.',
      '',
      'Name: ' + (name || ''),
      'Guests: '
    ].join('\n');
    whatsappLink.href = 'https://wa.me/' + cfg.whatsappNumber + '?text=' + encodeURIComponent(message);
  }

  function persistRSVP(entry){
    try {
      var key = 'weddingRSVPs';
      var existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(entry);
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (err) {
      /* localStorage unavailable (private browsing, etc.) — RSVP still
         completes for the user, it just isn't persisted locally. */
    }
  }

  /*
   * submitRSVP() is the single place an RSVP is "sent". For this frontend
   * demo it saves to localStorage and resolves immediately. To connect a
   * real backend, replace the body with a fetch() call to your PHP /
   * Node.js / Firebase / Google Sheets / REST endpoint — validation and
   * the success UI below do not need to change.
   */
  function submitRSVP(entry){
    persistRSVP(entry);
    return Promise.resolve({ ok: true });
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    if (isSubmitting) return;
    clearError();
    [nameInput, emailInput].forEach(function(el){ el.classList.remove('is-invalid'); });

    var name = nameInput.value.trim();
    var email = emailInput.value.trim();

    if (!name){
      nameInput.classList.add('is-invalid');
      showError('Please enter your name.');
      nameInput.focus();
      return;
    }
    if (!email || !isValidEmail(email)){
      emailInput.classList.add('is-invalid');
      showError('Please enter a valid email address.');
      emailInput.focus();
      return;
    }

    var attending = (e.submitter && e.submitter.dataset.attending) || 'yes';
    var entry = {
      name: name,
      email: email,
      phone: phoneInput.value.trim(),
      guests: guestsInput.value,
      meal: mealInput.value,
      message: messageInput.value.trim(),
      attending: attending,
      submittedAt: new Date().toISOString()
    };

    isSubmitting = true;
    submitRSVP(entry).then(function(){
      form.hidden = true;
      if (successPanel) successPanel.hidden = false;
      updateWhatsAppLink(name);
    }).catch(function(){
      showError('Something went wrong sending your RSVP. Please try again.');
    }).finally(function(){
      isSubmitting = false;
    });
  });

  nameInput.addEventListener('input', function(){ updateWhatsAppLink(nameInput.value.trim()); });
  updateWhatsAppLink('');
}

initRSVP();
