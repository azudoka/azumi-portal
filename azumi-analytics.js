/**
 * AZUMI RH — Form Session Analytics v1.0
 * Coleta: localização por IP, dispositivo, progresso, abandono.
 * Apenas após aceite do banner. Uso interno Azumi RH.
 */
const AzumiAnalytics = (function () {
  const SURL = 'https://yxtirmonrjmlasnrqwwl.supabase.co';
  const SKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4dGlybW9ucmptbGFzbnJxd3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNzAxNjAsImV4cCI6MjA4Njk0NjE2MH0.3jEvmlcjrOGLOf1kxjy3TURE2SQ6UMbiCUlDN_HAXb0';

  let sid = null, slug = null, t0 = null;
  let secAtual = 1, secMax = 1, totalSec = 0;

  function genId() {
    return 'az_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  }

  function dispositivo() {
    const ua = navigator.userAgent, w = screen.width;
    let browser = 'outro';
    if (/Chrome/.test(ua) && !/Edg/.test(ua)) browser = 'Chrome';
    else if (/Firefox/.test(ua)) browser = 'Firefox';
    else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browser = 'Safari';
    else if (/Edg/.test(ua)) browser = 'Edge';
    let os = 'outro';
    if (/Windows/.test(ua)) os = 'Windows';
    else if (/Mac/.test(ua)) os = 'macOS';
    else if (/Android/.test(ua)) os = 'Android';
    else if (/iPhone|iPad/.test(ua)) os = 'iOS';
    else if (/Linux/.test(ua)) os = 'Linux';
    return {
      browser, os,
      device_type: w < 768 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop',
      screen_width: w,
      language: navigator.language
    };
  }

  function utm() {
    const p = new URLSearchParams(location.search);
    return {
      referrer: document.referrer || null,
      utm_source: p.get('utm_source'),
      utm_medium: p.get('utm_medium'),
      utm_campaign: p.get('utm_campaign')
    };
  }

  async function geo() {
    try {
      const r = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
      if (!r.ok) return {};
      const d = await r.json();
      return { ip_country: d.country_name, ip_region: d.region, ip_city: d.city, ip_org: d.org };
    } catch { return {}; }
  }

  async function post(body) {
    try {
      await fetch(`${SURL}/rest/v1/form_sessions`, {
        method: 'POST',
        headers: {
          'apikey': SKEY, 'Authorization': `Bearer ${SKEY}`,
          'Content-Type': 'application/json', 'Prefer': 'return=minimal'
        },
        body: JSON.stringify(body)
      });
    } catch {}
  }

  async function patch(campos) {
    if (!sid) return;
    const tempo = Math.round((Date.now() - t0) / 1000);
    const pct = totalSec > 0 ? Math.round((secMax / totalSec) * 100) : 0;
    try {
      await fetch(`${SURL}/rest/v1/form_sessions?session_id=eq.${sid}`, {
        method: 'PATCH',
        headers: {
          'apikey': SKEY, 'Authorization': `Bearer ${SKEY}`,
          'Content-Type': 'application/json', 'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          secao_atual: secAtual, secao_maxima: secMax,
          percentual_completo: pct,
          ultima_atividade: new Date().toISOString(),
          tempo_total_segundos: tempo,
          ...campos
        })
      });
    } catch {}
  }

  return {
    init: async function (formSlug, numSecoes) {
      slug = formSlug;
      totalSec = numSecoes;
      sid = genId();
      t0 = Date.now();
      const g = await geo();
      const d = dispositivo();
      const u = utm();
      await post({
        session_id: sid, form_slug: slug,
        total_secoes: totalSec, status: 'iniciou',
        ...g, ...d, ...u
      });

      window.addEventListener('beforeunload', () => {
        if (!sid) return;
        const pct = totalSec > 0 ? Math.round((secMax / totalSec) * 100) : 0;
        if (pct >= 100) return;
        const payload = JSON.stringify({
          status: 'abandonou',
          secao_atual: secAtual, secao_maxima: secMax,
          percentual_completo: pct,
          ultima_atividade: new Date().toISOString(),
          tempo_total_segundos: Math.round((Date.now() - t0) / 1000)
        });
        navigator.sendBeacon(
          `${SURL}/rest/v1/form_sessions?session_id=eq.${sid}`,
          new Blob([payload], { type: 'application/json' })
        );
      });
    },

    avancarSecao: function (n) {
      secAtual = n;
      if (n > secMax) secMax = n;
      patch({});
    },

    concluir: async function (protocolo) {
      secAtual = totalSec;
      secMax = totalSec;
      await patch({ status: 'concluiu', protocolo_gerado: protocolo, percentual_completo: 100 });
    }
  };
})();
