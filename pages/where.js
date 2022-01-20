import React from 'react';
import classNames from 'classnames';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Link, Typography } from '@material-ui/core';
import Layout from '../components/layout';
import CardBody from '../components/Card/CardBody';
import Button from '../components/CustomButtons/Button.js';
import componentStyles from '../styles/jss/nextjs-material-kit/pages/components';
import styles from 'styles/jss/nextjs-material-kit/components/headerLinksStyle.js';

const useComponentStyles = makeStyles(componentStyles);

const useStyles = makeStyles(styles);

export default function Where() {
  const componentClasses = useComponentStyles();
  const classes = useStyles();

  const locations = [
    {
      name: 'Hammerhand Coffee',
      GPS: ['39.244380743712604', '-94.4238652713488'],
      address: '249 W Mill St Unit 109, Liberty, MO 64068',
    },
    {
      name: 'Classic Cookie',
      GPS: ['38.99949700087589', '-94.59429267478984'],
      address: '409 W Gregory BLVD, Kansas City, MO',
    },
  ];

  const openMap = (GPS) => {
    const platform = navigator?.userAgentData?.platform || navigator?.platform;

    if (
      /* if we're on iOS, open in Apple Maps */
      platform.indexOf('iPhone') != -1 ||
      platform.indexOf('iPad') != -1 ||
      platform.indexOf('iPod') != -1
    )
      window.open(`maps://maps.google.com/maps/dir/?daddr=${GPS}&amp;ll=`);
    /* else use Google */ else
      window.open(`https://maps.google.com/maps/dir/?daddr=${GPS}&amp;ll=`);
  };

  return (
    <Layout>
      <div
        style={{
          height: '10vh',
          paddingLeft: '10px',
        }}
      ></div>

      <div>
        <div
          className={classNames(
            componentClasses.main,
            componentClasses.mainRaised
          )}
        >
          <CardBody>
            <Grid item xs={12}>
              <Typography variant='h2' align='center'>
                Daily Culture in the WILD!
              </Typography>
            </Grid>
            {locations.map((location) => {
              return (
                <Grid container align='center' spacing={1}>
                  <Grid item xs={12}>
                    <h3>{location.name}</h3>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={{ cursor: 'pointer' }}
                    onClick={() => openMap(location.GPS)}
                  >
                    {location.address}
                  </Grid>
                </Grid>
              );
            })}
          </CardBody>
        </div>
      </div>
    </Layout>
  );
}
