import { LocalStorage } from "@raycast/api";
import { useCallback, useEffect, useState } from "react";
import { getAccessToken } from "../utils/oauth";
import apiServer from "../utils/api";

export function useMe() {
  const [username, setUsername] = useState("");

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

  useEffect(() => {
    fetchUsername();
  }, []);

  return {
    username,
    fetchUsername,
  };
}
