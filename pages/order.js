import React from 'react';
import classNames from 'classnames';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import { useFormik } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';
import {
  TextField,
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
} from '@material-ui/core';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Radio from '@mui/material/Radio';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';

// @material-ui/icons
import Home from '@material-ui/icons/Home';
import Favorite from '@material-ui/icons/Favorite';
import Email from '@material-ui/icons/Email';

// core components
import CustomInput from 'components/CustomInput/CustomInput.js';
import CustomDropdown from 'components/CustomDropdown/CustomDropdown.js';
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import Layout from '../components/layout';
import CardBody from 'components/Card/CardBody.js';
import Footer from 'components/Footer/Footer.js';
import HeaderLinks from 'components/Header/HeaderLinks.js';

import Button from 'components/CustomButtons/Button.js';
import CardFooter from 'components/Card/CardFooter.js';

import styles from '../styles/jss/nextjs-material-kit/pages/componentsSections/typographyStyle';
import componentStyles from '../styles/jss/nextjs-material-kit/pages/components';

const useStyles = makeStyles(styles);
const useComponentStyles = makeStyles(componentStyles);
const infoSection = makeStyles({
  container: {
    margin: '200px',
    paddingTop: '20px',
    maxWidth: '900px',
    margin: 'auto',
  },
});

// phone regex
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export default function Order() {
  const classes = useStyles();
  const componentClasses = useComponentStyles();
  const localClass = infoSection();

  const validationSchema = Yup.object({
    email: Yup.string().required('email is required'),
    blueberryMint16: Yup.string(),
    blueberryMint32: Yup.string(),
    applePie16: Yup.string(),
    applePie32: Yup.string(),
    address: Yup.string().required('Required'),
    phone: Yup.string()
      .required('Phone is required')
      .matches(phoneRegExp, 'Invalid phone format'),
    //  date: Yup.string().required('Choose a date'),
  });

  const initialValues = {
    email: '',
    blueberryMint16: '',
    blueberryMint32: '',
    applePie16: '',
    applePie32: '',
    address: '',
    phone: '',
    // date: moment().add(2, 'days'),
  };

  const options = [
    'Blueberry Mint 16 oz',
    'Blueberry Mint 32 oz',
    'Applie Pie 16 oz',
    'Apple Pie 32 oz',
  ];

  const handleSubmit = (values, actions) => {};

  const OrderForm = () => {
    const formik = useFormik({
      initialValues: {
        email: 'foobar@example.com',
        address: 'foobar',
      },
      validationSchema: validationSchema,
      onSubmit: (values) => {
        alert(JSON.stringify(values, null, 2));
      },
    });

    return (
      <form onSubmit={formik.handleSubmit}>
        <div className={classes.title}>
          <h2 style={{ paddingLeft: '20px' }}>Order Kombucha</h2>
        </div>
        <CardBody>
          <div class='form-check form-check-radio form-check-inline'>
            <div className={classes.title}>
              {options.map((option) => {
                return (
                  <div class='form-check form-check-radio form-check-inline'>
                    <div className={classes.title}>
                      <h3>
                        <small>{option}</small>
                      </h3>
                    </div>
                    <label class='form-check-label'>
                      <input
                        class='form-check-input'
                        type='radio'
                        name={`inlineRadioOptions1-${option}`}
                        id={`inlineRadioOptions1-${option}`}
                        value='option1'
                      />{' '}
                      1
                      <span class='circle'>
                        <span class='check'></span>
                      </span>
                    </label>
                    <label class='form-check-label'>
                      <input
                        class='form-check-input'
                        type='radio'
                        name={`inlineRadioOptions2-${option}`}
                        id={`inlineRadioOptions2-${option}`}
                        value='option2'
                      />{' '}
                      2
                      <span class='circle'>
                        <span class='check'></span>
                      </span>
                    </label>
                    <label class='form-check-label'>
                      <input
                        class='form-check-input'
                        type='radio'
                        name={`inlineRadioOptions3-${option}`}
                        id={`inlineRadioOptions3-${option}`}
                        value='option3'
                      />{' '}
                      3
                      <span class='circle'>
                        <span class='check'></span>
                      </span>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
          <CustomInput
            labelText='Email...'
            id='email'
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              type: 'email',
              endAdornment: (
                <InputAdornment position='end'>
                  <Email className={classes.inputIconsColor} />
                </InputAdornment>
              ),
            }}
          />
          <CustomInput
            labelText='Address...'
            id='address'
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              type: 'text',
              endAdornment: (
                <InputAdornment position='end'>
                  <Home className={classes.inputIconsColor} />
                </InputAdornment>
              ),
            }}
          />
        </CardBody>
        <CardFooter className={classes.cardFooter}>
          <Button color='twitter' size='lg'>
            Submit
          </Button>
        </CardFooter>
      </form>
    );
  };

  return (
    <>
      <div className={classes.title} />
      <Layout>
        <div id='typography'>
          <div
            className={classNames(
              componentClasses.main,
              componentClasses.mainRaised
            )}
          >
            <GridContainer justify='center'>
              <OrderForm />
            </GridContainer>
          </div>
        </div>
      </Layout>
    </>
  );
}
