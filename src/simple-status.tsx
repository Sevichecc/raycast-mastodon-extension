import { useEffect, useState } from "react";
import { Form, ActionPanel, Action, showToast, popToRoot, LaunchProps, Toast } from "@raycast/api";
import { postNewStatus } from "./api";
import { Status, AkkomaError } from "./types";
import { authorize } from "./oauth";

import VisibilityDropdown from "./components/VisibilityDropdown";
import StatusContent from "./components/statusContent";

export default function Command(props: LaunchProps<{ draftValues: Partial<Status> }>) {
  const { draftValues } = props;
  const [cw, setCw] = useState<string>(draftValues?.spoiler_text || "");
  const [isMarkdown, setIsMarkdown] = useState<boolean>(true);

  useEffect(() => {
    authorize();
  }, []);

  const handleSubmit = async (values: Partial<Status>) => {
    try {
      if (!values.status) throw new Error("You might forget the content, right ? |･ω･)");
      showToast(Toast.Style.Animated, "Publishing to the Fediverse ... ᕕ( ᐛ )ᕗ");

      await postNewStatus({
        ...values,
        content_type: isMarkdown ? "text/markdown" : "text/plain",
      })

      showToast(Toast.Style.Success, "Status has been published (≧∇≦)/ ! ");
      popToRoot();
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
          <Action.SubmitForm onSubmit={handleSubmit} title="Publish!" />
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
