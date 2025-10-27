// hooks/useNotifications.js - Hook for managing browser notifications
import { useEffect, useState } from "react";

const useNotifications = () => {
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if ("Notification" in window) {
      try {
        const result = await Notification.requestPermission();
        setPermission(result);
        return result;
      } catch (error) {
        console.error("Error requesting notification permission:", error);
        return "denied";
      }
    }
    return "denied";
  };

  const showNotification = (title, options = {}) => {
    if (permission === "granted") {
      return new Notification(title, {
        icon: "/vite.svg",
        badge: "/vite.svg",
        ...options,
      });
    }
    return null;
  };

  return {
    permission,
    requestPermission,
    showNotification,
    isSupported: "Notification" in window,
  };
};

export default useNotifications;
