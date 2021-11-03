import React from 'react';
// react component for creating beautiful carousel
import Carousel from 'react-slick';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
// @material-ui/icons
// import LocationOn from '@material-ui/icons/LocationOn';
// core components
import GridContainer from 'components/Grid/GridContainer.js';
import GridItem from 'components/Grid/GridItem.js';
import Card from 'components/Card/Card.js';

import styles from 'styles/jss/nextjs-material-kit/pages/componentsSections/carouselStyle.js';

const useStyles = makeStyles(styles);

export default function SectionCarousel() {
  const classes = useStyles();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };
  return (
    <div className={classes.container}>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8} className={classes.marginAuto}>
          <Card carousel>
            <Carousel {...settings}>
              <div>
                <img
                  src='/img/head-brewer.jpg'
                  alt='head brewer'
                  className='slick-image'
                />
              </div>
              <div>
                <img
                  src='/img/2-2gallonJugs.jpg'
                  alt='jugs of liquid gold'
                  className='slick-image'
                />
              </div>
              <div>
                <img
                  src='/img/table-shot.png'
                  alt='tables of delicious things'
                  className='slick-image'
                />
              </div>
              <div>
                <img
                  src='/img/Ginger.png'
                  alt='ginger'
                  className='slick-image'
                />
              </div>
              <div>
                <img
                  src='/img/Strawberries.png'
                  alt='strawberries'
                  className='slick-image'
                />
              </div>
              <div>
                <img
                  src='/img/2-empty-bottles.png'
                  alt='2bottles'
                  className='slick-image'
                />
              </div>
            </Carousel>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
