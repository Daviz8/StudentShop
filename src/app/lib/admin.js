

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function getMainAdminEmail() {
  return normalizeEmail(process.env.MAIN_ADMIN_EMAIL || FALLBACK_ADMIN_EMAIL);
}

export function isMainAdminEmail(email) {
  return normalizeEmail(email) === getMainAdminEmail();
}

export function getRoleForEmail(email) {
  return isMainAdminEmail(email) ? "admin" : "user";
}