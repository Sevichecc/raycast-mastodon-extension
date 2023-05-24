import { ActionPanel, Action, Icon, Color } from "@raycast/api";
import { Status } from "../utils/types";
import { isVisiblityPrivate } from "../utils/helpers";

interface StatusActionProps {
  status: Status;
  toggleReblog: (status: Status) => void,
  reblogInfo: {
    count: number,
    reblogged: boolean
  }
}

const StatusAction: React.FC<StatusActionProps> = ({ status, toggleReblog, reblogInfo }) => {

  return (
    <ActionPanel>
      {status.url && <Action.OpenInBrowser url={status.url} />}
      {!isVisiblityPrivate(status.visibility) && (
        <Action
          title={reblogInfo.reblogged ? "Undo Reblog" : "Reblog"}
          icon={reblogInfo.reblogged ? Icon.Undo : Icon.Repeat}
          onAction={() => {
            toggleReblog(status)
          }}
        />
      )}
    </ActionPanel>
  );
};
export default StatusAction;
