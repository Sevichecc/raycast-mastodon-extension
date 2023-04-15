import fetch from "node-fetch";
import fs from "fs";
import { FormData, File } from "node-fetch";
import { OAuth, getPreferenceValues } from "@raycast/api";
import {
  Credentials,
  Preference,
  Status,
  StatusResponse,
  Account,
  StatusAttachment,
  UploadAttachResponse,
} from "./types";
import { client } from "./oauth";
import { RequestInit, Response } from "node-fetch";

const { instance } = getPreferenceValues<Preference>();

const CONFIG = {
  tokenUrl: "/oauth/token",
  appUrl: "/api/v1/apps",
  statusesUrl: "/api/v1/statuses",
  verifyCredentialsUrl: "/api/v1/accounts/verify_credentials",
  mediaUrl: "/api/v1/media/",
};

const apiUrl = (instance: string, path: string): string => `https://${instance}${path}`;

const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const tokenSet = await client.getTokens();
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${tokenSet?.accessToken}`,
  };
  return fetch(url, { ...options, headers });
};

const fetchToken = async (params: URLSearchParams, errorMessage: string): Promise<OAuth.TokenResponse> => {
  const response = await fetch(apiUrl(instance, CONFIG.tokenUrl), {
    method: "POST",
    body: params,
  });

  if (!response.ok) throw new Error(errorMessage);
  return (await response.json()) as OAuth.TokenResponse;
};

const createApp = async (): Promise<Credentials> => {
  const response = await fetch(apiUrl(instance, CONFIG.appUrl), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

const postNewStatus = async (statusOptions: Partial<Status>): Promise<StatusResponse> => {
  const response = await fetchWithAuth(apiUrl(instance, CONFIG.statusesUrl), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(statusOptions),
  });

  if (!response.ok) throw new Error("Failed to publish :(");

  return (await response.json()) as StatusResponse;
};

const fetchAccountInfo = async (): Promise<Account> => {
  const response = await fetchWithAuth(apiUrl(instance, CONFIG.verifyCredentialsUrl), {
    method: "GET",
  });

  if (!response.ok) throw new Error("Failed to fetch account's info :(");
  return (await response.json()) as Account;
};

const uploadAttachment = async ({ file, description }: StatusAttachment): Promise<UploadAttachResponse> => {
  const attachment = fs.readFileSync(file);
  const attachmentData = new File([attachment], file);
  await attachmentData.arrayBuffer();

  const formData = new FormData();
  formData.append("file", attachmentData);
  formData.append("description", description ?? "");

  const response = await fetchWithAuth(apiUrl(instance, CONFIG.mediaUrl), {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Could not upload attachments");
  return (await response.json()) as UploadAttachResponse;
};

export default { fetchToken, createApp, postNewStatus, fetchAccountInfo, uploadAttachment };
