import { LocalStorage, Cache, Toast, showToast } from "@raycast/api";
import { useCallback, useEffect, useState } from "react";
import { getAccessToken } from "../utils/oauth";
import apiServer from "../utils/api";
import { Status, MastodonError } from "../utils/types";

const cache = new Cache();

export function useMe() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const cached = cache.get("latest_statuses");
  const [statuses, setStatuses] = useState<Status[]>(cached ? JSON.parse(cached) : []);

  const fetchUsername = useCallback(async () => {
    try {
      await getAccessToken();
      const storedUsername = await LocalStorage.getItem<string>("account-username");
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        const { username } = await apiServer.fetchAccountInfo();
        setUsername(username);
        await LocalStorage.setItem("account-username", username);
      }
    } catch (error) {
      console.error("Error during authorization or fetching account-username:", error);
    }
  }, []);

    const fetchMyStatuses = async () => {
      try {
        await getAccessToken();
        showToast(Toast.Style.Animated, "Loading Status...");
        const status = await apiServer.fetchUserStatus();
        setStatuses(statuses);
        showToast(Toast.Style.Success, "Statuses has been loaded");
        cache.set("latest_statuses", JSON.stringify(status));
      } catch (error) {
        const requestErr = error as MastodonError;
        showToast(Toast.Style.Failure, "Error", requestErr.error);
      } finally {
        setIsLoading(false);
      }
  };
  
  useEffect(() => {
    fetchUsername();
  }, []);

  return {
    username,
    isLoading,
    statuses,
    fetchUsername,
    fetchMyStatuses,
  };
}
