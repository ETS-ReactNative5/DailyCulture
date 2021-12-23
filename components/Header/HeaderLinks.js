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
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

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
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
      <ListItem className={classes.listItem} onClick={handleClick}>
        <Button color='transparent' className={classes.navLink}>
          <LocalMallTwoToneIcon />
          Order
          {open ? <ExpandLess /> : <ExpandMore />}
        </Button>
      </ListItem>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        disableEnforceFocus={true}
      >
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
      </Menu>
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
