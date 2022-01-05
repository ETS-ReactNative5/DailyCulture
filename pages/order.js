import React from 'react';
import classNames from 'classnames';
import { send } from 'emailjs-com';
import { ToastContainer, toast } from 'react-toastify';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Grid, Typography } from '@material-ui/core';
import NativeSelect from '@mui/material/NativeSelect';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@material-ui/core/InputAdornment';
import Phone from '@material-ui/icons/Phone';

// @material-ui/icons
import Home from '@material-ui/icons/Home';
import Favorite from '@material-ui/icons/Favorite';
import Email from '@material-ui/icons/Email';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import IconButton from '@mui/material/IconButton';

// core components
import Layout from '../components/layout';
import CardBody from 'components/Card/CardBody.js';

import Button from 'components/CustomButtons/Button.js';

import styles from '../styles/jss/nextjs-material-kit/pages/componentsSections/typographyStyle';
import componentStyles from '../styles/jss/nextjs-material-kit/pages/components';
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles(styles);
const useComponentStyles = makeStyles(componentStyles);

// phone regex
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const orderOptions = {
  blueberryMintSM: {
    label: 'Blueberry Mint 16 oz ',
    cost: 0,
    price: 6,
    quantity: 0,
  },
  blueberryMintLG: {
    label: 'Blueberry Mint 32 oz',
    cost: 0,
    price: 10,
    quantity: 0,
  },
  fallYallSM: {
    label: "Fall Y'all 16 oz",
    subLabel: 'Apple + pumpkin spice',
    cost: 0,
    price: 6,
    quantity: 0,
  },
  fallYallLG: {
    label: "Fall Y'all 32 oz",
    subLabel: 'Apple + pumpkin spice',
    cost: 0,
    price: 10,
    quantity: 0,
  },
  lemonGingerSM: {
    label: 'Lemon Ginger 16 oz',
    cost: 0,
    price: 6,
    quantity: 0,
  },
  lemonGingerLG: {
    label: 'Lemon Ginger 32 oz',
    cost: 0,
    price: 10,
    quantity: 0,
  },
  strawMerrySM: {
    label: 'Straw-Merry 16 oz',
    subLabel: 'Strawberry + Rosmary',
    cost: 0,
    price: 6,
    quantity: 0,
  },
  strawMerryLG: {
    label: 'Straw-Merry 32 oz',
    subLabel: 'Strawberry + Rosmary',
    cost: 0,
    price: 10,
    quantity: 0,
  },
};

