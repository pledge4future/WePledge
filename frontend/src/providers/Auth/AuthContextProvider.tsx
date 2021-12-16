import React, { useState, useEffect } from "react";

import { AuthContext, defaultState } from "./AuthContext";

import { getCookie } from "../../utils/commons";

export const AuthContextProvider: React.FC<{}> = props => {
  const [state, setState] = useState<Partial<AuthContextType>>(defaultState);

  const refresh = (
    isAuthenticated: boolean,
    token?: string,
    permissions?: string[]
  ): void => {
    if (isAuthenticated && token) {
      document.cookie = `token=${token}; path=/`;
    }
    setState({
      isAuthenticated: isAuthenticated,
      token: token,
      permissions: permissions ? permissions : []
    });
  };

  const refreshToken = () => {   
    fetch("http://localhost:8000/api-token-refresh/", {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ token: getCookie("token") })
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error();
        }
      })
      .then(
       ( res => {console.log(res)})
      )
      // .then(
      //   (data: { token: string; permissions: string[] }) => {
      //   refresh(true, data.token, data.permissions);
      // })
      .catch(_ => refresh(false));
  };

  useEffect(() => {
    console.log(getCookie("token"));
    if (getCookie("token")) {
      refreshToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, refresh, refreshToken }}>
      {props.children}
    </AuthContext.Provider>
  );
};
