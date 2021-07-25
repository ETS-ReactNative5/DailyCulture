/*eslint-disable*/
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Tooltip from '@material-ui/core/Tooltip';
import Face from '@material-ui/icons/Face';
import Email from '@material-ui/icons/Email';
import HomeIcon from '@material-ui/icons/Home';

// @material-ui/icons
import { Apps } from '@material-ui/icons';

// core components
import CustomDropdown from 'components/CustomDropdown/CustomDropdown.js';
import Button from 'components/CustomButtons/Button.js';

import styles from 'styles/jss/nextjs-material-kit/components/headerLinksStyle.js';

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const classes = useStyles();
  const router = useRouter();

  return (
    <List className={classes.list}>
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
        <Tooltip
          id='instagram-tooltip'
          title='Follow us on instagram'
          placement={'top'}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            color='transparent'
            href='https://www.instagram.com/daily.culture.kc/'
            target='_blank'
            className={classes.navLink}
          >
            <i className={classes.socialIcons + ' fab fa-instagram'} />
            The Gram
          </Button>
        </Tooltip>
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
