import { useState } from "react";
import { Form } from "@raycast/api";

interface statusProps {
  isMarkdown: boolean;
  draftStatus: string | undefined;
}

const StatusContent = ({ isMarkdown, draftStatus }: statusProps) => {
  const [statusContent, setStatusContent] = useState<string>(draftStatus || "");

  return (
    <>
      <Form.TextArea
        id="status"
        title="Content"
        placeholder={`Write something down ${isMarkdown ? "with Markdown" : ""}`}
        enableMarkdown={isMarkdown}
        autoFocus={true}
        value={statusContent}
        onChange={setStatusContent}
      />
    </>
  );
};

export default StatusContent;
