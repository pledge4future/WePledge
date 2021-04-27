import React, { useState, useContext } from "react";
import { LoginView } from "./LoginView";
import { useTranslation } from "../../useTranslation";

import { useRouter } from "next/router";
import { AuthContext } from "../../providers/Auth";

export const LoginContainer: React.FC<{}> = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [error, setError] = useState(false);
  const authContext = useContext(AuthContext);

  console.log(authContext);

  function login(username?: string, password?: string): void {
    fetch("http://localhost:8000/api-token-auth/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
      .then(res => {
        res.json().then(res => {
          if (authContext.refresh) {
            try {
              console.log(res.token);
              authContext.refresh(true, res.token, []);
            } catch {
              throw new Error(t("AuthContext.refresh is undefined"));
            }
          } else {
            throw new Error();
          }
        });
      })

      .catch(err => {
        console.log("error while logging in via", err);
        setError(true);
      });
  }

  if (authContext.isAuthenticated) {
    // TODO: add redirect
    router.push("/user_profile");
  }

  return <LoginView error={error} login={login} />;
};
