import React from "react";
import { useTranslation } from "../../useTranslation";
import { FormikHelpers, useFormik } from "formik";
import * as yup from "yup";

// Material-UI
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

export interface FormValues {
  email: string;
  password: string;
}

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required")
});

const initialValues = {
  email: "",
  password: ""
};

export const LoginForm = (props: {
  error?: boolean;
  onSubmit: (values: FormValues, setSubmitting: (isSubmitting: boolean) => void) => void;
}) => {
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values: FormValues, formikHelpers: FormikHelpers<FormValues>)  => {
      const { setSubmitting } = formikHelpers;
      props.onSubmit(values, setSubmitting);
    }
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          style={{ margin: 8 }}
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
          variant="outlined"
          id="email"
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        <TextField
          fullWidth
          style={{ margin: 8 }}
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
          variant="outlined"
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <Button
          fullWidth
          style={{ margin: 8 }}
          variant="contained"
          color="primary"
          size="large"
          type="submit"
        >
          {t("Sign In")}
        </Button>
      </form>
    </div>
  );
};
