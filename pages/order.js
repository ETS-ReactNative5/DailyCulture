import React from 'react';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip, Link } from '@material-ui/core';
import { Typography } from '@material-ui/core';

// @material-ui/icons
import LocalMallTwoToneIcon from '@mui/icons-material/LocalMallTwoTone';
// core components
import GridContainer from 'components/Grid/GridContainer.js';
import Layout from '../components/layout';
import Footer from 'components/Footer/Footer.js';
import HeaderLinks from 'components/Header/HeaderLinks.js';
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
                <h2>Order</h2>
              </div>
              <GridContainer>
                <div className={classes.typo}>
                  <h3>Fill out a form to place an order</h3>
                  <Button
                    variant='contained'
                    target='_blank'
                    rel='noopener noreferrer'
                    href={'https://www.surveymonkey.com/r/QBP97ZV'}
                  >
                    <LocalMallTwoToneIcon className={classes.icons} />
                    <Typography variant='button' style={{ fontSize: '1rem' }}>
                      Order the BOOCH
                    </Typography>
                  </Button>
                  {/* <Button color='transparent' className={classes.navLink}>
                  
                </Button> */}
                </div>
              </GridContainer>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
