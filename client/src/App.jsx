// App.jsx - Main application component
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Login from "./components/Login";
import ChatRoom from "./pages/ChatRoom";
import useNotifications from "./hooks/useNotifications";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { requestPermission, permission } = useNotifications();

  useEffect(() => {
    // Request notification permission on mount
    if (permission === "default") {
      requestPermission();
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#363636",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      {isLoggedIn ? (
        <ChatRoom onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
}

export default App;
