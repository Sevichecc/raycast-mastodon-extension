import { useState } from "react";
import { showToast, popToRoot, Toast, Cache } from "@raycast/api";
import apiServer from "../utils/api";
import { MastodonError, StatusResponse, StatusRequest } from "../utils/types";
import { dateTimeFormatter, errorHandler } from "../utils/helpers";
import { useForm } from "@raycast/utils";

const cache = new Cache();

export interface StatusFormValues extends StatusRequest {
  files: string[];
  description?: string;
  isMarkdown: boolean;
}

export function useSubmitStatus(draftValues: Partial<StatusRequest> | undefined) {
  const [openActionText, setOpenActionText] = useState("Open the last published status");

  const cached = cache.get("latest_published_status");
  const [latestStatus, setLatestStatus] = useState<StatusResponse>(cached ? JSON.parse(cached) : null);

  const validator = (value: StatusFormValues) => {
    if (value.status.trim().length === 0 && value.files.length === 0)
      throw new Error("You might forget the content, right ? ");
    if (value.scheduled_at) {
      const now = Date.now();
      const scheduled = new Date(value.scheduled_at);
      if (scheduled.getTime() - now < 300000) {
        throw new Error("The scheduled time must be more than 5 minutes.");
      }
    }
  };

  const { handleSubmit, itemProps, focus } = useForm<StatusFormValues>({
    onSubmit: async (value: StatusFormValues) => {
      try {
        validator(value);
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
          content_type: value.isMarkdown ? "text/markdown" : "text/plain",
        };

        const response = await apiServer.postNewStatus(newStatus);

        value.scheduled_at
          ? showToast(Toast.Style.Success, "Scheduled", dateTimeFormatter(value.scheduled_at, "long"))
          : showToast(Toast.Style.Success, "Status has been published! ");

        setLatestStatus(response);
        setOpenActionText("View the status in Browser");
        cache.set("latest_published_status", JSON.stringify(response));
        setTimeout(() => popToRoot(), 2000);
      } catch (error) {
        errorHandler(error as MastodonError);
      }
    },
    initialValues: {
      ...draftValues,
      sensitive: false,
    },
  });

  return { handleSubmit, latestStatus, openActionText, itemProps, focus };
}
