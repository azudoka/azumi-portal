/**
 * AZUMI RH — Banner de Privacidade v3.0
 * Popup central bloqueante. Ao aceitar, inicia AzumiAnalytics.
 * Se já aceito (180 dias), libera diretamente sem mostrar popup.
 * Base legal: consentimento (LGPD art. 7º, I).
 */
(function () {
  const KEY = 'az_consent';
  const KEY_DATE = 'az_consent_date';

  function liberarFormulario() {
    const overlay = document.getElementById('az-privacy-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
      setTimeout(() => overlay.remove(), 400);
    }
    const slug = document.body.getAttribute('data-form-slug');
    const secs = parseInt(document.body.getAttribute('data-form-secs') || '0');
    if (slug && typeof AzumiAnalytics !== 'undefined') AzumiAnalytics.init(slug, secs);
  }

  const saved = localStorage.getItem(KEY);
  const savedDate = parseInt(localStorage.getItem(KEY_DATE) || '0');
  const diasPassados = (Date.now() - savedDate) / (1000 * 60 * 60 * 24);

  if (saved === 'aceito' && diasPassados < 180) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', liberarFormulario);
    } else {
      liberarFormulario();
    }
    return;
  }

  const style = document.createElement('style');
  style.textContent = `
    #az-privacy-overlay {
      position: fixed;
      inset: 0;
      z-index: 999999;
      background: rgba(3, 29, 56, .92);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      transition: opacity .4s ease;
      backdrop-filter: blur(8px);
    }
    #az-privacy-box {
      background: #071f3a;
      border: 1px solid rgba(59, 130, 246, .3);
      border-radius: 16px;
      padding: 32px 28px 28px;
      max-width: 440px;
      width: 100%;
      box-shadow: 0 24px 64px rgba(0, 0, 0, .5);
    }
    #az-privacy-box .az-pv-icon {
      margin-bottom: 16px;
    }
    #az-privacy-box .az-pv-title {
      font-family: 'Sora', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 10px;
      line-height: 1.3;
    }
    #az-privacy-box .az-pv-text {
      font-family: 'Space Grotesk', Verdana, sans-serif;
      font-size: 13px;
      color: rgba(147, 197, 253, .75);
      line-height: 1.65;
      margin-bottom: 22px;
    }
    #az-privacy-box .az-pv-text a {
      color: #93C5FD;
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    #az-privacy-box .az-pv-text a:hover { color: #fff; }
    #az-privacy-box .az-btn {
      display: block;
      width: 100%;
      background: linear-gradient(135deg, #034C8B, #3B82F6);
      color: #fff;
      border: none;
      border-radius: 100px;
      padding: 14px 24px;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity .18s ease;
      letter-spacing: .01em;
    }
    #az-privacy-box .az-btn:hover { opacity: .88; }
  `;
  document.head.appendChild(style);

  function criarOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'az-privacy-overlay';
    overlay.innerHTML = `
      <div id="az-privacy-box">
        <div class="az-pv-icon">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="rgba(59,130,246,.12)"/>
            <path d="M18 8l8 4V20c0 4.5-4 8-8 9-4-1-8-4.5-8-9v-8l8-4z" stroke="#3B82F6" stroke-width="1.6" fill="none"/>
            <path d="M14 18.5l3 3 5.5-5.5" stroke="#3B82F6" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="az-pv-title">Antes de continuar</div>
        <div class="az-pv-text">
          Para garantir a segurança e personalizar sua experiência, coletamos dados básicos de sessão — dispositivo, localização aproximada e progresso no formulário.<br><br>
          Ao continuar, você concorda com nossa
          <a href="/politica-de-privacidade" target="_blank" rel="noopener">Política de Privacidade</a>.
        </div>
        <button class="az-btn" id="az-aceitar">Entendi e aceito continuar</button>
      </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById('az-aceitar').addEventListener('click', () => {
      localStorage.setItem(KEY, 'aceito');
      localStorage.setItem(KEY_DATE, Date.now().toString());
      liberarFormulario();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', criarOverlay);
  } else {
    criarOverlay();
  }
})();
