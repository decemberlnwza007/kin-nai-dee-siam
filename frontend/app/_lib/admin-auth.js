import { LINE_AUTH_COOKIES, readSessionToken } from "./line-auth";

function getAdminIds() {
  return new Set(
    (process.env.ADMIN_LINE_USER_IDS ?? "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean),
  );
}

export function getAdminUserFromRequest(request) {
  try {
    const token = request.cookies.get(LINE_AUTH_COOKIES.session)?.value;
    const user = readSessionToken(token);
    return user && getAdminIds().has(user.id) ? user : null;
  } catch {
    return null;
  }
}

export function isAdminUser(user) {
  return Boolean(user && getAdminIds().has(user.id));
}
