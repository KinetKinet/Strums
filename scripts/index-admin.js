import { mountAdminLogin } from './admin-auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const onIndexPage = window.location.pathname.endsWith('/index.html')
    || window.location.pathname === '/'
    || window.location.pathname.endsWith('/Strums/');

  if (!onIndexPage) {
    return;
  }

  mountAdminLogin();
});
