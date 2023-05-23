import { showToast, Toast, Cache } from "@raycast/api";
import { useEffect, useState, useCallback } from "react";
import { getAccessToken } from "../utils/oauth";
import { MastodonError, Status } from "../utils/types";
import apiServer from "../utils/api";

const cache = new Cache();

export function useHomeTL() {
  const cached = cache.get("latest_home_statuses");
  const [statuses, setStatuses] = useState<Status[]>(cached ? JSON.parse(cached) : []);
  const [isLoading, setIsLoading] = useState(true)
  
  const fetchHomeTL = useCallback(async () => {
    try {
      await getAccessToken();
      showToast(Toast.Style.Animated, "Loading home timeline...");
      const tlStatuses = await apiServer.fetchHomeTL();
      setStatuses(tlStatuses);

      showToast(Toast.Style.Success, "Home timeline has been loaded");
      cache.set("latest_home_statuses", JSON.stringify(tlStatuses));
    } catch (error) {
      const requestErr = error as MastodonError;
      showToast(Toast.Style.Failure, "Error", requestErr.error || (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeTL();
  }, []);

  return {
    statuses,
    fetchHomeTL,
    isLoading
  };
}
