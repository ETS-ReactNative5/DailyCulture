import React from 'react';
import Carousel from 'react-slick';
import GridContainer from 'components/Grid/GridContainer.js';
import GridItem from 'components/Grid/GridItem.js';

// core components
import Card from 'components/Card/Card.js';

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  fade: true,
};
export default function EventSetup() {
  return (
    <GridContainer>
      <GridItem>
        <Card carousel>
          <Carousel {...settings}>
            <div>
              <img
                src='/img/side-table-shot.png'
                alt='head brewer'
                className='slick-image'
              />
            </div>
            <div>
              <img
                src='/img/market-signs.png'
                alt='Booch'
                className='slick-image'
              />
            </div>
            <div>
              <img
                src='/img/table-shot.png'
                alt='2bottles'
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
  );
}
