import cubejs from "@cubejs-client/core";

// cubejsApi connection
// TODO: remove token

const CUBEJS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MTk3NzQxNTYsImV4cCI6MTYxOTg2MDU1Nn0.GcS1Hjn9eknCIMHCH2HSjSUu5hp-KNuoMcXUiTOQetc";
export const cubejsApi = cubejs(CUBEJS_TOKEN, { apiUrl: "http://localhost:4000/cubejs-api/v1" });

// transform date to string
// return value -> 2020-01-01
export const date2String = (value: Date, decimal = "/") => {
  const dateString = `${value.getFullYear()}${decimal}${
    value.getMonth() + 1
  }${decimal}${value.getDate()}`;
  return dateString;
};
