import { useCallback, useEffect, useState } from "react";
import { getAccessToken } from "../utils/oauth";
import { Cache, Toast, showToast } from "@raycast/api";
import { MastodonError, Status } from "../utils/types";
import apiServer from "../utils/api";
import { errorHandler } from "../utils/helpers";

const cache = new Cache();

export function useBookmark() {
  const cached = cache.get("latest_bookmarks");
  const [bookmarks, setBookmarks] = useState<Status[]>(cached ? JSON.parse(cached) : []);
  const [isLoading, setIsLoading] = useState(true);

  const getBookmarks = useCallback(async () => {
    try {
      await getAccessToken();
      showToast(Toast.Style.Animated, "Loading bookmarks..");
      const newBookmarks = await apiServer.fetchBookmarks();
      setBookmarks(newBookmarks);

      showToast(Toast.Style.Success, "Bookmarked has been loaded");
      cache.set("latest_bookmarks", JSON.stringify(newBookmarks));
    } catch (error) {
      errorHandler(error as MastodonError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getBookmarks();
  }, []);

  return {
    bookmarks,
    isLoading,
  };
}
