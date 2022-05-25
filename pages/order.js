import React from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import Image from 'next/image';
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
import Divider from '@material-ui/core/Divider';

// @material-ui/icons
import Phone from '@material-ui/icons/Phone';
import Check from '@material-ui/icons/Check';
import Email from '@material-ui/icons/Email';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import IconButton from '@mui/material/IconButton';

// core components
import SnackbarContent from 'components/Snackbar/SnackbarContent.js';
import Layout from '../components/layout';
import CardBody from '../components/Card/CardBody';
import Button from '../components/CustomButtons/Button';
import ErrorComponent from '../components/ErrorComponent';

import styles from '../styles/jss/nextjs-material-kit/pages/componentsSections/typographyStyle';
import componentStyles from '../styles/jss/nextjs-material-kit/pages/components';

const useStyles = makeStyles(styles);
const useComponentStyles = makeStyles(componentStyles);

// phone regex
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const minOrder = 30;

export default function Order() {
  const classes = useStyles();
  const componentClasses = useComponentStyles();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [savingOrder, setSavingOrder] = React.useState(false);
  const [error, setError] = React.useState(false);

  const { transactionId } = router.query;

  React.useEffect(() => {
    if (transactionId) {
      setOpen(true);
    }
  }, []);

  const [flavorCatalog, setFlavorCatalog] = React.useState({
    flavors: [],
    limited: [],
    canFlavors: [],
  });

  const [loading, setLoading] = React.useState(false);

  const { flavors, limited, canFlavors } = flavorCatalog;
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
    setLoading(true);
    const flavors = await getCatalog();
    if (!flavors) {
      setError(true);
      return;
    }
    const sortedFlavors = flavors.catalog.sort((a, b) =>
      a.name > b.name ? 1 : -1
    );

    const sortedLimitedFlavors = flavors.limited.sort((a, b) =>
      a.name > b.name ? 1 : -1
    );

    const canFlavors = sortedFlavors.catalog.reduce((acc, flavor) => {
      if (flavor?.description?.toLowerCase().includes('cans')) {
        return [...acc, flavor];
      }
      return acc;
    }, []);

    const bottleFlavors = sortedFlavors.reduce((acc, flavor) => {
      if (
        flavor?.name?.toLowerCase().includes('oz') ||
        flavor?.name?.toLowerCase().includes('delivery')
      ) {
        return [...acc, flavor];
      }
      return acc;
    }, []);

    setFlavorCatalog({
      canFlavors,
      flavors: bottleFlavors,
      limited: sortedLimitedFlavors,
    });
    setLoading(false);
    setLocationID(flavors.location.id);
  }, []);

  const form = React.useRef();

  const initialFlavorsSchema = flavors.reduce((acc, flavor) => {
    return { ...acc, [flavor.name]: Yup.string() };
  }, {});

  const validationSchema = Yup.object({
    ...initialFlavorsSchema,
    email: Yup.string().email('Invalid email address').required('Required'),
    phone: Yup.string(),
    total: Yup.string(),
  });

  const initialFlavors = flavors.reduce((acc, flavor) => {
    if (flavor.name === 'Delivery') {
      return { ...acc, [flavor.name]: '1' };
    }
    return { ...acc, [flavor.name]: '' };
  }, {});

  const OrderForm = () => {
    const formik = useFormik({
      initialValues: {
        ...initialFlavors,
        email: '',
        phone: '',
        total: 0,
      },
      enableReinitialize: true,
      validationSchema: validationSchema,
      onSubmit: async (values) => {
        formik.setSubmitting(true);

        const paymentResult = await createPayment(values);
        router.push(paymentResult.checkoutPageUrl);
      },
    });

    const dropDown = (name, description, outOfStock, imageUrl, price) => {
      if (name === 'Delivery') {
        return;
      }
      return (
        <Grid
          item
          xs={12}
          md={6}
          style={{ display: 'inline-flex', alignItems: 'center' }}
          key={name}
        >
          <div style={{ paddingRight: '10px' }}>
            <Image
              src={imageUrl ? imageUrl : '/img/Bottles-in-fridge.jpg'}
              alt='liquid gold'
              width={75}
              height={75}
            />
          </div>
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel variant='standard' htmlFor='uncontrolled-native'>
              {outOfStock ? 'SOLD OUT ' : name}
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
            <FormHelperText>
              {description} - ${(price / 100).toFixed(2)}
            </FormHelperText>
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
      const indexOfFlavor = flavors.indexOf(
        flavors.find((flavor) => flavor.name === item)
      );
      if (indexOfFlavor < 0) {
        return acc;
      }
      return (
        acc + (flavors[indexOfFlavor].price / 100) * (formik.values[item] || 0)
      );
    }, 0);

    const limitedTotal = Object.keys(formik.values).reduce((acc, item) => {
      const indexOfFlavor = limited.indexOf(
        limited.find((flavor) => flavor.name === item)
      );
      if (indexOfFlavor < 0) {
        return acc;
      }
      return (
        acc + (limited[indexOfFlavor].price / 100) * (formik.values[item] || 0)
      );
    }, 0);

    const canTotal = Object.keys(formik.values).reduce((acc, item) => {
      const indexOfFlavor = canFlavors.indexOf(
        canFlavors.find((flavor) => flavor.name === item)
      );
      if (indexOfFlavor < 0) {
        return acc;
      }
      return (
        acc +
        (canFlavors[indexOfFlavor].price / 100) * (formik.values[item] || 0)
      );
    }, 0);

    const grandTotal = total + limitedTotal + canTotal;

    const isOrderMinMet = grandTotal < minOrder;

    const currentOrder = (name, price) => {
      const quantity = formik.values[name];
      if (quantity > 0) {
        return (
          <Typography variant='body2'>
            {quantity} - {name} - ${(quantity * (price / 100)).toFixed(2)}
          </Typography>
        );
      }
    };

    // Call this function to send a payment token, buyer name, and other details
    // to the project server code so that a payment can be created with
    // Payments API
    const createPayment = async (values) => {
      const order = flavors.reduce((acc, flavor) => {
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

      const limitedOrder = limited.reduce((acc, flavor) => {
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

      const canOrder = canFlavors.reduce((acc, flavor) => {
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
        order: [...limitedOrder, ...canOrder, ...order],
        total:
          grandTotal * 100 -
          flavors[
            flavors.indexOf(
              flavors.find((flavor) => flavor.name === 'Delivery')
            )
          ].price,
        email: values.email,
        phone: values.phone,
        basePath: window.location.origin,
      });

      setSavingOrder(true);
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });

      const paymentResponse = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      setSavingOrder(false);

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
                <b>KOMBUCHA ORDERED! Thanks!</b>
              </span>
            }
            close
            color='success'
            icon={Check}
          />
        )}
        {savingOrder && (
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
        <form onSubmit={formik.handleSubmit} ref={form}>
          <CardBody>
            <FormControl component='fieldset'>
              <Grid item xs={12}>
                <Typography
                  variant='h4'
                  align='center'
                  style={{
                    margin: '30px 0',
                    color: '#55acee',
                  }}
                >
                  Order Kombucha
                </Typography>
              </Grid>
              {error ? (
                <ErrorComponent />
              ) : (
                <>
                  <Grid container spacing={3}>
                    <Grid item xs={12} key={'bottle info'}>
                      <Typography variant='h5' align='center'>
                        BOTTLES
                      </Typography>
                    </Grid>
                    {loading ? (
                      <Grid item xs={12} key={'loading info'}>
                        <Typography variant='body1' align='center'>
                          Checking the fridge...
                        </Typography>
                      </Grid>
                    ) : (
                      flavors.map(
                        ({
                          name,
                          description,
                          outOfStock,
                          imageUrl,
                          price,
                        }) => {
                          return dropDown(
                            name,
                            description,
                            outOfStock,
                            imageUrl,
                            price
                          );
                        }
                      )
                    )}
                  </Grid>
                  <Divider
                    variant='fullWidth'
                    style={{
                      backgroundColor: '#55acee',
                      height: '2px',
                      margin: '30px 0',
                    }}
                  />
                  <Grid container spacing={3}>
                    <Grid item xs={12} key={'can info'}>
                      <Typography variant='h5' align='center'>
                        CANS
                      </Typography>
                    </Grid>
                    <Grid container spacing={3}>
                      {!limited.length && (
                        <Grid item xs={12} key={'no can info'}>
                          {loading ? (
                            <Typography variant='body1' align='center'>
                              mustard, pickles, leftovers...
                            </Typography>
                          ) : (
                            <Typography variant='body1' align='center'>
                              No can flavors at this time
                            </Typography>
                          )}
                        </Grid>
                      )}
                      {canFlavors?.map(
                        ({
                          name,
                          description,
                          outOfStock,
                          imageUrl,
                          price,
                        }) => {
                          return dropDown(
                            name,
                            description,
                            outOfStock,
                            imageUrl,
                            price
                          );
                        }
                      )}
                    </Grid>
                  </Grid>
                  <Divider
                    variant='fullWidth'
                    style={{
                      backgroundColor: '#55acee',
                      height: '2px',
                      margin: '30px 0',
                    }}
                  />
                  <Grid container spacing={3}>
                    <Grid item xs={12} key={'limited info'}>
                      <Typography variant='h5' align='center'>
                        LIMITED Release
                      </Typography>
                    </Grid>
                    <Grid container spacing={3}>
                      {!limited.length && (
                        <Grid item xs={12} key={'no limited info'}>
                          {loading ? (
                            <Typography variant='body1' align='center'>
                              Deep in the fridge...
                            </Typography>
                          ) : (
                            <Typography variant='body1' align='center'>
                              No limited release flavors at this time
                            </Typography>
                          )}
                        </Grid>
                      )}
                      {limited.map(
                        ({
                          name,
                          description,
                          outOfStock,
                          imageUrl,
                          price,
                        }) => {
                          return dropDown(
                            name,
                            description,
                            outOfStock,
                            imageUrl,
                            price
                          );
                        }
                      )}
                    </Grid>
                  </Grid>
                  <Divider
                    variant='fullWidth'
                    style={{
                      backgroundColor: '#55acee',
                      height: '2px',
                      margin: '30px 0',
                    }}
                  />
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      {limited.map(({ name, price }, index) => {
                        return currentOrder(name, price, index);
                      })}
                      {canFlavors.map(({ name, price }, index) => {
                        return currentOrder(name, price, index);
                      })}
                      {flavors.map(({ name, price }, index) => {
                        return currentOrder(name, price, index);
                      })}

                      <Typography id='total' variant='h7'>
                        Total: ${grandTotal.toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              )}
              <Divider
                variant='fullWidth'
                style={{
                  backgroundColor: '#55acee',
                  height: '2px',
                  margin: '30px 0',
                }}
              />
              <Grid container spacing={3}>
                <Grid item xs={12} key={'info'}>
                  <Typography variant='body1' align='center'>
                    Let's get some information for this order!
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6} key={'email'}>
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
                <Grid item xs={12} md={6} key={'phone'}>
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
                <Grid item xs={12} key={'success'}>
                  <FormHelperText error>
                    {isOrderMinMet
                      ? `$${minOrder} minimum (add more booch!)`
                      : ''}
                  </FormHelperText>

                  <Button
                    color='twitter'
                    variant='contained'
                    fullWidth
                    type='submit'
                    disabled={!formik.isValid || isOrderMinMet}
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
