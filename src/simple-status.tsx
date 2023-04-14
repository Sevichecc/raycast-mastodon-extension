import { useEffect, useState } from "react";
import { Form, ActionPanel, Action, showToast, popToRoot, LaunchProps, Toast, Cache ,Icon} from "@raycast/api";
import { postNewStatus } from "./api";
import { Status, AkkomaError, StatusResponse } from "./types";
import { authorize } from "./oauth";

import VisibilityDropdown from "./components/VisibilityDropdown";
import StatusContent from "./components/statusContent";

const cache = new Cache();

export default function Command(props: LaunchProps<{ draftValues: Partial<Status> }>) {
  const { draftValues } = props;
  const [cw, setCw] = useState<string>(draftValues?.spoiler_text || "");
  const [isMarkdown, setIsMarkdown] = useState<boolean>(true);

  const cached = cache.get("latest-pubished-status");

  const [statusInfo, setStatusInfo] = useState<StatusResponse>(cached ? JSON.parse(cached) : "");
  const [openActionText, setOpenActionText] = useState<string>("Open the last published status");
  
  useEffect(() => {
    authorize();
  }, []);

  const handleSubmit = async (values: Partial<Status>) => {
    try {
      if (!values.status) throw new Error("You might forget the content, right ? |･ω･)");
      showToast(Toast.Style.Animated, "Publishing to the Fediverse ... ᕕ( ᐛ )ᕗ");

      const response = await postNewStatus({
        ...values,
        content_type: isMarkdown ? "text/markdown" : "text/plain",
      });

      setStatusInfo(response);
      cache.set("latest-pubished-status", JSON.stringify({ ...response }));
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
          <Action.SubmitForm onSubmit={handleSubmit} title="Publish" icon={Icon.Upload} />
          <Action.OpenInBrowser url={statusInfo.url} title={openActionText} />
        </ActionPanel>
      }
    >
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
