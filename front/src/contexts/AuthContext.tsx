// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  name: string;
  email: string;
  role: string;
  contactNumber?: string;
  farmLocation?: string;
  crops?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (data: Partial<User>) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = (email: string, password: string) => {
    let role = "farmer";
    if (email.includes("lab")) role = "lab";
    else if (email.includes("agent")) role = "agent";
    else if (email.includes("manufacturer")) role = "manufacturer";
    else if (email.includes("admin")) role = "admin";

    const demoUser: User = {
      name: "Demo User",
      email,
      role,
      contactNumber: "1234567890",
      farmLocation: "Demo Farm",
      crops: ["Ashwagandha", "Tulsi"]
    };

    setUser(demoUser);
    return true;
  };

  const signup = (data: Partial<User>) => {
    const newUser: User = {
      name: data.name || "Demo User",
      email: data.email || "demo@example.com",
      role: "farmer",
      contactNumber: data.contactNumber,
      farmLocation: data.farmLocation,
      crops: data.crops || []
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);             // Clear user state
    navigate("/login");        // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
