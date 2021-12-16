import React, { useState, useEffect } from "react";
import { FormValues } from "./LoginForm";

import { LoginForm } from "./LoginForm";

interface LoginProps {
  login: (username?: string, password?: string) => void;
  error?: boolean;
}

interface LoginState {
  username: string;
  password: string;
  isSubmitting: boolean;
}

export const LoginView = (props: LoginProps): JSX.Element => {
  const [values, setValues] = useState<LoginState>({
    username: "",
    password: "",
    isSubmitting: false
  });

  const handleSubmit = (values: FormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    setValues({
      username: values.email,
      password: values.password,
      isSubmitting: true
    });
    setSubmitting(false);
  };

  /* eslint-disable */
  useEffect(() => {
    if (values.isSubmitting) {
      props.login(values.username, values.password);

      setValues({ ...values, isSubmitting: false });
    }
  }, [values.isSubmitting]);
  /* eslint-disable */

  const { error } = props;
  return (
    <React.Fragment>
      <LoginForm error={error} onSubmit={handleSubmit} />
    </React.Fragment>
  );
};
