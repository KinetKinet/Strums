function getApiCandidates() {
  const host = window.location.hostname;
  const isLocalHost = host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '';

  if (isLocalHost) {
    return ['http://localhost:5000', 'https://strums-backend.onrender.com'];
  }

  return ['https://strums-backend.onrender.com'];
}

export async function apiJson(path, options = {}) {
  const candidates = getApiCandidates();
  let lastError = null;

  for (const base of candidates) {
    try {
      const response = await fetch(`${base}${path}`, options);
      if (!response.ok) {
        let detail = '';
        try {
          const contentType = (response.headers.get('content-type') || '').toLowerCase();
          if (contentType.includes('application/json')) {
            const payload = await response.json();
            detail = payload?.message || JSON.stringify(payload);
          } else {
            detail = await response.text();
          }
        } catch (_err) {
          // Keep fallback detail.
        }

        const suffix = detail ? `: ${detail}` : '';
        lastError = new Error(`Request failed with status ${response.status} at ${base}${suffix}`);
        continue;
      }

      const contentType = (response.headers.get('content-type') || '').toLowerCase();
      if (!contentType.includes('application/json')) {
        lastError = new Error(`Non-JSON response returned from ${base}`);
        continue;
      }

      return await response.json();
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('API request failed');
}
