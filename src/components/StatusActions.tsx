import { Action, Icon, LaunchType, launchCommand } from "@raycast/api";
import { Status } from "../utils/types";
import { isVisiblityPrivate, contentExtractor } from "../utils/helpers";
interface StatusActionProps {
  status: Status;
  toggleReblog: (status: Status) => void;
  toggleFavourite: (status: Status) => void;
  toggleBookmark: (status: Status) => void;
  statusInfo: {
    reblogsCount: number;
    reblogged: boolean;
    favouritesCount: number;
    favourited: boolean;
    bookmarked: boolean;
  };
}

const StatusAction: React.FC<StatusActionProps> = ({
  status,
  toggleReblog,
  toggleFavourite,
  toggleBookmark,
  statusInfo,
}) => {
  return (
    <>
      {status.url && <Action.OpenInBrowser url={status.url} />}
      {!isVisiblityPrivate(status.visibility) && (
        <Action
          title={statusInfo.reblogged ? "Undo Reblog" : "Reblog"}
          icon={statusInfo.reblogged ? Icon.Undo : Icon.Repeat}
          onAction={() => toggleReblog(status)}
        />
      )}
      <Action
        title={statusInfo.favourited ? "Undo Favourite" : "Favourite"}
        icon={statusInfo.favourited ? Icon.StarDisabled : Icon.Star}
        onAction={() => toggleFavourite(status)}
      />
      <Action
        title={statusInfo.bookmarked ? "Remove Bookmark" : "Add Bookmark"}
        icon={statusInfo.bookmarked ? Icon.Minus : Icon.Bookmark}
        onAction={() => toggleBookmark(status)}
      />
      <Action
        title={"Reply"}
        icon={Icon.Reply}
        onAction={async () => {
          launchCommand({
            name: "post-status",
            type: LaunchType.UserInitiated,
            context: {
              action: "reply",
              status: {
                ...status,
                replyStatus: contentExtractor(status.content),
                in_reply_to_id: status.id,
              },
            },
          });
        }}
      />
    </>
  );
};

export default StatusAction;
