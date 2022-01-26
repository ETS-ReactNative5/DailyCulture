import React from 'react';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

// core components
import EventSetup from 'components/eventSetup';

// @material-ui/icons
import Email from '@material-ui/icons/Email';

// core components
import GridContainer from 'components/Grid/GridContainer.js';
import Layout from '../components/layout';
import Button from 'components/CustomButtons/Button.js';

import styles from '../styles/jss/nextjs-material-kit/pages/componentsSections/typographyStyle';

const useStyles = makeStyles(styles);

export default function Contact() {
  const classes = useStyles();
  return (
    <>
      <Layout>
        <div className={classes.section}>
          <div className={classes.container}>
            <div id='typography'>
              <div className={classes.title}>
                <h2>Contact Us</h2>
              </div>
              <GridContainer>
                <div className={classes.typo}>
                  <h3>Send us a message on Instagram</h3>
                  <Button
                    href='https://www.instagram.com/daily.culture.kombucha'
                    target='_blank'
                  >
                    <i className={classes.socialIcons + ' fab fa-instagram'} />
                    Daily Culture
                  </Button>
                </div>
                <div className={classes.typo}>
                  <h3>Email us</h3>
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
                      Questions and Comments
                    </Typography>
                  </Button>
                </div>
              </GridContainer>
              <h2>Book a kombucha bar for your next event!</h2>
              <EventSetup />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
