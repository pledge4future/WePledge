import React from "react";
import { AppProps } from "next/app";

// Theme
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "../src/theme";

// GraphQL-Client
import { ApolloProvider } from "@apollo/client";
import client from "../src/api/apollo-client";

import { AuthContextProvider } from "../src/providers/Auth";

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <AuthContextProvider>
            <Component {...pageProps} />
          </AuthContextProvider>
        </>
      </ThemeProvider>
    </ApolloProvider>
  );
}
