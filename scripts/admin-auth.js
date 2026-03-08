import { apiJson } from './api-client.js';

const TOKEN_KEY = 'strums_admin_token';

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function isAdminLoggedIn() {
  return Boolean(getAdminToken());
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new CustomEvent('strums-admin-changed', { detail: { loggedIn: false } }));
}

export function getAuthHeaders() {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function loginAdmin(username, password) {
  const payload = await apiJson('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!payload?.token) {
    throw new Error('No token returned by server');
  }

  localStorage.setItem(TOKEN_KEY, payload.token);
  window.dispatchEvent(new CustomEvent('strums-admin-changed', { detail: { loggedIn: true } }));
}

export function mountAdminLogin(onAuthChange) {
  const host = document.createElement('div');
  host.className = 'admin-auth-host';
  host.innerHTML = `
    <button class="admin-auth-btn" id="adminAuthBtn" type="button"></button>
    <div class="admin-modal-backdrop" id="adminAuthBackdrop" hidden>
      <div class="admin-modal">
        <h3>Admin Login</h3>
        <input id="adminUser" type="text" placeholder="Username" autocomplete="username" />
        <input id="adminPass" type="password" placeholder="Password" autocomplete="current-password" />
        <div class="admin-modal-actions">
          <button id="adminLoginSubmit" type="button">Login</button>
          <button id="adminLoginCancel" type="button">Cancel</button>
        </div>
        <p class="admin-auth-msg" id="adminAuthMsg"></p>
      </div>
    </div>
  `;

  document.body.appendChild(host);

  const btn = document.getElementById('adminAuthBtn');
  const backdrop = document.getElementById('adminAuthBackdrop');
  const user = document.getElementById('adminUser');
  const pass = document.getElementById('adminPass');
  const submit = document.getElementById('adminLoginSubmit');
  const cancel = document.getElementById('adminLoginCancel');
  const msg = document.getElementById('adminAuthMsg');

  function renderButton() {
    btn.textContent = isAdminLoggedIn() ? 'Admin Logout' : 'Admin Login';
  }

  function closeModal() {
    backdrop.hidden = true;
    msg.textContent = '';
    pass.value = '';
  }

  function openModal() {
    backdrop.hidden = false;
    user.focus();
  }

  btn.addEventListener('click', () => {
    if (isAdminLoggedIn()) {
      clearAdminToken();
      renderButton();
      if (onAuthChange) onAuthChange(false);
      return;
    }
    openModal();
  });

  submit.addEventListener('click', async () => {
    msg.textContent = '';
    try {
      await loginAdmin(user.value.trim(), pass.value);
      closeModal();
      renderButton();
      if (onAuthChange) onAuthChange(true);
    } catch (err) {
      msg.textContent = err.message || 'Login failed';
    }
  });

  cancel.addEventListener('click', closeModal);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  window.addEventListener('strums-admin-changed', (e) => {
    renderButton();
    if (onAuthChange) onAuthChange(Boolean(e.detail?.loggedIn));
  });

  renderButton();
  if (onAuthChange) onAuthChange(isAdminLoggedIn());
}
