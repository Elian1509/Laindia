import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedUserId = localStorage.getItem("userId");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUsername(payload.sub);
        setRole(storedRole);

        if (storedUserId) {
          setUserId(parseInt(storedUserId));
        } else if (payload.userId) {
          setUserId(payload.userId);
          localStorage.setItem("userId", payload.userId);
        }
      } catch (e) {
        console.error("Error al decodificar token:", e);
      }
    }
  };

  const updateUserData = (id, user, userRole) => {
    setUserId(id);
    setUsername(user);
    setRole(userRole);
    localStorage.setItem("userId", id);
    localStorage.setItem("username", user);
    localStorage.setItem("role", userRole);
  };

  const clearUserData = () => {
    setUserId(null);
    setUsername(null);
    setRole(null);
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider
      value={{
        userId,
        username,
        role,
        updateUserData,
        clearUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
