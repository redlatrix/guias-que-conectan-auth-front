export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function clearSessionAndRedirect(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}

export function checkTokenOrRedirect(): boolean {
  const token = localStorage.getItem('token');
  if (!token) return true;
  if (isTokenExpired(token)) {
    const isLoginRoute =
      window.location.pathname === '/login' ||
      window.location.pathname === '/register';
    if (!isLoginRoute) {
      clearSessionAndRedirect();
    }
    return false;
  }
  return true;
}
