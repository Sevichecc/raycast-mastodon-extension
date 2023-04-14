import { useEffect,useState } from "react";
import { Form, ActionPanel, Action, showToast } from "@raycast/api";
import { postNewStatus } from "./api";
import { Status } from "./types";
import { authorize } from "./oauth";
import VisibilityDropdown from "./components/VisibilityDropdown";
import StatusContent from "./components/statusContent";

export default function Command() {
  const [isMarkdown, setIsMarkdown] = useState<boolean>(true);
  useEffect(() => {
    authorize();
  }, []);

  const handleSubmit = async (values: Partial<Status>) => {
    try {
      await postNewStatus({ ...values });
      showToast({ title: "Submitted form", message: "Status has been posted!" });
    } catch (error) {
      console.error(error);
      showToast({ title: "Error", message: "Something went wrong!" });
    }
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="textfield" title="Content Warning" placeholder="" />
      <StatusContent isMarkdown={isMarkdown} />
      <Form.Separator />
      <Form.DatePicker id="datepicker" title="Scheduled Time" />
      <VisibilityDropdown />
      <Form.FilePicker id="files" />
      <Form.Checkbox
        id="content-type"
        title="Markdown"
        label="Yes"
        value={isMarkdown}
        onChange={setIsMarkdown}
        storeValue={true}
      />
      <Form.Checkbox id="sensitive" title="Sensitive" label="Sensitive" />
    </Form>
  );
}
