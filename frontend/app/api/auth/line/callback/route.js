import { NextResponse } from "next/server";
import { LINE_AUTH_COOKIES, createSessionToken, getCallbackUrl } from "../../../../_lib/line-auth";

function redirectWithStatus(request, status) {
  return NextResponse.redirect(new URL(`/?login=${status}`, request.url));
}

function clearTransientCookies(response) {
  response.cookies.delete(LINE_AUTH_COOKIES.state);
  response.cookies.delete(LINE_AUTH_COOKIES.nonce);
  response.cookies.delete(LINE_AUTH_COOKIES.pkce);
}

export async function GET(request) {
  const query = request.nextUrl.searchParams;
  const savedState = request.cookies.get(LINE_AUTH_COOKIES.state)?.value;
  const nonce = request.cookies.get(LINE_AUTH_COOKIES.nonce)?.value;
  const verifier = request.cookies.get(LINE_AUTH_COOKIES.pkce)?.value;

  if (query.get("error")) {
    const response = redirectWithStatus(request, "cancelled");
    clearTransientCookies(response);
    return response;
  }
  if (!savedState || query.get("state") !== savedState || !nonce || !verifier) {
    const response = redirectWithStatus(request, "invalid");
    clearTransientCookies(response);
    return response;
  }

  const code = query.get("code");
  const channelId = process.env.LINE_CHANNEL_ID;
  const channelSecret = process.env.LINE_CHANNEL_SECRET;
  if (!code || !channelId || !channelSecret) return redirectWithStatus(request, "config");

  try {
    const tokenResponse = await fetch("https://api.line.me/oauth2/v2.1/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "authorization_code", code,
        redirect_uri: getCallbackUrl(request), client_id: channelId,
        client_secret: channelSecret, code_verifier: verifier }),
      cache: "no-store",
    });
    if (!tokenResponse.ok) throw new Error("LINE token exchange failed");
    const tokens = await tokenResponse.json();
    if (!tokens.id_token) throw new Error("LINE did not return an ID token");

    const verificationResponse = await fetch("https://api.line.me/oauth2/v2.1/verify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ id_token: tokens.id_token, client_id: channelId, nonce }),
      cache: "no-store",
    });
    if (!verificationResponse.ok) throw new Error("LINE ID token is invalid");
    const profile = await verificationResponse.json();
    const sessionToken = createSessionToken({ id: profile.sub, name: profile.name || "ผู้ใช้ LINE", picture: profile.picture || null, provider: "line" });

    const response = redirectWithStatus(request, "success");
    clearTransientCookies(response);
    response.cookies.set(LINE_AUTH_COOKIES.session, sessionToken, {
      httpOnly: true, maxAge: 7 * 24 * 60 * 60, path: "/", sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  } catch (error) {
    console.error("LINE Login callback failed:", error);
    const response = redirectWithStatus(request, "failed");
    clearTransientCookies(response);
    return response;
  }
}
