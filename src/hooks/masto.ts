import { LocalStorage, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { getAccessToken } from "../utils/oauth";
import { MastodonError, Status } from "../utils/types";
import apiServer from "../utils/api";

export function useMe() {
  const [username, setUsername] = useState("");

  const fetchUsername = async () => {
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
  };

  useEffect(() => {
    fetchUsername();
  }, []);

  return {
    username,
    fetchUsername,
  };
}

export function useHomeTL() {
  const [statuses, setStatuses] = useState<Status[]>();

  const fetchHomeTL = async () => {
    try {
      await getAccessToken();
      const tlStatuses = await apiServer.fetchHomeTL();
      setStatuses(tlStatuses);
    } catch (error) {
      const requestErr = error as MastodonError;
      showToast(Toast.Style.Failure, "Error", requestErr.error || (error as Error).message);
    }
  };

  useEffect(() => {
    fetchHomeTL();
  }, []);

  return {
    statuses,
    fetchHomeTL,
  };
}
