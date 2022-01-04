import React from 'react';
import classNames from 'classnames';
import { send } from 'emailjs-com';
import { useRouter } from 'next/router';
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
import Check from '@material-ui/icons/Check';
import Home from '@material-ui/icons/Home';
import Favorite from '@material-ui/icons/Favorite';
import Email from '@material-ui/icons/Email';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import IconButton from '@mui/material/IconButton';

// core components
import SnackbarContent from 'components/Snackbar/SnackbarContent.js';
import Layout from '../components/layout';
import CardBody from '../components/Card/CardBody';
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
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const { transactionId } = router.query;

  React.useEffect(() => {
    if (transactionId) {
      setOpen(true);
    }
  }, []);

  const [flavorCatalog, setFlavorCatalog] = React.useState([]);
  const [locationID, setLocationID] = React.useState(null);

  const getCatalog = async () => {
    const result = await fetch('/api/catalog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (result.ok) {
      return result.json();
    }
  };

  React.useEffect(async () => {
    const flavors = await getCatalog();
    setFlavorCatalog(flavors.catalog);
    setLocationID(flavors.location.id);
  }, []);

  const [successMessage, setSuccessMessage] = React.useState('');
  const form = React.useRef();

  const initialFlavorsSchema = flavorCatalog.reduce((acc, flavor) => {
    return { ...acc, [flavor.name]: Yup.string() };
  }, {});

  const validationSchema = Yup.object({
    ...initialFlavorsSchema,
    email: Yup.string().email('Invalid email address').required('Required'),
    phone: Yup.string(),
    name: Yup.string().required('Required'),
    address: Yup.string().required('Required'),
    total: Yup.string(),
  });

  const initialFlavors = flavorCatalog.reduce((acc, flavor) => {
    return { ...acc, [flavor.name]: '' };
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
      onSubmit: async (values) => {
        formik.setSubmitting(true);
        const flavorValues = flavorCatalog.reduce((acc, flavor) => {
          acc.push(`${values[flavor.name] || 0} - ${flavor.name}`);
          return acc;
        }, []);

        // send email
        send(
          'service_khybsuh',
          'template_iug13b3',
          {
            address: values.address,
            name: values.name,
            phone: values.phone,
            email: values.email,
            order: flavorValues,
            total,
          },
          'user_S1s9CZ9xV8Lt9QB3D5WOH'
        )
          .then(async (response) => {
            const paymentResult = await createPayment(values);
            router.push(paymentResult.checkoutPageUrl);
          })
          .catch((err) => {
            console.log('FAILED...', err);
          });
      },
    });

    const dropDown = (name, description, outOfStock) => {
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
              {outOfStock ? 'SOLD OUT ' : ''}
              {name}
            </InputLabel>
            <NativeSelect
              value={formik.values[name]}
              id={name}
              name={name}
              disabled={outOfStock}
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
            <FormHelperText>{description}</FormHelperText>
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
      const indexOfFlavor = flavorCatalog.indexOf(
        flavorCatalog.find((flavor) => flavor.name === item)
      );
      if (indexOfFlavor < 0) {
        return acc;
      }
      return (
        acc +
        (flavorCatalog[indexOfFlavor].price / 100) * (formik.values[item] || 0)
      );
    }, 0);

    // Call this function to send a payment token, buyer name, and other details
    // to the project server code so that a payment can be created with
    // Payments API
    const createPayment = async (values) => {
      const order = flavorCatalog.reduce((acc, flavor) => {
        if (
          values[flavor.name] === '' ||
          values[flavor.name] === 0 ||
          !values[flavor.name]
        ) {
          return acc;
        }

        return [
          ...acc,
          {
            name: flavor.name,
            quantity: `${values[flavor.name]}`,
            basePriceMoney: { amount: parseInt(flavor.price), currency: 'USD' },
            id: flavor.id,
          },
        ];
      }, []);

      const body = JSON.stringify({
        locationID,
        order,
        email: values.email,
      });

      const paymentResponse = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      if (paymentResponse.ok) {
        return paymentResponse.json();
      }
      const errorBody = await paymentResponse.text();
      throw new Error(errorBody);
    };

    return (
      <>
        {open && (
          <SnackbarContent
            message={
              <span>
                <b>KOMBUCHA ORDERED!</b>
              </span>
            }
            close
            color='success'
            icon={Check}
          />
        )}
        <form onSubmit={formik.handleSubmit} ref={form}>
          <CardBody>
            <FormControl component='fieldset'>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <h3>Order Kombucha</h3>
                  <h4>$6 - 16 oz bottles</h4>
                  <h4>$10 - 32 oz bottles</h4>
                  <h4>$24 minimum order (before shipping)</h4>
                </Grid>
                {flavorCatalog.map(({ name, description, outOfStock }) => {
                  return dropDown(name, description, outOfStock);
                })}
                <Grid item xs={12}>
                  <Typography id='total' variant='h6'>
                    Total: ${total} + $5 shipping = ${total + 5}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body1'>
                    {' '}
                    We will send you an invoice to pay once we fill your order.
                  </Typography>
                </Grid>
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
                    Go to Checkout
                  </Button>
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
