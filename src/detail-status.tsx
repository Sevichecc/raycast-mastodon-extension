import { Form, LaunchProps } from "@raycast/api";
import VisibilityDropdown from "./components/VisibilityDropdown";
import SimpleCommand from "./simple-status";
import { Status } from "./types";
import { useState } from "react";

interface CommandProps extends LaunchProps<{ draftValues: Status }> {
  children?: React.ReactNode;
}

export default function DetailCommand(props: CommandProps) {
  const [files, setFiles] = useState<string[]>([]);

  return (
    <SimpleCommand {...props}>
      <Form.FilePicker id="files" value={files} onChange={setFiles}/>
      {files.length !== 0 && <Form.TextArea id="description" title="Alt text" />}
      <Form.DatePicker id="datepicker" title="Scheduled Time" />
      <VisibilityDropdown />
    </SimpleCommand>
  );
}
