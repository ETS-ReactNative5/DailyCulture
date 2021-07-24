import React from 'react';
// nodejs library that concatenates classes
import classNames from 'classnames';
// react components for routing our app without refresh
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
// @material-ui/icons
// core components
import Header from 'components/Header/Header.js';
import HeaderLinks from 'components/Header/HeaderLinks.js';
import Footer from 'components/Footer/Footer.js';
import GridContainer from 'components/Grid/GridContainer.js';
import GridItem from 'components/Grid/GridItem.js';
import Parallax from 'components/Parallax/Parallax.js';
// sections for this page
import SectionCarousel from 'pages-sections/Components-Sections/SectionCarousel.js';

import styles from 'styles/jss/nextjs-material-kit/pages/components.js';

const useStyles = makeStyles(styles);

const infoSection = makeStyles({
  container: { margin: '20px', paddingTop: '20px' },
});

export default function Components(props) {
  const classes = useStyles();
  const localClass = infoSection();
  const { ...rest } = props;
  return (
    <div>
      <Header
        brand='Daily Culture'
        rightLinks={<HeaderLinks />}
        fixed
        color='transparent'
        changeColorOnScroll={{
          height: 200,
          color: 'white',
        }}
        {...rest}
      />
      <Parallax image='/img/threeglasses.jpeg'>
        <div className={classes.container}>
          <GridContainer>
            <GridItem>
              <div className={classes.brand}>
                <h1 className={classes.title}>Daily Culture</h1>
                <h3 className={classes.subtitle}>Organic Kombucha</h3>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>

      <div className={classNames(classes.main, classes.mainRaised)}>
        <GridContainer className={localClass.container}>
          <div>
            <Typography variant='h5'>
              Daily Culture is all about educating and sharing experiences with
              the KC community over a glass of locally crafted organic kombucha.
              Kombucha is a drink full of healthy magic including tons of
              probiotics to give you a gut check!
            </Typography>
          </div>
        </GridContainer>
        <Typography
          className={localClass.infoSection}
          variant='subtitle1'
        ></Typography>
        <SectionCarousel />
      </div>
      <Footer />
    </div>
  );
}
