import React from 'react';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';

// @material-ui/icons

// core components
import GridContainer from 'components/Grid/GridContainer.js';
import Layout from '../components/layout';
import HeaderLinks from 'components/Header/HeaderLinks.js';

import styles from '../styles/jss/nextjs-material-kit/pages/componentsSections/typographyStyle'
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(styles);

export default function About() {
  const classes = useStyles();
  return (
    <>
      <Layout>
        <div className={classes.section}>
          <div className={classes.container}>
            <div id='typography'>
              <div className={classes.title}>
                <h2>About Us</h2>
              </div>
              <GridContainer>
                <div className={classes.typo}>
                  <h3>Where did we come from</h3>
                  <Typography>
                    As we learned more about living healthy and treating our
                    body right we came accross Kombucha. It was unlike anything
                    we had ever had before. From that moment I knew this drink
                    would be a part of me for the rest of my life. As I drank
                    more and more I decided to do some brewing of my own. What I
                    found was a passion to create and share. As I shared more
                    with family and friends I also had the urge to share with my
                    larger community. This sparked the idea to start Daily
                    Culture. As a company we strive to make our community
                    healthier using the best ingredients we can find. From cold
                    pressed juices, to organic fruits and herbs. No detail is
                    too small to create a drink to satisfy the soul.
                  </Typography>
                </div>
                <div className={classes.typo}>
                  <h3>Find us</h3>
                  <Typography>
                    Right now you can't find us anywhere but on Social media.
                    Our Instagram account is being leveraged to provide up to
                    date information on where the business is. We are planning
                    to start selling at the local Northland farmers market this
                    summer. Until then keep following us on Instagram to find
                    out the latest news.
                  </Typography>
                </div>
              </GridContainer>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
