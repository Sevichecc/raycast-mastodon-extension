import { LocalStorage } from "@raycast/api";
import { useEffect, useState } from "react";
import { getAccessToken } from "../utils/oauth";
import apiServer from "../utils/api";

export function useMe() {
  const [username, setUsername] = useState("");

  const fetchUsername = async () => {
    try {
      await getAccessToken();
      const storedUsername = await LocalStorage.getItem<string>("account-username");

      if (storedUsername) {
        setUsername(storedUsername);
      }
      {
        const { username } = await apiServer.fetchAccountInfo();
        await LocalStorage.setItem("account-username", username);
        setUsername(username);
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
