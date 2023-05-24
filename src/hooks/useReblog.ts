import { showToast, Toast } from "@raycast/api";
import { useState } from "react";
import { errorHandler } from "../utils/helpers";
import { Status, MastodonError } from "../utils/types";
import apiServer from "../utils/api";

export function useReblog(status: Status) {
  const [reblogInfo, setReblogInfo] = useState({
    count: status.reblogs_count,
    reblogged: status.reblogged
  })

   const toggleReblog = async (status: Status) => {
    try {
      if (status.reblogged && reblogInfo.reblogged) {
        showToast(Toast.Style.Animated, "Undoing rebloged status");
        apiServer.undoReblogStatus(status.id)
        showToast(Toast.Style.Success, "Undo reblog!");
        setReblogInfo({
          count: status.reblogs_count + 1,
          reblogged: false
        })
      } else {
        showToast(Toast.Style.Animated, "Rebloging status");
        apiServer.reblogStatus(status.id),
        showToast(Toast.Style.Success, "Reblogged!");
        setReblogInfo({
          count: status.reblogs_count - 1,
          reblogged: true
        })
      }
    } catch (error) {
      errorHandler(error as MastodonError);
    }
    };
  
  return {
    toggleReblog,
    reblogInfo
  }
}