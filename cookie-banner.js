/**
 * AZUMI RH — Banner de Privacidade v2.0
 * Barra discreta no rodapé. Não bloqueia o formulário.
 * Ao aceitar, inicia AzumiAnalytics. Se ignorar, não coleta nada.
 * Decisão salva por 180 dias no localStorage.
 * Base legal: legítimo interesse (LGPD art. 7º, IX).
 */
(function () {
  const KEY = 'az_consent';
  const KEY_DATE = 'az_consent_date';

  const saved = localStorage.getItem(KEY);
  const savedDate = parseInt(localStorage.getItem(KEY_DATE) || '0');
  const diasPassados = (Date.now() - savedDate) / (1000 * 60 * 60 * 24);

  function iniciarAnalytics() {
    const slug = document.body.getAttribute('data-form-slug');
    const secs = parseInt(document.body.getAttribute('data-form-secs') || '0');
    if (slug && typeof AzumiAnalytics !== 'undefined') {
      AzumiAnalytics.init(slug, secs);
    }
  }

  if (saved === 'aceito' && diasPassados < 180) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', iniciarAnalytics);
    } else {
      iniciarAnalytics();
    }
    return;
  }

  const style = document.createElement('style');
  style.textContent = `
    #az-cookie-bar {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      z-index: 9999;
      background: rgba(3, 18, 38, 0.96);
      border-top: 1px solid rgba(59, 130, 246, 0.18);
      backdrop-filter: blur(12px);
      padding: 14px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
      transition: opacity .35s ease, transform .35s ease;
    }
    #az-cookie-bar.az-hide {
      opacity: 0;
      transform: translateY(100%);
      pointer-events: none;
    }
    #az-cookie-bar .az-cb-text {
      font-family: 'Space Grotesk', Verdana, sans-serif;
      font-size: 12px;
      color: rgba(147, 197, 253, 0.75);
      line-height: 1.5;
      flex: 1;
      min-width: 200px;
    }
    #az-cookie-bar .az-cb-text a {
      color: #93C5FD;
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    #az-cookie-bar .az-cb-text a:hover {
      color: #fff;
    }
    #az-cookie-bar .az-cb-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }
    #az-cookie-bar .az-cb-btn {
      background: linear-gradient(135deg, #034C8B, #3B82F6);
      color: #fff;
      border: none;
      border-radius: 100px;
      padding: 8px 22px;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity .18s ease;
      white-space: nowrap;
    }
    #az-cookie-bar .az-cb-btn:hover { opacity: .88; }
    #az-cookie-bar .az-cb-fechar {
      background: none;
      border: none;
      color: rgba(147, 197, 253, 0.4);
      font-size: 18px;
      cursor: pointer;
      padding: 0 4px;
      line-height: 1;
      transition: color .18s;
    }
    #az-cookie-bar .az-cb-fechar:hover { color: rgba(147, 197, 253, 0.8); }
    @media (max-width: 480px) {
      #az-cookie-bar { padding: 12px 16px; }
      #az-cookie-bar .az-cb-text { font-size: 11px; }
    }
  `;
  document.head.appendChild(style);

  function fecharBarra(aceito) {
    const bar = document.getElementById('az-cookie-bar');
    if (!bar) return;
    bar.classList.add('az-hide');
    setTimeout(() => bar.remove(), 380);
    if (aceito) {
      localStorage.setItem(KEY, 'aceito');
      localStorage.setItem(KEY_DATE, Date.now().toString());
      iniciarAnalytics();
    }
  }

  function criarBarra() {
    const bar = document.createElement('div');
    bar.id = 'az-cookie-bar';
    bar.innerHTML = `
      <div class="az-cb-text">
        Usamos dados básicos de sessão para garantir a segurança deste formulário.
        Ao continuar, você concorda.
        <a href="/politica-de-privacidade" target="_blank" rel="noopener">Política de Privacidade</a>
      </div>
      <div class="az-cb-actions">
        <button class="az-cb-btn" id="az-cb-aceitar">Aceitar</button>
        <button class="az-cb-fechar" id="az-cb-fechar" title="Fechar">&#x2715;</button>
      </div>
    `;
    document.body.appendChild(bar);

    document.getElementById('az-cb-aceitar').addEventListener('click', () => fecharBarra(true));
    document.getElementById('az-cb-fechar').addEventListener('click', () => fecharBarra(false));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', criarBarra);
  } else {
    criarBarra();
  }
})();
