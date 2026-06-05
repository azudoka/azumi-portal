/**
 * AZUMI RH — Banner de Privacidade Bloqueante v1.0
 * Cobre toda a tela. Só libera o formulário após aceite.
 * Base legal: legítimo interesse + segurança do serviço (LGPD art. 7º, IX).
 * Decisão salva por 180 dias no localStorage.
 */
(function () {
  const KEY = 'az_consent';
  const KEY_DATE = 'az_consent_date';

  const saved = localStorage.getItem(KEY);
  const savedDate = parseInt(localStorage.getItem(KEY_DATE) || '0');
  const diasPassados = (Date.now() - savedDate) / (1000 * 60 * 60 * 24);

  function liberarFormulario() {
    const overlay = document.getElementById('az-privacy-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
      setTimeout(() => overlay.remove(), 500);
    }
    const slug = document.body.getAttribute('data-form-slug');
    const secs = parseInt(document.body.getAttribute('data-form-secs') || '0');
    if (slug && typeof AzumiAnalytics !== 'undefined') {
      AzumiAnalytics.init(slug, secs);
    }
  }

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
      position: fixed; inset: 0; z-index: 999999;
      background: rgba(3, 29, 56, 0.97);
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
      transition: opacity .45s ease;
      backdrop-filter: blur(4px);
    }
    #az-privacy-box {
      background: #0a2444;
      border: 1px solid rgba(59, 130, 246, 0.35);
      border-radius: 18px;
      padding: 36px 32px 32px;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 24px 80px rgba(0,0,0,.6);
      text-align: center;
      font-family: 'Space Grotesk', Verdana, sans-serif;
    }
    #az-privacy-box .az-pv-logo {
      display: flex; align-items: center; justify-content: center;
      gap: 8px; margin-bottom: 22px;
    }
    #az-privacy-box .az-pv-az {
      font-family: 'Poppins', sans-serif; font-weight: 600;
      font-size: 22px; color: #fff; letter-spacing: -.01em;
    }
    #az-privacy-box .az-pv-rh {
      font-family: 'Poppins', sans-serif; font-style: italic;
      font-weight: 400; font-size: 22px; color: #93C5FD;
    }
    #az-privacy-box .az-pv-title {
      font-family: 'Sora', sans-serif; font-size: 17px;
      font-weight: 800; color: #fff; margin-bottom: 12px;
      line-height: 1.3;
    }
    #az-privacy-box .az-pv-text {
      font-size: 12px; color: rgba(147,197,253,.8);
      line-height: 1.75; margin-bottom: 10px;
    }
    #az-privacy-box .az-pv-lista {
      background: rgba(59,130,246,.08);
      border: 1px solid rgba(59,130,246,.2);
      border-radius: 10px; padding: 12px 16px;
      margin: 14px 0 20px; text-align: left;
    }
    #az-privacy-box .az-pv-lista-item {
      font-size: 11px; color: rgba(147,197,253,.85);
      padding: 4px 0; display: flex; align-items: flex-start; gap: 8px;
    }
    #az-privacy-box .az-pv-lista-item::before {
      content: '';
      width: 6px; height: 6px; border-radius: 50%;
      background: #3B82F6; flex-shrink: 0; margin-top: 4px;
    }
    #az-privacy-box .az-pv-lgpd {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px; color: rgba(147,197,253,.45);
      letter-spacing: .05em; margin-bottom: 20px;
    }
    #az-privacy-box .az-pv-btn {
      width: 100%;
      background: linear-gradient(135deg, #034C8B, #3B82F6, #8B5CF6);
      color: #fff; border: none; border-radius: 100px;
      padding: 14px 28px;
      font-family: 'Sora', sans-serif; font-size: 14px;
      font-weight: 700; cursor: pointer;
      box-shadow: 0 4px 20px rgba(59,130,246,.4);
      transition: all .18s ease;
    }
    #az-privacy-box .az-pv-btn:hover {
      box-shadow: 0 6px 28px rgba(59,130,246,.55);
      transform: translateY(-1px);
    }
    #az-privacy-box .az-pv-nota {
      font-size: 10px; color: rgba(147,197,253,.4);
      margin-top: 14px; line-height: 1.6;
    }
    @media (max-width: 480px) {
      #az-privacy-box { padding: 28px 20px 24px; }
    }
  `;
  document.head.appendChild(style);

  function criarOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'az-privacy-overlay';
    overlay.innerHTML = `
      <div id="az-privacy-box">
        <div class="az-pv-logo">
          <svg width="32" height="26" viewBox="0 0 120 96" fill="none">
            <defs>
              <linearGradient id="azpvg" x1="0" y1="0" x2="120" y2="96" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#034C8B"/>
                <stop offset="50%" stop-color="#3B82F6"/>
                <stop offset="100%" stop-color="#8B5CF6"/>
              </linearGradient>
            </defs>
            <circle cx="44" cy="48" r="34" fill="url(#azpvg)" opacity=".9"/>
            <circle cx="76" cy="48" r="34" fill="url(#azpvg)" opacity=".7"/>
          </svg>
          <span class="az-pv-az">azumi</span><span class="az-pv-rh">RH</span>
        </div>
        <div class="az-pv-title">Antes de continuar</div>
        <div class="az-pv-text">
          Para garantir a segurança e integridade deste formulário,
          coletamos dados básicos da sua sessão de uso.
        </div>
        <div class="az-pv-lista">
          <div class="az-pv-lista-item">Localização aproximada por IP (país, estado, cidade)</div>
          <div class="az-pv-lista-item">Tipo de dispositivo, navegador e sistema operacional</div>
          <div class="az-pv-lista-item">Progresso e tempo de preenchimento do formulário</div>
          <div class="az-pv-lista-item">Origem do acesso (URL de referência)</div>
        </div>
        <div class="az-pv-lgpd">
          Dados usados exclusivamente pela Azumi RH · Sem compartilhamento com terceiros<br>
          Tratamento em conformidade com a LGPD — Lei 13.709/2018 · Art. 7º, IX
        </div>
        <button class="az-pv-btn" id="az-aceitar">Entendi e aceito continuar</button>
        <div class="az-pv-nota">
          Ao clicar você concorda com o uso descrito acima.<br>
          Seus dados de contato só são coletados se você concluir o envio.
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('az-aceitar').addEventListener('click', function () {
      localStorage.setItem(KEY, 'aceito');
      localStorage.setItem(KEY_DATE, Date.now().toString());
      liberarFormulario();
    });
  }

  if (document.body) {
    criarOverlay();
  } else {
    document.addEventListener('DOMContentLoaded', criarOverlay);
  }
})();
