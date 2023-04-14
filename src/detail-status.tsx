import { Form, LaunchProps } from "@raycast/api";
import VisibilityDropdown from "./components/VisibilityDropdown";
import SimpleCommand from "./simple-status";
import { Status } from "./types";

interface CommandProps extends LaunchProps<{ draftValues: Status }> {
  children?: React.ReactNode;
}

export default function DetailCommand(props: CommandProps) {
  return (
    <SimpleCommand {...props}>
      <Form.DatePicker id="datepicker" title="Scheduled Time" />
      <VisibilityDropdown />
      <Form.FilePicker id="files" />
    </SimpleCommand>
  );
}
