import { Form, LaunchProps } from "@raycast/api";
import VisibilityDropdown from "./components/VisibilityDropdown";
import SimpleCommand from "./simple-status";
import { Status } from "./types";
import { useState } from "react";

export default function DetailCommand(props: LaunchProps<{ draftValues: Partial<Status> }>) {
  const [files, setFiles] = useState<string[]>([]);

  return (
    <SimpleCommand {...props}>
      <Form.FilePicker id="files" value={files} onChange={setFiles} />
      {files.length === 1 &&<Form.TextArea id="description" title="Alt text" />}
      <Form.DatePicker id="scheduled_at" title="Scheduled Time"/>
      <VisibilityDropdown />
    </SimpleCommand>
  );
}
