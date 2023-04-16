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

const init = async (cache: Cache, setFqn: (fqn: string) => void) => {
  try {
    await authorize(cache);
    setFqn(cache.get("account-fqn") ?? "");
  } catch (error) {
    console.error("Error during authorization or fetching account-fqn:", error);
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

export default function SimpleCommand(props: CommandProps) {
  const { instance } = getPreferenceValues<Preference>();
  const { draftValues } = props;

  const [state, setState] = useState({
    cw: draftValues?.spoiler_text || "",
    isMarkdown: true,
    sensitive: false,
    openActionText: "Open the last published status",
    fqn: "",
  });

  const cachedInfo = cache.get("latest_published_status");
  const [statusInfo, setStatusInfo] = useState<StatusResponse>(cachedInfo ? JSON.parse(cachedInfo) : null);

  const cwRef = useRef<Form.TextField>(null);

  useEffect(() => {
    init(cache, (fqn) => setState((prevState) => ({ ...prevState, fqn })));
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
        content_type: state.isMarkdown ? "text/markdown" : "text/plain",
        media_ids: mediaIds,
        sensitive: state.sensitive,
      };

      const response = await apiServer.postNewStatus(newStatus);

      if (scheduled_at) {
        showToast(Toast.Style.Success, "Scheduled", labelText(scheduled_at));
      } else {
        showToast(Toast.Style.Success, "Status has been published (≧∇≦)/ ! ");
      }

      setStatusInfo(response);
      setState((prevState) => ({
        ...prevState,
        openActionText: "View the status in Browser",
        cw: "",
      }));
      cache.set("latest_published_status", JSON.stringify(response));
      setTimeout(() => popToRoot, 2000);
    } catch (error) {
      const requestErr = error as AkkomaError;
      showToast(Toast.Style.Failure, "Error", requestErr.message);
    }
  };

  const handleCw = (value: boolean) => {
    setState((prevState) => ({
      ...prevState,
      sensitive: value,
    }));
    cwRef.current?.focus();
  };

  return (
    <Form
      enableDrafts
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} title={"Publish"} icon={Icon.Upload} />
          {statusInfo && <Action.OpenInBrowser url={statusInfo.url} title={state.openActionText} />}
          <Action.OpenInBrowser url={`https://${instance}/main/friends/`} title="Open Akkoma in Browser" />
        </ActionPanel>
      }
    >
      <Form.Description title="Account" text={state.fqn} />
      {state.sensitive && (
        <Form.TextField
          id="spoiler_text"
          title="CW"
          placeholder={"content warning"}
          value={state.cw}
          onChange={(value) => setState((prevState) => ({ ...prevState, cw: value }))}
          ref={cwRef}
        />
      )}
      <StatusContent isMarkdown={state.isMarkdown} draftStatus={draftValues?.status} />
      {!props.children && <VisibilityDropdown />}
      {props.children}
      <Form.Checkbox
        id="markdown"
        title="Markdown"
        label=""
        value={state.isMarkdown}
        onChange={(value) => setState((prevState) => ({ ...prevState, isMarkdown: value }))}
        storeValue
      />
      <Form.Checkbox id="sensitive" title="Sensitive" label="" value={state.sensitive} onChange={handleCw} storeValue />
    </Form>
  );
}
