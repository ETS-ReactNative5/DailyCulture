import React from 'react';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';

// @material-ui/icons
import Email from '@material-ui/icons/Email';

// core components
import GridContainer from 'components/Grid/GridContainer.js';
import Layout from '../components/layout';
import Button from 'components/CustomButtons/Button.js';

import styles from '../styles/jss/nextjs-material-kit/pages/componentsSections/typographyStyle';
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
                  <h3>Who are we</h3>
                  <Typography>
                    As we learned more about living healthy and treating our
                    body right we came accross Kombucha. It was unlike anything
                    we had ever had before. From that moment I knew this drink
                    would be a part of my diet for the rest of my life.
                  </Typography>
                  <Typography>
                    As I drank more and more I decided to do some brewing of my
                    own. What I found was a passion to create and share. As I
                    shared more with family and friends I also had the urge to
                    share with my larger community. This sparked the idea to
                    start Daily Culture.
                  </Typography>
                  <Typography>
                    As a company, we strive to make our community healthier
                    using the best ingredients we can find. From cold pressed
                    juices, to organic fruits and herbs. No detail is too small
                    to create a drink to satisfy the soul.
                    <b> What you drink matters!</b>
                  </Typography>
                </div>
                <div className={classes.typo}>
                  <h3>Find us</h3>
                  <Typography>
                    Follow us on Instagram for our latest events. You can find
                    us at the Liberty Farmers market in the Spring!
                  </Typography>
                </div>

                <div className={classes.typo}>
                  <h3>Book us</h3>
                  <Typography>
                    Have a kombucha bar at your next event!
                  </Typography>
                  <Button
                    variant='contained'
                    target='_blank'
                    rel='noopener noreferrer'
                    href={`mailto:dailyculturekc@gmail.com`}
                  >
                    <Email className={classes.icons} />
                    <Typography
                      variant='button'
                      style={{ fontSize: '0.69rem' }}
                    >
                      Send Us an Email
                    </Typography>
                  </Button>
                  <div>
                    <img
                      src='/img/side-table-shot.png'
                      alt='Booch'
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </GridContainer>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
