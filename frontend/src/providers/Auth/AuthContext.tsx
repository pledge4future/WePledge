import React from "react";

declare global {
  interface AuthContextType {
    isAuthenticated: boolean;
    permissions: string[];
    token: string | null;
    refreshToken: () => void;
    refresh: (
      isAuthenticated: boolean,
      token?: string,
      permissions?: string[]
    ) => void;
  }
}

export const defaultState: AuthContextType = {
  isAuthenticated: false,
  permissions: [],
  token: null,
  refresh: () => {},
  refreshToken: () => {}
};

export const AuthContext = React.createContext<Partial<AuthContextType>>(
  defaultState
);
