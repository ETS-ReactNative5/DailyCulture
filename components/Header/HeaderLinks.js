/*eslint-disable*/
import React from 'react';
import { useRouter } from 'next/router';

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import ListItem from '@material-ui/core/ListItem';
import Face from '@material-ui/icons/Face';
import Email from '@material-ui/icons/Email';
import StoreIcon from '@mui/icons-material/Store';
import HomeIcon from '@material-ui/icons/Home';

// @material-ui/icons
// core components
import Button from 'components/CustomButtons/Button.js';

import styles from 'styles/jss/nextjs-material-kit/components/headerLinksStyle.js';

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const classes = useStyles();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState(null);

  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Button
          color='transparent'
          href='https://www.instagram.com/daily.culture.kc/'
          target='_blank'
          className={classes.navLink}
        >
          <i className={classes.socialIcons + ' fab fa-instagram'} />
          Instagram
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          onClick={() => router.push('/order')}
          color='transparent'
          className={classes.navLink}
        >
          <MapsHomeWorkIcon />
          Home Delivery
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          onClick={() => router.push('/where')}
          color='transparent'
          className={classes.navLink}
        >
          <TravelExploreIcon />
          Where to buy
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          onClick={() => router.push('/wholesale')}
          color='transparent'
          className={classes.navLink}
        >
          <StoreIcon />
          Wholesale
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          onClick={() => router.push('/about')}
          color='transparent'
          className={classes.navLink}
        >
          <Face />
          About
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          onClick={() => router.push('/contact')}
          color='transparent'
          className={classes.navLink}
        >
          <Email className={classes.icons} />
          Contact
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          onClick={() => router.push('/')}
          color='transparent'
          className={classes.navLink}
        >
          <HomeIcon className={classes.icons} />
          Home
        </Button>
      </ListItem>
    </List>
  );
}
