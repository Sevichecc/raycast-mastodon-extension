import { useEffect, useState, useRef } from "react";
import {
  Form,
  ActionPanel,
  Action,
  showToast,
  popToRoot,
  Toast,
  Cache,
  Icon,
  LocalStorage,
  getPreferenceValues,
  LaunchProps,
} from "@raycast/api";
import apiServer from "./api";
import { AkkomaError, StatusResponse, Preference, Status } from "./types";
import { authorize } from "./oauth";

import VisibilityDropdown from "./components/VisibilityDropdown";
import StatusContent from "./components/StatusContent";

const cache = new Cache();

interface CommandProps extends LaunchProps<{ draftValues: Partial<Status> }> {
  children?: React.ReactNode;
}

interface StatusForm extends Status {
  files: string[];
  description?: string;
}

export default function SimpleCommand(props: CommandProps) {
  const { instance } = getPreferenceValues<Preference>();
  const { draftValues } = props;
  const [cw, setCw] = useState<string>(draftValues?.spoiler_text || "");
  const [isMarkdown, setIsMarkdown] = useState(true);
  const [sensitive, setSensitive] = useState(false);
  const [openActionText, setOpenActionText] = useState("Open the last published status");
  const [fqn, setFqn] = useState("");

  const cached = cache.get("latest_published_status");
  const [statusInfo, setStatusInfo] = useState<StatusResponse>(cached ? JSON.parse(cached) : null);

  const cwRef = useRef<Form.TextField>(null);

  useEffect(() => {
    const init = async () => {
      authorize();
      const newFqn = await LocalStorage.getItem<string>("account-fqn");
      if (newFqn) setFqn(newFqn);
    };

    init();
  }, []);

  const handleSubmit = async ({ spoiler_text, status, scheduled_at, visibility, files, description }: StatusForm) => {
    try {
      if (!status && !files) throw new Error("You might forget the content, right ? |･ω･)");

      showToast(Toast.Style.Animated, "Publishing to the Fediverse ... ᕕ( ᐛ )ᕗ");

      const mediaIds = await Promise.all(
        files?.map(async (file) => {
          const { id } = await apiServer.uploadAttachment({ file, description });
          return id;
        })
      );

      const newStatus: Partial<Status> = {
        spoiler_text,
        status,
        scheduled_at,
        visibility,
        content_type: isMarkdown ? "text/markdown" : "text/plain",
        media_ids: mediaIds,
        sensitive,
      };

      const response = await apiServer.postNewStatus(newStatus);
      if (scheduled_at) {
        showToast(Toast.Style.Success, "Scheduled", labelText(scheduled_at));
      } else {
        cache.set("latest_published_status", JSON.stringify(response));
        setOpenActionText("View the status in Browser");
        showToast(Toast.Style.Success, "Status has been published (≧∇≦)/ ! ");
      }
      setStatusInfo(response)
      setCw("");
      setTimeout(()=> popToRoot, 2000)
    } catch (error) {
      const requestErr = error as AkkomaError;
      showToast(Toast.Style.Failure, "Error", requestErr.message);
    }
  };

  const labelText = (time: Date) => {
    return new Intl.DateTimeFormat("default", {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "long",
      weekday: "long",
      dayPeriod: "narrow",
    }).format(time);
  };

  const handleCw = (value: boolean) => {
    setSensitive(value);
    if (cwRef.current) {
      cwRef.current.focus();
    }
  };

  return (
    <Form
      enableDrafts
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} title={"Publish"} icon={Icon.Upload} />
          {statusInfo && <Action.OpenInBrowser url={statusInfo.url} title={openActionText} />}
          <Action.OpenInBrowser url={`https://${instance}/main/friends/`} title="Open Akkoma in Browser" />
        </ActionPanel>
      }
    >
      <Form.Description title="Account" text={fqn} />
      {sensitive && (
        <Form.TextField
          id="spoiler_text"
          title="CW"
          placeholder={"content warning"}
          value={cw}
          onChange={setCw}
          ref={cwRef}
        />
      )}
      <StatusContent isMarkdown={isMarkdown} draftStatus={draftValues?.status} />
      {!props.children && <VisibilityDropdown />}
      {props.children}
      <Form.Checkbox id="markdown" title="Markdown" label="" value={isMarkdown} onChange={setIsMarkdown} storeValue />
      <Form.Checkbox
        id="sensitive"
        title="Mark as Sensitive"
        label=""
        value={sensitive}
        onChange={handleCw}
        storeValue
      />
    </Form>
  );
}
