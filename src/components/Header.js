import React from "react";
import Head from "next/head";

const Header = (props) => {
  const { title, children } = props;
  return (
    <Head>
      <meta charSetmeta="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1.0,user-scalable=no"
      />
      <title>{title}</title>
      {children}
    </Head>
  );
};

export default Header;
