//  Reference: https://github.com/raycast/extensions/pull/5001#issuecomment-1461738396

import { List } from "@raycast/api";
// import { usePromise } from "@raycast/utils";
import { useHomeTL } from "./hooks/masto";
import StatusItem from "./components/StatusItem";

export default function Home() {
  const { statuses } = useHomeTL();
  // const { data, isLoadinges.listHome();
  //   },
  //   [masto]
  // );

  // console.log(!masto || isLoading, !masto, isLoading);

  return (
    <List isShowingDetail>
      {statuses?.map((statuses) => (
        <StatusItem key={statuses.id} status={statuses.reblog ? statuses.reblog : statuses} />
      ))}
    </List>
  );
}
