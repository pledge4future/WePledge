import React, { useState, useEffect } from "react";

import { AuthContext, defaultState } from "./AuthContext";

import { getCookie, setCookie } from "../../utils/commons";

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

  const logout = (): void => {
    console.log('usedLogout')
    setCookie('token','');
    setState({
      isAuthenticated: false,
      token: '',
      permissions: []
    })
  }


  const refreshToken = () => {   
    let token = getCookie('token');
    token && token.length > 0 ? refresh(true, token) : setState({isAuthenticated: false, token: null})
}

  useEffect(() => {
    if (getCookie("token")) {
      refreshToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, refresh, refreshToken, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
};
