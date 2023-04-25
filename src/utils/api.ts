import fetch, { HeadersInit } from "node-fetch";
import fs from "fs";
import { FormData, File } from "node-fetch";
import { OAuth, getPreferenceValues } from "@raycast/api";
import {
  Credentials,
  Preference,
  StatusRequest,
  StatusResponse,
  Account,
  StatusAttachment,
  UploadAttachResponse,
  Status,
  MastodonError,
} from "./types";
import { client } from "./oauth";

const CONFIG = {
  tokenUrl: "/oauth/token",
  appUrl: "/api/v1/apps",
  statusesUrl: "/api/v1/statuses",
  accountsUrl: "/api/v1/accounts/",
  verifyCredentialsUrl: "/api/v1/accounts/verify_credentials",
  mediaUrl: "/api/v1/media/",
  bookmarkUrl: "/api/v1/bookmarks",
};

const requestApi = async <T>(method: "GET" | "POST" | "PUT" = "GET", endpoint: string, body?: object): Promise<T> => {
  const { instance } = getPreferenceValues<Preference>();
  const tokenSet = await client.getTokens();

  const headers: HeadersInit = { Authorization: `Bearer ${tokenSet?.accessToken}` };

  if (method === "POST" || method === "PUT") {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`https://${instance}/${endpoint}`, {
    method,
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) throw (await response.json()) as MastodonError;
  return (await response.json()) as T;
};

const fetchToken = async (params: URLSearchParams): Promise<OAuth.TokenResponse> => {
  const { instance } = getPreferenceValues<Preference>();
  const response = await fetch(`https://${instance}/${CONFIG.tokenUrl}`, {
    method: "POST",
    body: params,
  });

  if (!response.ok) throw (await response.json()) as MastodonError;
  return (await response.json()) as OAuth.TokenResponse;
};

const createApp = async (): Promise<Credentials> =>
  requestApi<Credentials>("POST", CONFIG.appUrl, {
    client_name: "Raycast-Mastodon-Extension",
    redirect_uris: "https://raycast.com/redirect?packageName=Extension",
    scopes: "read:statuses write:statuses read:bookmarks read:accounts",
    website: "https://raycast.com",
  });

const postNewStatus = async (statusOptions: Partial<StatusRequest>): Promise<StatusResponse> =>
  requestApi<StatusResponse>("POST", CONFIG.statusesUrl, statusOptions);

const fetchAccountInfo = async (): Promise<Account> => requestApi<Account>("GET", CONFIG.verifyCredentialsUrl);

const uploadAttachment = async ({ file, description }: StatusAttachment): Promise<UploadAttachResponse> => {
  const attachment = fs.readFileSync(file);
  const attachmentData = new File([attachment], file);
  await attachmentData.arrayBuffer();

  const formData = new FormData();
  formData.append("file", attachmentData);
  formData.append("description", description ?? "");

  return await requestApi<UploadAttachResponse>("POST", CONFIG.mediaUrl, {
    formData,
  });
};

const fetchBookmarks = async (): Promise<Status[]> => {
  const { bookmarkLimit } = getPreferenceValues<Preference>();
  const endpoint = bookmarkLimit ? CONFIG.bookmarkUrl + `?&limit=${bookmarkLimit}` : CONFIG.bookmarkUrl;
  return await requestApi<Status[]>("GET", endpoint);
};

const fetchUserStatus = async (): Promise<Status[]> => {
  const { id } = await fetchAccountInfo();
  const endpoint = CONFIG.accountsUrl + id + "/statuses?exclude_replies=false&exclude_reblogs=true";

  return await requestApi<Status[]>("GET", endpoint);
};

export default {
  fetchToken,
  createApp,
  postNewStatus,
  fetchAccountInfo,
  uploadAttachment,
  fetchBookmarks,
  fetchUserStatus,
};
