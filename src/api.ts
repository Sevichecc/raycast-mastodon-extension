import fetch from "node-fetch";
import { OAuth, getPreferenceValues } from "@raycast/api";
import { Credentials, Preference, Status, StatusResponse } from "./types";
import { client } from "./oauth";

export const fetchToken = async (params: URLSearchParams, errorMessage: string): Promise<OAuth.TokenResponse> => {
  const { instance } = getPreferenceValues<Preference>();

  const response = await fetch(`https://${instance}/oauth/token`, {
    method: "POST",
    body: params,
  });

  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return (await response.json()) as OAuth.TokenResponse;
};

export const createApp = async (): Promise<Credentials> => {
  const { instance } = getPreferenceValues<Preference>();

  const response = await fetch(`https://${instance}/api/v1/apps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_name: "raycast-akkoma-extension",
      redirect_uris: "https://raycast.com/redirect?packageName=Extension",
      scopes: "read write",
      website: "https://raycast.com",
    }),
  });

  if (!response.ok) throw new Error("Failed to create Akkoma app");

  return (await response.json()) as Credentials;
};

export const postNewStatus = async ({
  status,
  visibility,
  spoiler_text,
  sensitive,
  scheduled_at,
  content_type,
}: Partial<Status>): Promise<StatusResponse> => {
  const { instance } = getPreferenceValues<Preference>();
  const tokenSet = await client.getTokens();

  const response = await fetch(`https://${instance}/api/v1/statuses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + tokenSet?.accessToken,
    },
    body: JSON.stringify({
      status,
      visibility,
      spoiler_text,
      sensitive,
      content_type,
      scheduled_at,
    }),
  });

  if (!response.ok) { 
    throw new Error("Failed to pulish :(");
  }
    

  return (await response.json()) as StatusResponse;
};
