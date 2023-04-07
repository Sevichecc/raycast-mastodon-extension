import { useEffect } from "react";
import { Form, ActionPanel, Action, showToast } from "@raycast/api";
import { authorize } from "./oauth";
import { postNewStatus } from "./api";
import { Status, VisibilityOption } from "./types";

export default function Command() {
  useEffect(() => {
    authorize();
  }, []);

   const visibilityOptions: VisibilityOption[] = [
     { value: "direct", title: "Direct" },
     { value: "private", title: "Private" },
     { value: "unlisted", title: "Unlisted" },
     { value: "public", title: "Public" },
     { value: "local", title: "Local" },
   ];
  
  const handleSubmit = async (values: Status) => {
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
      <Form.TextArea id="staus" title="Post detail" placeholder="" enableMarkdown={true} />
      <Form.Separator />
      <Form.DatePicker id="datepicker" title="Scheduled Time" />
      <Form.Dropdown id="visibility" title="Visibility" storeValue={true} defaultValue="">
        {visibilityOptions.map(({value, title}) => (
          <Form.Dropdown.Item key={value} value={value} title={title} />
        ))}
      </Form.Dropdown>
      <Form.FilePicker id="files" />
      <Form.Checkbox id="sensitive" title="Sensitive" label="Sensitive" />
    </Form>
  );
}
