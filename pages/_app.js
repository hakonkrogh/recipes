import Head from "next/head";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { DefaultSeo } from "next-seo";

import { screen } from "ui/screen";
import { responsive } from "ui/responsive";

const GlobalStyle = createGlobalStyle`
  :root {
    --spacing-x: 2.5rem;
  }
  
  body {
    font-family: 'Open Sans', sans-serif;
    margin: 0;
    padding: 0;
    --font-heading: 'Comfortaa';
  }
  
  * {
    box-sizing: border-box;
  }

  h1, h2 {
    font-family: var(--font-heading);
  }

  figure {
    margin: 0;
  }

  img {
    display: block;
    max-width: 100%;
    object-fit: cover;
  }

  input,
  select {
    font-size: 1rem;
  }

  input {
    border: 2px solid #aaa;
    border-radius: 4px;
    padding: 0.5em;
  }
`;

const theme = {
  screen,
  responsive,
  styles: {
    borderRadius: "12px",
  },
  colors: {
    primary: "#0070f3",
    productBg: "#f6f6f6",
  },
};

export default function App({ Component, pageProps }) {
  /**
   * Customise these values to match your site
   * Read more here: https://github.com/garmeeh/next-seo#default-seo-configuration
   */
  const SEOSettings = {
    // openGraph: {
    //   type: 'website',
    //   locale: locale.appLanguage,
    //   url: 'https://www.url.ie/',
    //   site_name: 'SiteName'
    // },
    // twitter: {
    //   handle: '@handle',
    //   site: '@site',
    //   cardType: 'summary_large_image'
    // }
  };

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&family=Open+Sans&display=swap"
          rel="stylesheet"
        />
      </Head>
      <DefaultSeo {...SEOSettings} />
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
