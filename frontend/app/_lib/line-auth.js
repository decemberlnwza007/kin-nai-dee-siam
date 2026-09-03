import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const LINE_AUTH_COOKIES = {
  nonce: "kin_line_nonce",
  pkce: "kin_line_pkce",
  session: "kin_line_session",
  state: "kin_line_state",
};

export const transientCookieOptions = {
  httpOnly: true,
  maxAge: 10 * 60,
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

export function randomToken(size = 32) {
  return randomBytes(size).toString("base64url");
}

export function createCodeChallenge(verifier) {
  return createHash("sha256").update(verifier).digest("base64url");
}

function getSessionSecret() {
  const secret = process.env.LINE_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("LINE_SESSION_SECRET must contain at least 32 characters");
  }
  return secret;
}

function sign(value) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

export function createSessionToken(user) {
  const payload = Buffer.from(
    JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, user }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function readSessionToken(token) {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString());
    return session.exp > Math.floor(Date.now() / 1000) ? session.user : null;
  } catch {
    return null;
  }
}

export function getCallbackUrl(request) {
  return process.env.LINE_CALLBACK_URL ?? new URL("/api/auth/line/callback", request.url).toString();
}
