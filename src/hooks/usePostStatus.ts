import { useState } from "react";
import { showToast, popToRoot, Toast, Cache } from "@raycast/api";
import apiServer from "../utils/api";
import { MastodonError, StatusResponse, StatusRequest } from "../utils/types";
import { dateTimeFormatter } from "../utils/util";

const cache = new Cache();

export interface StatusFormValues extends StatusRequest {
  files: string[];
  description?: string;
  isMarkdown: boolean;
}

export function useSubmitStatus(draftValues: Partial<StatusRequest> | undefined) {
  const [openActionText, setOpenActionText] = useState("Open the last published status");

  const cached = cache.get("latest_published_status");
  const [statusInfo, setStatusInfo] = useState<StatusResponse>(cached ? JSON.parse(cached) : null);

  const [status, setStatus] = useState({
    cw: draftValues?.spoiler_text || "",
    sensitive: false,
    content: draftValues?.status || "",
  });

  const checkScheduled = (time: Date) => {
    const now = Date.now();
    const scheduled = new Date(time);
    if (scheduled.getTime() - now < 300000) {
      throw new Error("The scheduled time must be more than 5 minutes.");
    }
  };

  const handleSubmit = async (value: StatusFormValues) => {
    try {
      if (value.status.trim().length === 0 && value.files.length === 0)
        throw new Error("You might forget the content, right ? ");

      if (value.scheduled_at) {
        checkScheduled(value.scheduled_at);
      }

      showToast(Toast.Style.Animated, "Publishing to the Fediverse ...");

      const mediaIds = await Promise.all(
        value.files?.map(async (file: string) => {
          const { id } = await apiServer.uploadAttachment({ file, description: value.description });
          return id;
        }) ?? []
      );

      const newStatus: Partial<StatusRequest> = {
        ...value,
        media_ids: mediaIds,
        sensitive: status.sensitive,
        content_type: value.isMarkdown ? "text/markdown" : "text/plain",
      };

      const response = await apiServer.postNewStatus(newStatus);
      value.scheduled_at
        ? showToast(Toast.Style.Success, "Scheduled", dateTimeFormatter(value.scheduled_at, "long"))
        : showToast(Toast.Style.Success, "Status has been published! ");

      setStatusInfo(response);
      setOpenActionText("View the status in Browser");
      cache.set("latest_published_status", JSON.stringify(response));
      setTimeout(() => popToRoot(), 2000);
    } catch (error) {
      const requestErr = error as MastodonError;
      showToast(Toast.Style.Failure, "Error", requestErr.error || (error as Error).message);
    }
  };

  return { handleSubmit, status, setStatus, statusInfo, openActionText };
}