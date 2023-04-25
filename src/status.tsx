import { Form, LaunchProps } from "@raycast/api";
import { StatusRequest } from "./utils/types";
import { useState } from "react";

import VisibilityDropdown from "./components/VisibilityDropdown";
import SimpleCommand from "./simple-status";

export default function DetailCommand(props: LaunchProps<{ draftValues: Partial<StatusRequest> }>) {
  const [files, setFiles] = useState<string[]>([]);

  return (
    <SimpleCommand {...props}>
      <Form.FilePicker id="files" value={files} onChange={setFiles} title="Attechments" />
      {files.length === 1 && <Form.TextArea id="description" title="Alt text" />}
      <Form.DatePicker id="scheduled_at" title="Scheduled Time (>=5min)" />
      <VisibilityDropdown />
    </SimpleCommand>
  );
}
