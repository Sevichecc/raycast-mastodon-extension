import { useEffect, useState } from "react";
import { Form, ActionPanel, Action, showToast, popToRoot, LaunchProps,Toast } from "@raycast/api";
import { postNewStatus } from "./api";
import { Status } from "./types";
import { authorize } from "./oauth";
import VisibilityDropdown from "./components/VisibilityDropdown";

export default function Command(props: LaunchProps<{ draftValues: Partial<Status> }>) {
  const { draftValues } = props;
  const [statusContent, setStatusContent] = useState<string>(draftValues?.status || "");
  const [cw, setCw] = useState<string>(draftValues?.spoiler_text || "");
  const [isMarkdown, setIsMarkdown] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    authorize();
  }, []);

  const handleSubmit = async () => {
    try {
      const newStatus: Partial<Status> = {
        spoiler_text: cw,
        status: statusContent,
        content_type: isMarkdown ? "text/markdown" : "text/plain",
        visibility: "direct",
      };

      console.log(newStatus);
      await postNewStatus(newStatus);
      setCw('')
      setStatusContent('')
      showToast({ title: "Submitted form", message: "Status has been posted!" });
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
      <Form.TextArea
        id="status"
        title="Content"
        placeholder="Write something down"
        enableMarkdown={isMarkdown}
        autoFocus={true}
        value={statusContent}
        error={error ? "Content should not be empty!" : ""}
        onChange={setStatusContent}
        onBlur={() => {
          setError(!statusContent);
        }}
      />
      {/* <VisibilityDropdown/> */}
      <Form.Checkbox
        id="content-type"
        title="Markdown"
        label="Yes"
        value={isMarkdown}
        onChange={setIsMarkdown}
        storeValue
      />
    </Form>
  );
}
