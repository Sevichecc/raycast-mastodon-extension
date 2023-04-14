import { useEffect, useState } from "react";
import { Form, ActionPanel, Action, showToast, popToRoot, LaunchProps, Toast } from "@raycast/api";
import { postNewStatus } from "./api";
import { Status } from "./types";
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
      await postNewStatus({
        ...values,
        content_type: isMarkdown ? "text/markdown" : "text/plain",
      });

      setCw("");
      showToast({ title: "Success", message: "Status has been posted!" });
      popToRoot();
    } catch (error) {
      console.error(error);
      showToast({ title: "Error", message: "Something went wrong!", style: Toast.Style.Failure });
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
      <Form.TextField id="spoiler_text" title="CW" placeholder="content warning" value={cw} onChange={setCw} />
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
