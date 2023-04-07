export type VisibilityScope = "public" | "unlisted" | "direct" | "private" | "local"

export interface VisibilityOption {
  title: string;
  value: VisibilityScope
}

export interface Preference {
  instance: string;
  defaultVisibility: VisibilityScope;
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

interface Poll {
  expired_in: number;
  hide_totals?: boolean | string;
  multiple?: boolean | string | number;
  options: string[]
}

export interface Status {
  content_type?: string;
  expires_in?: number;
  in_reply_to_conversation_id?: string;
  in_reply_to_id?: string;
  language?: string;
  media_ids?: string[];
  poll?: Poll;
  preview?: boolean | string | number;
  scheduled_at?: string;
  sensitive?: string | boolean | number;
  spoiler_text?: string;
  status?: string;
  to?: string[];
  visibility?: VisibilityScope;
}

// interface Account {
//   acct: string;
//   avatar: string;
//   avatar_static: string;
//   bot: boolean;
//   created_at: string;
//   display_name: string;
//   emojis: Emoji[];
//   fields: Field[];
//   followers_count: number;
//   following_count: number;
//   header: string;
//   header_static: string;
//   id: string;
//   is_confirmed: boolean;
//   note: string;
//   pleroma: Pleroma;
//   source: Source;
//   statuses_count: number;
//   url: string;
//   username: string;
// }

// interface Emoji {
//   shortcode: string;
//   static_url: string;
//   url: string;
//   visible_in_picker: boolean;
// }
// interface Field {
//   name: string;
//   value: string;
//   verified_at: string | null;
// }

// interface Pleroma {
//   background_image: null;
//   hide_favorites: boolean;
//   hide_followers: boolean;
//   hide_followers_count: boolean;
//   hide_follows: boolean;
//   hide_follows_count: boolean;
//   is_admin: boolean;
//   is_confirmed: boolean;
//   is_moderator: boolean;
//   relationship: Relationship;
//   skip_thread_containment: boolean;
//   tags: any[];
// }
// type Actor = "Application" | "Group" | "Organization" | "Person" | "Service"

// interface Relationship {
//   blocked_by: boolean;
//   blocking: boolean;
//   domain_blocking: boolean;
//   endorsed: boolean;
//   followed_by: boolean;
//   following: boolean;
//   id: string;
//   muting: boolean;
//   muting_notifications: boolean;
//   note: string;
//   notifying: boolean;
//   requested: boolean;
//   showing_reblogs: boolean;
//   subscribing: boolean;
// }

// interface Source {
//   fields: Field[];
//   note: string;
//   pleroma: SourcePleroma;
//   privacy: VisibilityScope;
//   sensitive: boolean;
// }

// interface SourcePleroma {
//   actor_type: Actor;
//   discoverable: boolean;
//   no_rich_text: boolean;
//   show_role: boolean;
// }

// interface StatusResponse {
//   account: Account;
//   application: null;
//   bookmarked: boolean;
//   card: null;
//   content: string;
//   created_at: string;
//   emojis: any[];
//   favourited: boolean;
//   favourites_count: number;
//   id: string;
//   in_reply_to_account_id: null;
//   in_reply_to_id: null;
//   language: null;
//   media_attachments: any[];
//   mentions: any[];
//   muted: boolean;
//   pinned: boolean;
//   pleroma: StatusPleroma;
//   poll: null;
//   reblog: null;
//   reblogged: boolean;
//   reblogs_count: number;
//   replies_count: number;
//   sensitive: boolean;
//   spoiler_text: string;
//   tags: any[];
//   uri: string;
//   url: string;
//   visibility: string;
// }

// interface StatusPleroma {
//   content: PleromaContent;
//   context: string;
//   conversation_id: number;
//   direct_conversation_id: null;
//   emoji_reactions: any[];
//   expires_at: null;
//   in_reply_to_account_acct: null;
//   local: boolean;
//   spoiler_text: PleromaContent;
//   thread_muted: boolean;
// }

// interface PleromaContent {
//   "text/plain": string;
// }