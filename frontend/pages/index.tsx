// Material-UI
import React from "react";
import Head from "next/head";

// Components
import AppAppBar from "../src/views/App/AppAppBar";

import ProductHero from '../src/views/Product/ProductHero';
import AppFooter from '../src/views/App/AppFooter';
import withRoot from "../src/withRoot";

function Index() {
  const title = "Welcome";
  const siteName = "Pledge4Future";

  return (
    <React.Fragment>
      <Head>
        <title>{title ? `${title} | ${siteName}` : siteName }</title>
      </Head>
      <AppAppBar />
      <ProductHero />
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(Index);
