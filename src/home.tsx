//  Reference: https://github.com/raycast/extensions/pull/5001#issuecomment-1461738396

import { List } from "@raycast/api";
import { useHomeTL } from "./hooks/useHomeTL";
import StatusItem from "./components/StatusItem";

export default function Home() {
  const { statuses, isLoading } = useHomeTL();

  return (
    <List isShowingDetail isLoading={isLoading}>
      {statuses?.map((statuses) => (
        <StatusItem key={statuses.id} status={statuses.reblog ? statuses.reblog : statuses} showMetaData />
      ))}
    </List>
  );
}
