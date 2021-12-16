import { useContext } from "react";

import { AuthContext } from "../../providers/Auth";

export default function LogoutContainer(): null {
  const authContext = useContext(AuthContext);
  if (authContext.refresh) {
    window.document.cookie = "token=; path=/";
    authContext.refresh(false);
  }
  return null;
}
