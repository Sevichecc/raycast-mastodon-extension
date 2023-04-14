import { useEffect, useState } from "react";
import {
  Form,
  ActionPanel,
  Action,
  showToast,
  popToRoot,
  LaunchProps,
  Toast,
  Cache,
  Icon,
  LocalStorage,
  getPreferenceValues,
} from "@raycast/api";
import { postNewStatus } from "./api";
import { Status, AkkomaError, StatusResponse, Preference } from "./types";
import { authorize } from "./oauth";

import VisibilityDropdown from "./components/VisibilityDropdown";
import StatusContent from "./components/statusContent";

const cache = new Cache();

export default function Command(props: LaunchProps<{ draftValues: Partial<Status> }>) {
  const { instance } = getPreferenceValues<Preference>();
  const { draftValues } = props;
  const [cw, setCw] = useState<string>(draftValues?.spoiler_text || "");
  const [isMarkdown, setIsMarkdown] = useState(true);
  const [openActionText, setOpenActionText] = useState("Open the last published status");
  const [fqn, setFqn] = useState("");

  const cached = cache.get("latest_published_status");
  const [statusInfo, setStatusInfo] = useState<StatusResponse>(cached ? JSON.parse(cached) : null);

  useEffect(() => {
    const init = async () => {
      authorize();
      const newFqn = await LocalStorage.getItem<string>("account-fqn");
      if (newFqn) setFqn(newFqn);
    };

    init();
  }, []);

  const handleSubmit = async (values: Pick<Status, "content_type" | "status" | "spoiler_text" | "visibility">) => {
    try {
      if (!values.status) throw new Error("You might forget the content, right ? |･ω･)");
      showToast(Toast.Style.Animated, "Publishing to the Fediverse ... ᕕ( ᐛ )ᕗ");

      const response = await postNewStatus({
        ...values,
        content_type: isMarkdown ? "text/markdown" : "text/plain",
      });

      setStatusInfo(response);
      cache.set("latest_published_status", JSON.stringify(response));
      showToast(Toast.Style.Success, "Status has been published (≧∇≦)/ ! ");
      setOpenActionText("Open the status in Browser");
      setTimeout(() => {
        popToRoot();
      }, 1000);
    } catch (error) {
      const requestErr = error as AkkomaError;
      showToast(Toast.Style.Failure, "Error", requestErr.message);
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
      {fqn && <Form.Description title="Account" text={fqn} />}
      <Form.TextField id="spoiler_text" title="CW" placeholder={"content warning"} value={cw} onChange={setCw} />
      <StatusContent isMarkdown={isMarkdown} draftStatus={draftValues?.status} />
      <VisibilityDropdown />
      <Form.Checkbox
        id="markdown"
        title="Markdown"
        label="Yes"
        value={isMarkdown}
        onChange={setIsMarkdown}
        storeValue
      />
    </Form>
  );
}
