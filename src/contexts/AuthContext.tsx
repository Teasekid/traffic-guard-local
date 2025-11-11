import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  email: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: "admin" | "user") => boolean;
  loginUser: (vehicleNumber: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("frsc_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password: string, role: "admin" | "user") => {
    if (role === "admin" && email === "admin@frsc.gov.ng" && password === "12345") {
      const userData = { email, role };
      setUser(userData);
      localStorage.setItem("frsc_user", JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const loginUser = (vehicleNumber: string) => {
    if (vehicleNumber.trim()) {
      const userData = { email: vehicleNumber, role: "user" as const };
      setUser(userData);
      localStorage.setItem("frsc_user", JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("frsc_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginUser,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
