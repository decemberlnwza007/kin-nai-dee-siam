import { NextResponse } from "next/server";
import { LINE_AUTH_COOKIES, createCodeChallenge, getCallbackUrl, randomToken, transientCookieOptions } from "../../../../_lib/line-auth";

export async function GET(request) {
  const channelId = process.env.LINE_CHANNEL_ID;
  if (!channelId) return NextResponse.redirect(new URL("/?login=config", request.url));

  const state = randomToken();
  const nonce = randomToken();
  const verifier = randomToken(48);
  const authorizeUrl = new URL("https://access.line.me/oauth2/v2.1/authorize");
  authorizeUrl.search = new URLSearchParams({
    response_type: "code", client_id: channelId, redirect_uri: getCallbackUrl(request),
    state, scope: "openid profile", nonce, bot_prompt: "aggressive",
    code_challenge: createCodeChallenge(verifier), code_challenge_method: "S256",
  }).toString();

  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set(LINE_AUTH_COOKIES.state, state, transientCookieOptions);
  response.cookies.set(LINE_AUTH_COOKIES.nonce, nonce, transientCookieOptions);
  response.cookies.set(LINE_AUTH_COOKIES.pkce, verifier, transientCookieOptions);
  return response;
}
