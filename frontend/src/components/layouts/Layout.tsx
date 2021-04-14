import React, { ReactNode } from "react";
import Head from "next/head";

// Components
import Header from "./Header";
import Footer from "./Footer";
import AppAppBar from '../../views/App/AppAppBar';

type Props = {
  children?: ReactNode;
  title?: string;
  description?: string;
  ogImage?: string;
  url?: string;
};

const Layout = ({ children, title, description, ogImage, url }: Props) => {
  // website Url
  const pageUrl = "https://scientists4future-heidelberg.de/";
  // when you share this page on facebook you'll see this image
  const ogImg =
    "https://scientists4future-heidelberg.de/wp-content/uploads/2020/02/cropped-website-logo-s4fhd-e1581548004891.png";
  return (
    <>
      <Head>
        <title>{title ? title : ""}</title>
        <meta
          name="description"
          key="description"
          content={description ? description : ""}
        />
        <meta property="og:title" content={title ? title : ""} key="og:title" />
        <meta property="og:url" content={url ? url : pageUrl} key="og:url" />
        <meta
          property="og:image"
          content={ogImage ? ogImage : ogImg}
          key="og:image"
        />
        <meta
          property="og:description"
          content={description ? description : ""}
          key="og:description"
        />
      </Head>
      <AppAppBar/>
      
      <Header />
      {children}
      <Footer />
      <style jsx global>
        {`
          html,
          body {
            background: #f9f9f9;
            overflow-x: hidden;
            padding: 0 !important;
          }
          #__next {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          main {
            flex: 1;
          }
        `}
      </style>
    </>
  );
};

export default Layout;
