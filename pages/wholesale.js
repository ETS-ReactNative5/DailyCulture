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
import InputAdornment from '@material-ui/core/InputAdornment';
import Phone from '@material-ui/icons/Phone';

// @material-ui/icons
import Home from '@material-ui/icons/Home';
import Favorite from '@material-ui/icons/Favorite';
import Email from '@material-ui/icons/Email';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

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

export default function Order() {
  const classes = useStyles();
  const componentClasses = useComponentStyles();

  const flavors = [
    'blueberryMintSM',
    'blueberryMintLG',
    'fallYallSM',
    'fallYallLG',
    'lemonGingerSM',
    'lemonGingerLG',
    'strawMerrySM',
    'strawMerryLG',
  ];

  const initialOrder = {
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
    fallYallSM: { label: "Fall Y'all 16 oz", cost: 0, price: 6, quantity: 0 },
    fallYallLG: {
      label: "Fall Y'all 32 oz",
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
      cost: 0,
      price: 6,
      quantity: 0,
    },
    strawMerryLG: {
      label: 'Straw-Merry 32 oz',
      cost: 0,
      price: 10,
      quantity: 0,
    },
  };

  const [orderTotal, setOrderTotal] = React.useState(0);
  const [order, setOrder] = React.useState(initialOrder);
  const [successMessage, setSuccessMessage] = React.useState('');
  const form = React.useRef();

  const validationSchema = Yup.object({
    blueberryMintSM: Yup.string(),
    blueberryMintLG: Yup.string(),
    fallYallSM: Yup.string(),
    fallYallLG: Yup.string(),
    lemonGingerSM: Yup.string(),
    lemonGingerLG: Yup.string(),
    strawMerrySM: Yup.string(),
    strawMerryLG: Yup.string(),
    email: Yup.string().email('Invalid email address').required('Required'),
    phone: Yup.string(),
    name: Yup.string().required('Required'),
    address: Yup.string().required('Required'),
    taxID: Yup.string().required('Required'),
    total: Yup.string(),
  });

  const WholesaleOrderForm = () => {
    const formik = useFormik({
      initialValues: {
        blueberryMintSM: '',
        blueberryMintLG: '',
        fallYallSM: '',
        fallYallLG: '',
        lemonGingerSM: '',
        lemonGingerLG: '',
        strawMerrySM: '',
        strawMerryLG: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        taxID: '',
        total: orderTotal,
      },
      enableReinitialize: true,
      validationSchema: validationSchema,
      onSubmit: (values) => {
        const orderTotal = Object.keys(values).reduce((acc, item) => {
          if (!order[item]) {
            return acc;
          }
          return acc + order[item].price * (values[item] || 0);
        }, 0);
        send(
          'service_khybsuh',
          'template_9dizoqc',
          {
            address: values.address,
            name: values.name,
            phone: values.phone,
            email: values.email,
            blueberryMintSM: values.blueberryMintSM || 0,
            blueberryMintLG: values.blueberryMintLG || 0,
            fallYallSM: values.fallYallSM || 0,
            fallYallLG: values.fallYallLG || 0,
            lemonGingerSM: values.lemonGingerSM || 0,
            lemonGingerLG: values.lemonGingerLG || 0,
            strawMerrySM: values.strawMerrySM || 0,
            strawMerryLG: values.strawMerryLG || 0,
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
        >
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel variant='standard' htmlFor='uncontrolled-native'>
              {order[name]?.label}
            </InputLabel>
            <NativeSelect
              value={formik.values[name]}
              id={name}
              name={name}
              size={4}
              inputProps={{
                name: name,
                id: 'uncontrolled-native',
              }}
              onChange={(event) => {
                formik.handleChange(name)(event);
              }}
            >
              <option aria-label='None' value='' />
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={36}>36</option>
              <option value={48}>48</option>
            </NativeSelect>
          </FormControl>
          <DeleteForeverIcon
            variant='outlined'
            className={classes.buttonIcon}
            onClick={() => {
              formik.setFieldValue(name, '', false);
            }}
          />
        </Grid>
      );
    };

    // const total = Object.keys(formik.values).reduce((acc, item) => {
    //   if (!order[item]) {
    //     return acc;
    //   }
    //   return acc + order[item].price * (formik.values[item] || 0);
    // }, 0);

    return (
      <>
        <form onSubmit={formik.handleSubmit} ref={form}>
          <CardBody>
            <FormControl component='fieldset'>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <h2>Wholesale Order Kombucha</h2>
                </Grid>
                <Grid item xs={12}>
                  <h3>Contact us with questions regarding pricing.</h3>
                  <Button
                    variant='contained'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Email className={classes.icons} />
                    <Typography
                      variant='button'
                      style={{ fontSize: '0.69rem' }}
                    >
                      Email us dailyculturekc@gmail.com
                    </Typography>
                  </Button>
                  <h4> Give us a call: 816-419-2158</h4>
                  <h4>We will send you an invoice when the order is filled.</h4>
                </Grid>
                {flavors.map((flavor) => {
                  return dropDown(flavor);
                })}

                <Grid item>
                  <Typography variant='h5'>
                    Let's get some information for this order!
                  </Typography>
                </Grid>
                <Grid item xs={12}>
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
                <Grid item xs={12}>
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
                <Grid item xs={12}>
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
                <Grid item xs={12}>
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
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id='taxID'
                    name='taxID'
                    label='Tax ID Number or Federal ID Number...'
                    value={formik.values.taxID}
                    onChange={formik.handleChange}
                    error={formik.touched.taxID && Boolean(formik.errors.taxID)}
                    helperText={formik.touched.taxID && formik.errors.taxID}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <ReceiptIcon className={classes.inputIconsColor} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography>{successMessage}</Typography>
                  <Button
                    color='twitter'
                    variant='contained'
                    fullWidth
                    type='submit'
                    disabled={!formik.isValid}
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
          <WholesaleOrderForm />
        </div>
      </div>
    </Layout>
  );
}
