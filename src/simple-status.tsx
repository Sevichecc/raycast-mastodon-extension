import { useEffect } from "react";
import { Form, ActionPanel, Action, Icon, getPreferenceValues, LaunchProps } from "@raycast/api";

import { StatusRequest } from "./utils/types";
import { useSubmitStatus } from "./hooks/usePostStatus";
import { useMe } from "./hooks/useMe";

import VisibilityDropdown from "./components/VisibilityDropdown";

const { instance, enableMarkdown }: Preferences = getPreferenceValues();
interface CommandProps extends LaunchProps<{ draftValues: Partial<StatusRequest> }> {
  children?: React.ReactNode;
}

export default function SimpleCommand(props: CommandProps) {
  const { draftValues } = props;
  const { handleSubmit, latestStatus, openActionText, itemProps, focus } = useSubmitStatus(draftValues);

  const { username, fetchUsername } = useMe();
  if (username.length === 0) fetchUsername();

  useEffect(() => {
    itemProps.sensitive.value ? focus("spoiler_text") : focus("status");
  }, [itemProps.sensitive.value]);

  return (
    <Form
      enableDrafts
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} title={"Toot"} icon={Icon.Upload} />
          {latestStatus && <Action.OpenInBrowser url={latestStatus.url} title={openActionText} />}
          {instance && <Action.OpenInBrowser url={`https://${instance}/home`} title="Open Mastodon in Browser" />}
        </ActionPanel>
      }
    >
      <Form.Description title="Account" text={`${username}@${instance}`} />
      {itemProps.sensitive.value && (
        <Form.TextField title="CW" placeholder={"content warning"} {...itemProps.spoiler_text} />
      )}
      <Form.TextArea
        title="Content"
        placeholder={`Write something down ${itemProps.isMarkdown.value ? "with Markdown" : ""}`}
        enableMarkdown={itemProps.isMarkdown.value}
        autoFocus
        {...itemProps.status}
      />
      {!props.children && <VisibilityDropdown />}
      {props.children}
      {enableMarkdown && <Form.Checkbox label="Markdown" storeValue {...itemProps.isMarkdown} />}
      <Form.Checkbox label="Sensitive" {...itemProps.sensitive} storeValue />
    </Form>
  );
}
