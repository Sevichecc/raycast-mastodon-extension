import { List, Icon } from "@raycast/api";
import { Status } from "../utils/types";
import { statusParser, getIconForVisibility } from "../utils/util";

interface StatusItemProps {
  status: Status;
}

const StatusItem: React.FC<StatusItemProps> = ({ status }) => {
  const content = status.spoiler_text || status.content;

  return (
    <List.Item
      title={content.replace(/<.*?>/g, "")}
      key={status.id}
      icon={status.account.avatar}
      detail={
        <List.Item.Detail
          markdown={statusParser(status, "idAndDate")}
          metadata={
            <List.Item.Detail.Metadata>
              <List.Item.Detail.Metadata.Label title="Reblogs" text={String(status.reblogs_count)} icon={Icon.Repeat} />
              <List.Item.Detail.Metadata.Label
                title="Favorites"
                text={String(status.favourites_count)}
                icon={Icon.Star}
              />
              <List.Item.Detail.Metadata.Label title="Replies" text={String(status.replies_count)} icon={Icon.Reply} />
              <List.Item.Detail.Metadata.Separator />
              <List.Item.Detail.Metadata.Label
                title="Visibility"
                text={status.visibility}
                icon={getIconForVisibility(status.visibility)}
              />
              {status.application?.website && [
                <List.Item.Detail.Metadata.Separator />,
                <List.Item.Detail.Metadata.Link
                  title="Application"
                  text={status.application.name}
                  target={status.application.website}
                />,
              ]}
            </List.Item.Detail.Metadata>
          }
        />
      }
    />
  );
};

export default StatusItem;
