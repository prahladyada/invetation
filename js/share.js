/* ==========================================================================
   Priya & Rahul — Wedding Invitation
   share.js — native share sheet with clipboard fallback, QR code
   ========================================================================== */

function fallbackCopyToClipboard(text){
  var textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '-1000px';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, text.length);
  var copied = false;
  try { copied = document.execCommand('copy'); } catch (err) { copied = false; }
  document.body.removeChild(textarea);
  return copied;
}

function copyInvitationLink(){
  var url = window.location.href;
  if (navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(url)
      .then(function(){ window.showToast('Invitation link copied!'); })
      .catch(function(){
        if (fallbackCopyToClipboard(url)) window.showToast('Invitation link copied!');
        else window.showToast('Copy this link: ' + url);
      });
  } else if (fallbackCopyToClipboard(url)){
    window.showToast('Invitation link copied!');
  } else {
    window.showToast('Copy this link: ' + url);
  }
}

function initShareButton(){
  var shareBtn = document.getElementById('shareBtn');
  if (!shareBtn) return;
  var cfg = window.weddingConfig;

  shareBtn.addEventListener('click', function(){
    var shareData = {
      title: cfg.invitationTitle,
      text: cfg.invitationMessage,
      url: window.location.href
    };
    if (navigator.share){
      navigator.share(shareData).catch(function(err){
        // AbortError just means the user cancelled the native share sheet.
        if (err && err.name !== 'AbortError') copyInvitationLink();
      });
    } else {
      copyInvitationLink();
    }
  });
}

function initQRCode(){
  var wrap = document.getElementById('qrCodeWrap');
  var downloadBtn = document.getElementById('downloadQrBtn');
  if (!wrap) return;

  var url = window.location.href;

  function renderLinkFallback(){
    wrap.innerHTML = '';
    var link = document.createElement('a');
    link.href = url;
    link.textContent = url;
    link.className = 'qr-fallback-link';
    wrap.appendChild(link);
    if (downloadBtn) downloadBtn.hidden = true;
  }

  if (typeof QRCode === 'undefined'){
    // CDN library didn't load (offline / blocked) — degrade gracefully
    // instead of leaving an empty box.
    renderLinkFallback();
    return;
  }

  try {
    // eslint-disable-next-line no-new
    new QRCode(wrap, {
      text: url,
      width: 220,
      height: 220,
      colorDark: '#2B1714',
      colorLight: '#FFFFFF',
      correctLevel: QRCode.CorrectLevel.M
    });
  } catch (err){
    renderLinkFallback();
    return;
  }

  if (downloadBtn){
    downloadBtn.addEventListener('click', function(){
      var canvas = wrap.querySelector('canvas');
      if (!canvas){
        window.showToast('QR download is not supported in this browser.');
        return;
      }
      var link = document.createElement('a');
      link.download = 'wedding-invitation-qr.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }
}

initShareButton();
initQRCode();
