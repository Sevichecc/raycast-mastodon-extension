import { List, Icon, Image, Color } from "@raycast/api";
import { Status } from "../utils/types";
import { statusParser, getTextForVisibility, getIconForVisibility } from "../utils/util";
import { dateTimeFormatter } from "../utils/util";
import StatusAction from "./StatusAction";
interface StatusItemProps {
  status: Status;
  showMetaData?: boolean;
}

const StatusItem: React.FC<StatusItemProps> = ({ status, showMetaData }) => {
  const content = status.spoiler_text || status.content;
  const time = dateTimeFormatter(new Date(status.created_at), "short");

  return (
    <List.Item
      title={content.replace(/<.*?>/g, "")}
      icon={{
        source: status.account.avatar,
        mask: Image.Mask.Circle,
      }}
      detail={
        <List.Item.Detail
          markdown={statusParser(status, "id")}
          metadata={
            showMetaData ?
              <List.Item.Detail.Metadata>
                <List.Item.Detail.Metadata.Label
                  title="Boosts"
                  text={String(status.reblogs_count)}
                  icon={{
                    source: Icon.Repeat,
                    tintColor: status.reblogged ? Color.Purple : Color.PrimaryText,
                  }}
                />
                <List.Item.Detail.Metadata.Label
                  title="Favorites"
                  text={String(status.favourites_count)}
                  icon={{
                    source: Icon.Star,
                    tintColor: status.favourited ? Color.Yellow : Color.PrimaryText,
                  }}
                />
                <List.Item.Detail.Metadata.Label title="Replies" text={String(status.replies_count)} icon={Icon.Reply} />
                <List.Item.Detail.Metadata.Separator />
                <List.Item.Detail.Metadata.Label
                  title="Visibility"
                  text={getTextForVisibility(status.visibility)}
                  icon={getIconForVisibility(status.visibility)}
                />
                <List.Item.Detail.Metadata.Label title="Published Time" text={time} />
              </List.Item.Detail.Metadata> : null
          }
        />
      }
      actions={<StatusAction status={status} />}
    />
  );
};

export default StatusItem;
