import React from 'react';
import classNames from 'classnames';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
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
      site: 'https://www.hammerhand.coffee/',
    },
    {
      name: 'Classic Cookie',
      GPS: ['38.99949700087589', '-94.59429267478984'],
      address: '409 W Gregory BLVD, Kansas City, MO',
      site: 'https://classiccookiekc.com/',
    },
    {
      name: 'Billies Grocery',
      GPS: ['39.068071', '-94.579472'],
      address: '3216 Gillham Plaza Suite 100, Kansas City, MO 64109',
      site: 'https://www.billiesgrocery.com/',
    },
    {
      name: 'Billies Juicery',
      GPS: ['39.0137072', '-94.5798727'],
      address: '634 E 63rd St, Kansas City, MO 64110',
      site: 'http://www.unbakeryandjuicerykc.com/',
    },
    {
      name: 'McLain’s Market - Overland Park',
      GPS: ['38.9352362', '-94.638921'],
      address: '10695 Roe Ave, Overland Park, KS 66207',
      site: 'https://www.mclainskc.com/overland-park',
    },
    {
      name: 'McLain’s Market - Shawnee',
      GPS: ['39.022312571100215', '-94.71417317313768'],
      address: '5833 Nieman Rd, Shawnee, KS 66203',
      site: 'https://www.mclainskc.com/shawnee',
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
                  <Grid
                    className={classes.link}
                    item
                    xs={12}
                    onClick={() => window.open(location.site)}
                  >
                    <h3>{location.name}</h3>
                  </Grid>
                  <Grid
                    className={classes.link}
                    item
                    xs={12}
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
