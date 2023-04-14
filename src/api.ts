import fetch from "node-fetch";
import { OAuth, getPreferenceValues } from "@raycast/api";
import { Credentials, Preference, Status ,StatusResponse} from "./types";
import { authorize } from "./oauth";

export const fetchToken = async (params: URLSearchParams, errorMessage: string): Promise<OAuth.TokenResponse> => {
  const { instance } = getPreferenceValues<Preference>();

  const response = await fetch(`https://${instance}/oauth/token`, {
    method: "POST",
    body: params,
  });

  if (!response.ok) {
    console.error(errorMessage, await response.text());
    throw new Error(response.statusText);
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
      scopes: "read write push",
      website: "https://raycast.com",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create Akkoma app");
  }

  return (await response.json()) as Credentials;
};

export const postNewStatus = async ({
  status,
  visibility,
  spoiler_text,
  sensitive,
  scheduled_at,
}: Partial<Status>) : Promise<StatusResponse> => {
  const { instance } = getPreferenceValues<Preference>();
  const token = await authorize();

  const response = await fetch(`https://${instance}/api/v1/statuses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer" + token,
    },
    body: JSON.stringify({
      status,
      visibility,
      spoiler_text,
      sensitive,
      scheduled_at,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to pulish new status");
  }

  return (await response.json()) as StatusResponse;
};
