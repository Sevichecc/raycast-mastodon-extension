import { Icon, LaunchType, launchCommand } from "@raycast/api";
import { Action } from "@raycast/api";
import { Status } from "../utils/types";
import { contentExtractor } from "../utils/helpers";
import { useInteract } from "../hooks/useInteract";

interface MyStatusActions {
  status: Status;
}

const MyStatusActions: React.FC<MyStatusActions> = ({ status }) => {
  const { deleteStatus } = useInteract(status);

  return (
    <>
      <Action title="Delete" icon={Icon.Trash} onAction={() => deleteStatus(status)} />
      <Action
        title="Edit"
        icon={Icon.Pencil}
        onAction={async () => {
          launchCommand({
            name: "post-status",
            type: LaunchType.UserInitiated,
            context: {
              action: "edit",
              status: {
                ...status,
                status: contentExtractor(status?.content),
                visiblity: status.visibility,
              },
            },
          });
        }}
      />
    </>
  );
};
export default MyStatusActions;
