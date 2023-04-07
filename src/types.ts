export interface Preference {
  instance: string
}

export interface Credentials {
  client_id: string;
  client_secret: string;
  id: string;
  name: string;
  redirect_uri: string;
  website: string;
  vapid_key: string;
}

export interface ApiResponse {
  id: number;
  created_at: string;
  text: string;
};

export interface AppResponse {
  client_id: string;
  client_secret: string;
  id: string;
  name: string;
  redirect_uri: string;
  website: string;
  vapid_key: string;
}

export interface Status {
  content_type: string;
  expires_in: number;
  language: string;
  media_ids: string[];
  preview: boolean | string | number;
  scheduled_at: string;
  sensitive: string | boolean | number;
  spoiler_text: string;
  status: string;
  to: string[];
  visibility: "direct" | "private" | "unlisted" | "public";
}


