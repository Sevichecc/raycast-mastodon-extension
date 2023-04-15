import { LocalStorage, OAuth, getPreferenceValues } from "@raycast/api";
import { Preference } from "./types";
import apiServer from "./api";

export const client = new OAuth.PKCEClient({
  redirectMethod: OAuth.RedirectMethod.Web,
  providerName: "Akkoma",
  providerIcon: "akkoma-icon.png",
  providerId: "akkoma",
  description: "Connect to your Akkoma / Pleroma acount",
});

const requestToken = async (
  clientId: string,
  clientSecret: string,
  grantType: string,
  authRequest?: OAuth.AuthorizationRequest,
  authCode?: string,
  refreshToken?: string
): Promise<OAuth.TokenResponse> => {
  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("grant_type", grantType);

  if (grantType === "authorization_code") {
    params.append("code", authCode!);
    params.append("code_verifier", authRequest!.codeVerifier);
    params.append("redirect_uri", authRequest!.redirectURI);
  } else {
    params.append("refresh_token", refreshToken!);
  }

  const tokenResponse = await apiServer.fetchToken(params, `Error while requesting ${grantType} tokens:`);

  if (grantType === "refresh_token") {
    tokenResponse.refresh_token = tokenResponse.refresh_token ?? refreshToken;
  }

  return tokenResponse;
};

export const authorize = async (): Promise<void> => {
  const { instance } = getPreferenceValues<Preference>();
  const tokenSet = await client.getTokens();

  if (tokenSet?.accessToken) {
    if (tokenSet.refreshToken && tokenSet.isExpired()) {
      LocalStorage.clear();
      const { client_id, client_secret } = await apiServer.createApp();
      await client.setTokens(
        await requestToken(client_id, client_secret, "refresh_token", undefined, undefined, tokenSet.refreshToken)
      );
    }
    return;
  }

  const { client_id, client_secret } = await apiServer.createApp();
  const authRequest = await client.authorizationRequest({
    endpoint: `https://${instance}/oauth/authorize`,
    clientId: client_id,
    scope: "read write",
  });

  const { authorizationCode } = await client.authorize(authRequest);
  await client.setTokens(
    await requestToken(client_id, client_secret, "authorization_code", authRequest, authorizationCode)
  );

  const { fqn, avatar_static } = await apiServer.fetchAccountInfo();
  await LocalStorage.setItem("account-fqn", fqn);
  await LocalStorage.setItem("account-avator", avatar_static);
};

export default { authorize };
