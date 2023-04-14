import { useState } from "react";
import { Form } from "@raycast/api";

interface statusProps {
  isMarkdown: boolean;
  draftStatus: string | undefined;
}

const StatusContent = ({ isMarkdown, draftStatus }: statusProps) => {
  const [error, setError] = useState<boolean>(false);
  const [statusContent, setStatusContent] = useState<string>(draftStatus || "");
  
  return (
    <>
      <Form.TextArea
        id="status"
        title="Content"
        placeholder="Write something down"
        enableMarkdown={isMarkdown}
        autoFocus={true}
        value={statusContent}
        error={error ? "Content should not be empty!" : ""}
        onChange={setStatusContent}
        onBlur={() => {
          setError(!statusContent.trim());
        }}
      />
    </>
  );
};

export default StatusContent;
