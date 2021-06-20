/*!

=========================================================
* NextJS Material Kit v1.2.0 based on Material Kit Free - v2.0.2 (Bootstrap 4.0.0 Final Edition) and Material Kit React v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-material-kit
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/nextjs-material-kit/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from 'react';
import ReactDOM from 'react-dom';
import App from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import * as ga from '../lib/ga';

import PageChange from 'components/PageChange/PageChange.js';

import 'styles/scss/nextjs-material-kit.scss?v=1.2.0';

Router.events.on('routeChangeStart', (url) => {
  console.log(`Loading: ${url}`);
  document.body.classList.add('body-page-transition');
});

const handleRouteChange = (url) => {
  ga.pageview(url);
};

Router.events.on('routeChangeComplete', () => {
  ReactDOM.unmountComponentAtNode(document.getElementById('page-transition'));
  document.body.classList.remove('body-page-transition');
  handleRouteChange();
});

Router.events.on('routeChangeError', () => {
  ReactDOM.unmountComponentAtNode(document.getElementById('page-transition'));
  document.body.classList.remove('body-page-transition');
});

export default class MyApp extends App {
  componentDidMount() {
    useEffect(() => {
      const handleRouteChange = (url) => {
        ga.pageview(url);
      };
      //When the component is mounted, subscribe to router changes
      //and log those page views
      router.events.on('routeChangeComplete', handleRouteChange);

      // If the component is unmounted, unsubscribe
      // from the event with the `off` method
      return () => {
        router.events.off('routeChangeComplete', handleRouteChange);
      };
    }, [router.events]);
  }
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }
  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1, shrink-to-fit=no'
          />
          <title>Daily Culture</title>
        </Head>
        <Component {...pageProps} />
      </>
    );
  }
}
