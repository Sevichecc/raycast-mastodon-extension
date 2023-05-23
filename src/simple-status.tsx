import { useRef } from "react";
import { useForm } from "@raycast/utils";
import { Form, ActionPanel, Action, Icon, getPreferenceValues, LaunchProps } from "@raycast/api";

import { StatusRequest } from "./utils/types";
import { StatusFormValues, useSubmitStatus } from "./hooks/usePostStatus";
import { useMe } from "./hooks/useMe";

import VisibilityDropdown from "./components/VisibilityDropdown";

const { instance, enableMarkdown }: Preferences = getPreferenceValues();
interface CommandProps extends LaunchProps<{ draftValues: Partial<StatusRequest> }> {
  children?: React.ReactNode;
}

export default function SimpleCommand(props: CommandProps) {
  const { draftValues } = props;
  const { handleSubmit, status, setStatus, statusInfo, openActionText } = useSubmitStatus(draftValues);

  const { username, fetchUsername } = useMe();
  if (username.length === 0) fetchUsername();

  const { itemProps } = useForm<StatusFormValues>({
    onSubmit: () => true,
  });

  const cwRef = useRef<Form.TextField>(null);

  const handleCw = (value: boolean) => {
    setStatus((prevState) => ({
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
          <Action.SubmitForm onSubmit={handleSubmit} title={"Toot"} icon={Icon.Upload} />
          {statusInfo && <Action.OpenInBrowser url={statusInfo.url} title={openActionText} />}
          {instance && <Action.OpenInBrowser url={`https://${instance}/home`} title="Open Mastodon in Browser" />}
        </ActionPanel>
      }
    >
      <Form.Description title="Account" text={`${username}@${instance}`} />
      {status.sensitive && (
        <Form.TextField title="CW" placeholder={"content warning"} ref={cwRef} {...itemProps.spoiler_text} />
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
      <Form.Checkbox id="sensitive" label="Sensitive" value={status.sensitive} onChange={handleCw} storeValue />
    </Form>
  );
}
