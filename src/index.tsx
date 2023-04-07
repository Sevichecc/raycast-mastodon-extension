import { useCallback, useEffect } from "react";
import { Form, ActionPanel, Action, showToast } from "@raycast/api";
import { authorize, client } from "./oauth";
import fetch from "node-fetch";
import { getPreferenceValues } from "@raycast/api";
import { Preference,ApiResponse } from "./types";

type Values = {
  textfield: string;
  textarea: string;
  datepicker: Date;
  sensitive: boolean;
  dropdown: string;
  files: { name: string; url: string }[];
};

export default function Command() {
  const { instance } = getPreferenceValues<Preference>();

  useEffect(() => {
    authorize();
  }, []);

  const handleSubmit = useCallback(
    async (values: Values) => {
      try {
        const token = await client.getTokens();

        const response = await fetch(`https://${instance}/api/v1/statuses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token?.accessToken}`,
          },
          body: JSON.stringify({
            status: values.textarea,
            visibility: values.dropdown,
            spoiler_text: values.textfield,
            sensitive: values.sensitive,
            scheduled_at: values.datepicker.toISOString(),
          }),
        });
        const data = (await response.json()) as ApiResponse;
        console.log(data);
        showToast({ title: "Submitted form", message: "Status has been posted!" });
      } catch (error) {
        console.error(error);
        showToast({ title: "Error", message: "Something went wrong!" });
      }
    },
    [instance]
  );

  return (
    <>
      <Form
        actions={
          <ActionPanel>
            <Action.SubmitForm onSubmit={handleSubmit} />
          </ActionPanel>
        }
      >
        <Form.TextField id="textfield" title="Content Warning" placeholder="" />
        <Form.TextArea id="textarea" title="Post detail" placeholder="" enableMarkdown={true} />
        <Form.Separator />
        <Form.DatePicker id="datepicker" title="Scheduled Time" />
        <Form.Dropdown id="dropdown" title="Visibility" storeValue={true} defaultValue="">
          <Form.Dropdown.Item value="direct" title="Direct" />
          <Form.Dropdown.Item value="private" title="Private" />
          <Form.Dropdown.Item value="unlisted" title="Unlisted" />
          <Form.Dropdown.Item value="public" title="Public" />
        </Form.Dropdown>
        <Form.FilePicker id="files" />
        <Form.Checkbox id="sensitive" title="Sensitive" label="Sensitive" />
      </Form>
    </>
  );
}
