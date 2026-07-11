import { createContext, useContext, useEffect, useState } from "react";
import { fetchCurrentUser, redirectToGitHubAuth, logoutUser } from "../lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await fetchCurrentUser();
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    getUser();
  }, []);

  const login = () => {
    redirectToGitHubAuth();
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
