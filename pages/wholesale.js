import React from 'react';
import classNames from 'classnames';
import { send } from 'emailjs-com';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Grid, Typography } from '@material-ui/core';
import NativeSelect from '@mui/material/NativeSelect';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Phone from '@material-ui/icons/Phone';

// @material-ui/icons
import Check from '@material-ui/icons/Check';
import Home from '@material-ui/icons/Home';
import Favorite from '@material-ui/icons/Favorite';
import Email from '@material-ui/icons/Email';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BusinessIcon from '@mui/icons-material/Business';
import IconButton from '@mui/material/IconButton';
import Divider from '@material-ui/core/Divider';

// core components
import SnackbarContent from '../components/Snackbar/SnackbarContent';
import Layout from '../components/layout';
import CardBody from 'components/Card/CardBody.js';

import Button from 'components/CustomButtons/Button.js';
import ErrorComponent from '../components/ErrorComponent';

import styles from '../styles/jss/nextjs-material-kit/pages/componentsSections/typographyStyle';
import componentStyles from '../styles/jss/nextjs-material-kit/pages/components';

const useStyles = makeStyles(styles);
const useComponentStyles = makeStyles(componentStyles);

export default function Order() {
  const classes = useStyles();
  const componentClasses = useComponentStyles();

  const [flavorCatalog, setFlavorCatalog] = React.useState([]);
  const [locationID, setLocationID] = React.useState(null);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [loadingOpen, setLoadingOpen] = React.useState(false);
  const [kegFlavors, setKegFlavors] = React.useState([]);
  const [canFlavors, setCanFlavors] = React.useState([]);
  const [bottleFlavors, setBottleFlavors] = React.useState([]);
  const [error, setError] = React.useState(false);
  const [invoiceUrl, setInvoiceUrl] = React.useState('');

  const createInvoice = async (values) => {
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
          quantity: `${values[flavor.name]}`,
          basePriceMoney: { amount: parseInt(flavor.price), currency: 'USD' },
          catalogObjectId: flavor.id,
        },
      ];
    }, []);

    const body = JSON.stringify({
      locationID,
      order,
      email: values.email,
      company: values.company,
      phone: values.phone,
      address: values.address,
      name: values.name,
      taxID: values.taxID,
    });

    setLoadingOpen(true);
    setSuccessOpen(false);
    setInvoiceUrl('');
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });

    const paymentResponse = await fetch('/api/invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    setLoadingOpen(false);

    if (paymentResponse.ok) {
      setSuccessOpen(true);
      return paymentResponse.json();
    }

    const errorBody = await paymentResponse.text();
    throw new Error(errorBody);
  };

  const getCatalog = async () => {
    const result = await fetch('/api/wholesale-catalog', {
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
    if (!flavors) {
      setError(true);
      return;
    }
    setLocationID(flavors.locationID);
    setFlavorCatalog(flavors.catalog);
    const kegFlavors = flavors.catalog.reduce((acc, flavor) => {
      if (flavor.name.includes('KEG')) {
        return [...acc, flavor];
      }
      return acc;
    }, []);

    const canFlavors = flavors.catalog.reduce((acc, flavor) => {
      if (flavor.name.toLowerCase().includes('cans')) {
        return [...acc, flavor];
      }
      return acc;
    }, []);

    const bottleFlavors = flavors.catalog.reduce((acc, flavor) => {
      if (flavor.name.includes('bottles')) {
        return [...acc, flavor];
      }
      return acc;
    }, []);

    setCanFlavors(canFlavors);
    setKegFlavors(kegFlavors);
    setBottleFlavors(bottleFlavors);
  }, []);

  const form = React.useRef();

  const initialFlavorsSchema = flavorCatalog.reduce((acc, flavor) => {
    return { ...acc, [flavor.name]: Yup.string() };
  }, {});

  const validationSchema = Yup.object({
    ...initialFlavorsSchema,
    email: Yup.string().email('Invalid email address').required('Required'),
    phone: Yup.string(),
    name: Yup.string().required('Required'),
    address: Yup.string(),
    taxID: Yup.string(),
    company: Yup.string().required('Required'),
    total: Yup.string(),
  });

  const initialFlavors = flavorCatalog.reduce((acc, flavor) => {
    return { ...acc, [flavor.name]: '' };
  }, {});

  const WholesaleOrderForm = () => {
    const formik = useFormik({
      initialValues: {
        ...initialFlavors,
        name: '',
        email: '',
        phone: '',
        address: '',
        taxID: '',
        total: 0,
        company: '',
      },
      enableReinitialize: true,
      validationSchema: validationSchema,
      onSubmit: async (values) => {
        const paymentResult = await createInvoice(values);
        setInvoiceUrl(paymentResult.invoiceUrl);
      },
    });

    const dropDown = (name, description, outOfStock) => {
      const options = name.includes('KEG') ? (
        <>
          <option aria-label='None' value='' />
          <option value={1}>1 keg</option>
          <option value={2}>2 kegs</option>
          <option value={3}>3 kegs</option>
          <option value={4}>4 kegs</option>
        </>
      ) : name.toLowerCase().includes('cans') ? (
        <>
          <option aria-label='None' value='' />
          <option value={1}>1 flat (24 cans)</option>
          <option value={2}>2 flats (48 cans)</option>
          <option value={3}>3 flats (72 cans)</option>
          <option value={4}>4 flats (96 cans)</option>
        </>
      ) : (
        <>
          <option aria-label='None' value='' />
          <option value={12}>12 - 16 oz bottles</option>
          <option value={24}>24 - 16 oz bottles</option>
          <option value={36}>36 - 16 oz bottles</option>
          <option value={48}>48 - 16 oz bottles</option>
        </>
      );

      return (
        <Grid
          item
          xs={12}
          md={4}
          key={name}
          style={{ display: 'inline-flex', alignItems: 'center' }}
        >
          <FormControl fullWidth>
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
              {options}
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

    return (
      <>
        <form onSubmit={formik.handleSubmit} ref={form}>
          <CardBody>
            {successOpen && (
              <SnackbarContent
                message={
                  <>
                    <div align='center'>
                      <b>
                        KOMBUCHA ORDERED! An invoice has been emailed to you.
                      </b>
                    </div>
                    <div align='center'>
                      You can also open your invoice by CLICKING HERE. Thanks!
                    </div>
                  </>
                }
                onClick={() => window.open(invoiceUrl)}
                close
                color='success'
                icon={Check}
              />
            )}
            {loadingOpen && (
              <SnackbarContent
                message={
                  <span>
                    <b>Counting bubbles... Hang in there!</b>
                  </span>
                }
                close
                color='info'
                icon={Check}
              />
            )}
            <FormControl component='fieldset'>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography
                    variant='h4'
                    align='center'
                    style={{
                      margin: '30px 0',
                      color: '#55acee',
                    }}
                  >
                    Wholesale Order Kombucha
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body1' align='center'>
                    Contact us with questions regarding pricing.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={12} align='center'>
                  <Button
                    color='twitter'
                    variant='contained'
                    target='_blank'
                    rel='noopener noreferrer'
                    href={`mailto:dailyculturekc@gmail.com`}
                  >
                    <Email className={classes.icons} />
                    <Typography
                      variant='button'
                      style={{ fontSize: '0.69rem' }}
                    >
                      Email us dailyculturekc@gmail.com
                    </Typography>
                  </Button>
                </Grid>
                <Grid item xs={12} md={12} align='center'>
                  <Button
                    color='twitter'
                    variant='contained'
                    target='_blank'
                    rel='noopener noreferrer'
                    href='tel: 816-419-2158'
                  >
                    <Phone className={classes.icons} />
                    <Typography
                      variant='button'
                      style={{ fontSize: '0.69rem' }}
                    >
                      Call us 816-419-2158
                    </Typography>
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body1' align='center'>
                    We will send you an invoice when the order is filled and
                    ready to be delivered.
                  </Typography>
                </Grid>
                {error ? (
                  <ErrorComponent />
                ) : (
                  <>
                    <Grid item xs={12}>
                      <h3 align='center'>BY THE BOTTLE</h3>
                    </Grid>
                    {bottleFlavors?.map(({ name, description, outOfStock }) => {
                      return dropDown(name, description, outOfStock);
                    })}
                    <Divider
                      variant='fullWidth'
                      style={{
                        backgroundColor: '#55acee',
                        height: '2px',
                        margin: '30px 0',
                        width: '100%',
                      }}
                    />
                    <Grid item xs={12}>
                      <h3 align='center'>CANS</h3>
                    </Grid>
                    {canFlavors?.map(({ name, description, outOfStock }) => {
                      return dropDown(name, description, outOfStock);
                    })}
                    <Divider
                      variant='fullWidth'
                      style={{
                        backgroundColor: '#55acee',
                        height: '2px',
                        margin: '30px 0',
                        width: '100%',
                      }}
                    />
                    <Grid item xs={12}>
                      <h3 align='center'>KEGS</h3>
                    </Grid>
                    {kegFlavors?.map(({ name, description, outOfStock }) => {
                      return dropDown(name, description, outOfStock);
                    })}
                    <Divider
                      variant='fullWidth'
                      style={{
                        backgroundColor: '#55acee',
                        height: '2px',
                        margin: '30px 0',
                        width: '100%',
                      }}
                    />
                    <Grid item xs={12}>
                      <h3 align='center'>
                        Let's get some information for this order
                      </h3>
                    </Grid>
                    <Grid item xs={12} md={4} key={'name'}>
                      <TextField
                        required
                        fullWidth
                        id='name'
                        name='name'
                        label='Contact Name'
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.name && Boolean(formik.errors.name)
                        }
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
                    <Grid item xs={12} md={4} key={'company'}>
                      <TextField
                        required
                        fullWidth
                        id='company'
                        name='company'
                        label='Company'
                        value={formik.values.company}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.company &&
                          Boolean(formik.errors.company)
                        }
                        helperText={
                          formik.touched.company && formik.errors.company
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <BusinessIcon
                                className={classes.inputIconsColor}
                              />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4} key={'email'}>
                      <TextField
                        required
                        fullWidth
                        id='email'
                        name='email'
                        label='Email'
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.email && Boolean(formik.errors.email)
                        }
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
                    <Grid item xs={12} md={4} key={'address'}>
                      <TextField
                        fullWidth
                        id='address'
                        name='address'
                        label='Address - (optional)'
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.address &&
                          Boolean(formik.errors.address)
                        }
                        helperText={
                          formik.touched.address && formik.errors.address
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <Home className={classes.inputIconsColor} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4} key={'phone'}>
                      <TextField
                        fullWidth
                        id='phone'
                        name='phone'
                        label='Phone - (optional)'
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.phone && Boolean(formik.errors.phone)
                        }
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

                    <Grid item xs={12} md={4} key={'taxID'}>
                      <TextField
                        fullWidth
                        id='taxID'
                        name='taxID'
                        label='Tax ID Number (optional)'
                        value={formik.values.taxID}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.taxID && Boolean(formik.errors.taxID)
                        }
                        helperText={formik.touched.taxID && formik.errors.taxID}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <ReceiptIcon
                                className={classes.inputIconsColor}
                              />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} key={'success'}>
                      <Button
                        color='twitter'
                        variant='contained'
                        fullWidth
                        type='submit'
                        disabled={!formik.isValid}
                      >
                        Submit
                      </Button>
                    </Grid>
                  </>
                )}
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
