/*eslint-disable*/
import React from 'react';
import { useRouter } from 'next/router';

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItemButton from '@mui/material/ListItemButton';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';

import Tooltip from '@material-ui/core/Tooltip';
import ListItem from '@material-ui/core/ListItem';
import Face from '@material-ui/icons/Face';
import Email from '@material-ui/icons/Email';
import StoreIcon from '@mui/icons-material/Store';
import HomeIcon from '@material-ui/icons/Home';
import LocalMallTwoToneIcon from '@mui/icons-material/LocalMallTwoTone';

// @material-ui/icons
// core components
import Button from 'components/CustomButtons/Button.js';

import styles from 'styles/jss/nextjs-material-kit/components/headerLinksStyle.js';

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const classes = useStyles();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Tooltip
          id='instagram-tooltip'
          title='Follow us on Instagram'
          placement={'top'}
          classes={{ tooltip: classes.navLink }}
        >
          <Button
            color='transparent'
            href='https://www.instagram.com/daily.culture.kc/'
            target='_blank'
            className={classes.navLink}
          >
            <i className={classes.socialIcons + ' fab fa-instagram'} />
            Instagram
          </Button>
        </Tooltip>
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
      <ListItemButton className={classes.listItem} onClick={handleClick}>
        <ListItem className={classes.listItem}>
          <Button color='transparent' className={classes.navLink}>
            <LocalMallTwoToneIcon />
            Order
            {open ? <ExpandLess /> : <ExpandMore />}
          </Button>
        </ListItem>
      </ListItemButton>
      <Collapse in={open} timeout='auto' unmountOnExit>
        <List component='div' disablePadding>
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
              onClick={() => router.push('/wholesale')}
              color='transparent'
              className={classes.navLink}
            >
              <StoreIcon />
              Wholesale
            </Button>
          </ListItem>
        </List>
      </Collapse>
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
