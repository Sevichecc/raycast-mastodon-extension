import { useEffect, useState } from "react";
import { Action, ActionPanel, List, Toast, showToast, Cache } from "@raycast/api";
import { Status, AkkomaError } from "./utils/types";

import { authorize } from "./utils/oauth";
import apiServer from "./utils/api";
import { statusParser } from "./utils/util";

const cache = new Cache();

export default function ViewStatusCommand() {
  const cached = cache.get("latest_statuses");
  const [status, setStatus] = useState<Status[]>(cached ? JSON.parse(cached) : []);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getBookmark = async () => {
      try {
        await authorize();
        showToast(Toast.Style.Animated, "Loading Status...");
        const status = await apiServer.fetchUserStatus();
        setStatus(status);
        showToast(Toast.Style.Success, "Statuses has been loaded");
        cache.set("latest_statuses", JSON.stringify(status));
      } catch (error) {
        const requestErr = error as AkkomaError;
        showToast(Toast.Style.Failure, "Error", requestErr.message);
      } finally {
        setIsLoading(false);
      }
    };
    getBookmark();
  }, []);

  return (
    <List isShowingDetail isLoading={isLoading} searchBarPlaceholder="Search bookmarks">
      {status?.map((statu) => (
        <List.Item
          title={statu.akkoma.source.content}
          key={statu.id}
          detail={<List.Item.Detail markdown={statusParser(statu, "date")} />}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser title="Open Original Status" url={statu.url} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
