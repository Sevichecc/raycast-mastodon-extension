import { Status, VisibilityScope } from "./types";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { Icon } from "@raycast/api";

const nhm = new NodeHtmlMarkdown();

export const dateTimeFormatter = (time: Date, type: "short" | "long") => {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "long",
  };

  return type === "short"
    ? new Intl.DateTimeFormat("default", {
        ...options,
      }).format(time)
    : new Intl.DateTimeFormat("default", {
        ...options,
        weekday: "long",
        dayPeriod: "narrow",
      }).format(time);
};

export const statusParser = (
  { content, media_attachments, account, created_at }: Status,
  type: "id" | "date"
) => {
  const images = media_attachments.filter((attachment) => attachment.type === "gifv" ||  attachment.type === "image");

  const parsedImages = images.reduce(
    (link, image) => link + `![${image.description ?? ""}](${image.preview_url || image.remote_url || image.preview_remote_url})`,
    ""
  );

  const date = new Date(created_at);
  const parsedTime = dateTimeFormatter(date, "short");

  console.log(account.acct);
  return type === "id"
    ? ` _@${account.acct}_ ` + nhm.translate("<br>" + content) + parsedImages
    : `_${parsedTime}_` + nhm.translate("<br>" + content) + parsedImages;
};

export const getIconForVisibility = (visibility: VisibilityScope) => {
  switch (visibility) {
    case "public":
      return Icon.Livestream;
    case "unlisted":
      return Icon.LivestreamDisabled;
    case "private":
      return Icon.TwoPeople;
    case "direct":
      return Icon.Envelope;
    default:
      return Icon.Livestream;
  }
};
