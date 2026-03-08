function getApiCandidates() {
  const host = window.location.hostname;
  const isLocalHost = host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '';

  if (isLocalHost) {
    return ['http://localhost:5000', 'https://strums-backend.onrender.com'];
  }

  return ['https://strums-backend.onrender.com', window.location.origin];
}

export async function apiJson(path, options = {}) {
  const candidates = getApiCandidates();
  let lastError = null;

  for (const base of candidates) {
    try {
      const response = await fetch(`${base}${path}`, options);
      if (!response.ok) {
        lastError = new Error(`Request failed with status ${response.status} at ${base}`);
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
