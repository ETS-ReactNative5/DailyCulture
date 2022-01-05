import React from 'react';
import classNames from 'classnames';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import Layout from '../components/layout';
import CardBody from '../components/Card/CardBody';
import componentStyles from '../styles/jss/nextjs-material-kit/pages/components';

const useComponentStyles = makeStyles(componentStyles);

export default function Where() {
  const componentClasses = useComponentStyles();

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
              <h3>Daily Culture in the wild!</h3>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <h3>Hammerhand Coffee</h3>
                <h4>249 W Mill St Unit 109, Liberty, MO 64068</h4>
              </Grid>
            </Grid>
          </CardBody>
        </div>
      </div>
    </Layout>
  );
}