export default function Order() {
  const classes = useStyles();
  const componentClasses = useComponentStyles();

  const flavors = Object.keys(orderOptions);

  const [successMessage, setSuccessMessage] = React.useState('');
  const form = React.useRef();

  const initialFlavorsSchema = flavors.reduce((acc, flavor) => {
    return { ...acc, [flavor]: Yup.string() };
  }, {});

  const validationSchema = Yup.object({
    ...initialFlavorsSchema,
    email: Yup.string().email('Invalid email address').required('Required'),
    phone: Yup.string(),
    name: Yup.string().required('Required'),
    address: Yup.string().required('Required'),
    total: Yup.string(),
  });

  const initialFlavors = flavors.reduce((acc, flavor) => {
    return { ...acc, [flavor]: '' };
  }, {});

  const OrderForm = () => {
    const formik = useFormik({
      initialValues: {
        ...initialFlavors,
        name: '',
        email: '',
        phone: '',
        address: '',
        total: 0,
      },
      enableReinitialize: true,
      validationSchema: validationSchema,
      onSubmit: (values) => {
        const orderTotal = Object.keys(values).reduce((acc, item) => {
          if (!orderOptions[item]) {
            return acc;
          }
          return acc + orderOptions[item].price * (values[item] || 0);
        }, 0);

        const flavorValues = flavors.reduce((acc, flavor) => {
          return { ...acc, [flavor]: values[flavor] || 0 };
        }, {});

        send(
          'service_khybsuh',
          'template_iug13b3',
          {
            address: values.address,
            name: values.name,
            phone: values.phone,
            email: values.email,
            ...flavorValues,
            total: orderTotal,
          },
          'user_S1s9CZ9xV8Lt9QB3D5WOH'
        )
          .then((response) => {
            setSuccessMessage('Thank you for your order!');
            toast.success('Successfully ordered!', {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
          })
          .catch((err) => {
            console.log('FAILED...', err);
          });
        formik.resetForm();
      },
    });

    const dropDown = (name) => {
      return (
        <Grid
          item
          xs={12}
          md={6}
          style={{ display: 'inline-flex', alignItems: 'center' }}
          key={name}
        >
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel variant='standard' htmlFor='uncontrolled-native'>
              {orderOptions[name]?.label}
            </InputLabel>
            <NativeSelect
              value={formik.values[name]}
              id={name}
              name={name}
              inputProps={{
                name: name,
                id: 'uncontrolled-native',
              }}
              onChange={(event) => {
                formik.handleChange(name)(event);
              }}
            >
              <option aria-label='None' value='' />
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </NativeSelect>
            <FormHelperText>{orderOptions[name]?.subLabel}</FormHelperText>
          </FormControl>
          <IconButton
            color='default'
            aria-label='Remove item'
            component='span'
            onClick={() => {
              formik.setFieldValue(name, '', false);
            }}
          >
            <DeleteForeverIcon />
          </IconButton>
        </Grid>
      );
    };

    const total = Object.keys(formik.values).reduce((acc, item) => {
      if (!orderOptions[item]) {
        return acc;
      }
      return acc + orderOptions[item].price * (formik.values[item] || 0);
    }, 0);

    return (
      <>
        <form onSubmit={formik.handleSubmit} ref={form}>
          <CardBody>
            <FormControl component='fieldset'>
              <Grid item xs={12}>
                <h3>Order Kombucha</h3>
              </Grid>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <h4>$6 - 16 oz bottles</h4>
                </Grid>
                <Grid item xs={4}>
                  <h4>$10 - 32 oz bottles</h4>
                </Grid>
                <Grid item xs={4}>
                  <h4>$24 minimum order (before shipping)</h4>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                {flavors.map((flavor) => {
                  return dropDown(flavor);
                })}
                <Grid item xs={12}>
                  <Typography id='total' variant='h6'>
                    Total: ${total} + $5 shipping = ${total + 5}
                  </Typography>
                </Grid>
                <Grid item xs={12}></Grid>
                <Grid item>
                  <Typography variant='body1'>
                    Let's get some information for this order!
                  </Typography>
                </Grid>
                <Grid item xs={12} key={'name'}>
                  <TextField
                    required
                    fullWidth
                    id='name'
                    name='name'
                    label='Name'
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <Favorite className={classes.inputIconsColor} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} key={'email'}>
                  <TextField
                    required
                    fullWidth
                    id='email'
                    name='email'
                    label='Email'
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <Email className={classes.inputIconsColor} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} key={'phone'}>
                  <TextField
                    fullWidth
                    id='phone'
                    name='phone'
                    label='Phone - if you prefer text messages '
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <Phone className={classes.inputIconsColor} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} key={'address'}>
                  <TextField
                    required
                    fullWidth
                    id='address'
                    name='address'
                    label='Address...'
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.address && Boolean(formik.errors.address)
                    }
                    helperText={formik.touched.address && formik.errors.address}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <Home className={classes.inputIconsColor} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} key={'success'}>
                  <Typography>{successMessage}</Typography>
                  <Button
                    color='twitter'
                    variant='contained'
                    fullWidth
                    type='submit'
                    disabled={!formik.isValid || total < 24}
                  >
                    Submit
                  </Button>
                  <ToastContainer />
                </Grid>
              </Grid>
            </FormControl>
          </CardBody>
        </form>
      </>
    );
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
          <OrderForm />
        </div>
      </div>
    </Layout>
  );
}
