import { useEffect, useState } from "react";
import { Action, ActionPanel, List, Toast, showToast, Cache } from "@raycast/api";
import { BookmarkedStatus, AkkomaError } from "./types";
import { NodeHtmlMarkdown } from "node-html-markdown";
import apiServer from "./api";

const cache = new Cache();

export default function BookmarkCommand() {
  const cached = cache.get("latest_bookmarks");
  const [bookmarks, setBookmarks] = useState<BookmarkedStatus[]>(cached ? JSON.parse(cached) : []);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getBookmark = async () => {
      try {
        showToast(Toast.Style.Animated, "Loaing bookmarks...");
        const newBookmarks = await apiServer.fetchBookmarks();
        setBookmarks(newBookmarks);
        cache.set("latest_bookmarks", JSON.stringify(newBookmarks));
        showToast(Toast.Style.Success, "Bookmarked has been loaded");
      } catch (error) {
        const requestErr = error as AkkomaError;
        showToast(Toast.Style.Failure, "Error", requestErr.message);
      } finally {
        setIsLoading(false);
      }
    };
    getBookmark();
  }, []);

  const parseStatus = ({ content, media_attachments, account, created_at }: BookmarkedStatus) => {
    const nhm = new NodeHtmlMarkdown();

    const images = media_attachments.filter((attachment) => attachment.type === "image");
    const parsedImages = images.reduce((link, image) => link + `![${image.description}](${image.remote_url})`, "");

    const date = new Date(created_at);
    const parseTime = new Intl.DateTimeFormat("default", {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "long",
    }).format(date);

    return ` _@${account.acct} (${parseTime})_ ` + nhm.translate("<br>" + content) + parsedImages;
  };

  return (
    <List isShowingDetail isLoading={isLoading} searchBarPlaceholder="Search bookmarks">
      {bookmarks?.map((bookmark) => (
        <List.Item
          title={bookmark.pleroma.content["text/plain"]}
          key={bookmark.id}
          detail={<List.Item.Detail markdown={parseStatus(bookmark)} />}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser title="Open Original Status" url={bookmark.url} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
