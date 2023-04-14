import { useState } from "react";
import { Form } from "@raycast/api";

interface StatusContentProps {
  isMarkdown: boolean;
}

const StatusContent = ({ isMarkdown }: StatusContentProps) => {
  const [statusContent, setStatusContent] = useState<string>("");
  const [error, setError] = useState<string>("");

  return (
    <>
      <Form.TextArea
        id="status"
        title="Content"
        placeholder="Write something down"
        enableMarkdown={isMarkdown}
        autoFocus={true}
        value={statusContent}
        error={error}
        onChange={setStatusContent}
        onBlur={() => {
          setError(!statusContent ? "content should't be empty!" : "");
        }}
      />
    </>
  );
};

export default StatusContent;
