const ADMIN_AUTH_KEY = 'admin_authenticated'
const ADMIN_PASSWORD_KEY = 'admin_password'

export function isAdminAuthenticated() {
  return window.localStorage.getItem(ADMIN_AUTH_KEY) === 'true'
}

export function getAdminPassword() {
  return window.sessionStorage.getItem(ADMIN_PASSWORD_KEY) || ''
}

export function setAdminSession(password) {
  window.localStorage.setItem(ADMIN_AUTH_KEY, 'true')
  window.sessionStorage.setItem(ADMIN_PASSWORD_KEY, password)
}

export function clearAdminSession() {
  window.localStorage.removeItem(ADMIN_AUTH_KEY)
  window.sessionStorage.removeItem(ADMIN_PASSWORD_KEY)
}
