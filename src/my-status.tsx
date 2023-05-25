import { useEffect } from "react";
import { Action, ActionPanel, List } from "@raycast/api";
import { Status } from "./utils/types";

import { contentExtractor, statusParser } from "./utils/helpers";
import MyStatusActions from "./components/MyStatusActions";

import { useMe } from "./hooks/useMe";

export default function ViewStatusCommand() {
  const { isLoading, statuses, fetchMyStatuses } = useMe()

  useEffect(() => {
    fetchMyStatuses()
  }, []);

  const filterReblog = (statuses: Status[]) => statuses.filter((status) => !status.reblog);

  return (
    <List isShowingDetail isLoading={isLoading} searchBarPlaceholder="Search your status">
      {filterReblog(statuses)?.map((status) => (
        <List.Item
          title={contentExtractor(status.content)}
          key={status.id}
          detail={<List.Item.Detail markdown={statusParser(status, "date")} />}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser title="Open Original Status" url={status.url} />
              <MyStatusActions status={status} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
