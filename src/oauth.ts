import { OAuth, getPreferenceValues } from "@raycast/api";
import fetch from "node-fetch";
import { Preference, AppResponse } from "./types";

const redirectUri = "https://raycast.com/redirect?packageName=Extension";

export const client = new OAuth.PKCEClient({
  redirectMethod: OAuth.RedirectMethod.Web,
  providerName: "Akkoma",
  providerIcon: "akkoma-icon.png",
  providerId: "akkoma",
  description: "Connect to your Akkoma | Pleroma | Mastodon account",
});

const createAkkomaApp = async (): Promise<AppResponse> => {
  const { instance } = getPreferenceValues<Preference>();

  const response = await fetch(`https://${instance}/api/v1/apps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_name: "raycast-akkoma-extension",
      redirect_uris: redirectUri,
      scopes: "read write push",
      website: "https://raycast.com",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create Akkoma app");
  }

  const appResponse = await response.json();
  return appResponse as AppResponse;
};

export const requestAccessToken = async (
  clientId: string,
  clientSecret: string,
  authRequest: OAuth.AuthorizationRequest,
  authCode: string
): Promise<OAuth.TokenResponse> => {
  const { instance } = getPreferenceValues<Preference>();

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("code", authCode);
  params.append("code_verifier", authRequest.codeVerifier);
  params.append("grant_type", "authorization_code");
  params.append("redirect_uri", authRequest.redirectURI);

  const response = await fetch(`https://${instance}/oauth/token`, {
    method: "POST",
    body: params,
  });
  if (!response.ok) {
    console.error("fetch tokens error:", await response.text());
    throw new Error(response.statusText);
  }
  return (await response.json()) as OAuth.TokenResponse;
};

export const refreshToken = async (
  clientId: string,
  clientSecret: string,
  refreshToken: string
): Promise<OAuth.TokenResponse> => {
  const { instance } = getPreferenceValues<Preference>();

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("refresh_token", refreshToken);
  params.append("grant_type", "refresh_token");

  const response = await fetch(`https://${instance}/oauth/token`, {
    method: "POST",
    body: params,
  });
  if (!response.ok) {
    console.error("refresh tokens error:", await response.text());
    throw new Error(response.statusText);
  }

  const tokenResponse = (await response.json()) as OAuth.TokenResponse;
  tokenResponse.refresh_token = tokenResponse.refresh_token ?? refreshToken;
  return tokenResponse;
};

// 授权过程
export const authorize = async (): Promise<void> => {
  const { instance } = getPreferenceValues<Preference>();
  const tokenSet = await client.getTokens();

  if (tokenSet?.accessToken) {
    if (tokenSet.refreshToken && tokenSet.isExpired()) {
      const { client_id, client_secret } = await createAkkomaApp();
      await client.setTokens(await refreshToken(client_id, client_secret, tokenSet.refreshToken));
    }
    return;
  }

  const { client_id, client_secret } = await createAkkomaApp();

  const authRequest = await client.authorizationRequest({
    endpoint: `https://${instance}/oauth/authorize`,
    clientId: client_id,
    scope: "read write push",
  });
  const { authorizationCode } = await client.authorize(authRequest);

  await client.setTokens(await requestAccessToken(client_id, client_secret, authRequest, authorizationCode));
};
