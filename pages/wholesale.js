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

// core components
import SnackbarContent from 'components/Snackbar/SnackbarContent.js';
import Layout from '../components/layout';
import CardBody from 'components/Card/CardBody.js';

import Button from 'components/CustomButtons/Button.js';

import styles from '../styles/jss/nextjs-material-kit/pages/componentsSections/typographyStyle';
import componentStyles from '../styles/jss/nextjs-material-kit/pages/components';

const useStyles = makeStyles(styles);
const useComponentStyles = makeStyles(componentStyles);

// phone regex
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export default function Order() {
  const classes = useStyles();
  const componentClasses = useComponentStyles();

  const [flavorCatalog, setFlavorCatalog] = React.useState([]);
  const [open, setOpen] = React.useState(false);

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
    setFlavorCatalog(flavors.catalog);
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
    address: Yup.string().required('Required'),
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
      onSubmit: (values) => {
        const flavorValues = flavorCatalog.reduce((acc, flavor) => {
          acc.push(`${values[flavor.name] || 0} - ${flavor.name}`);
          return acc;
        }, []);

        send(
          'service_khybsuh',
          'template_9dizoqc',
          {
            address: values.address,
            name: values.name,
            phone: values.phone,
            email: values.email,
            order: flavorValues,
            total,
            taxID: values.taxID,
            company: values.company,
          },
          'user_S1s9CZ9xV8Lt9QB3D5WOH'
        )
          .then((response) => {
            setOpen(true);
          })
          .catch((err) => {
            console.log('FAILED...', err);
          });
        formik.resetForm();
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth',
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
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={36}>36</option>
              <option value={48}>48</option>
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

    return (
      <>
        <form onSubmit={formik.handleSubmit} ref={form}>
          <CardBody>
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
            <FormControl component='fieldset'>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <h3>Wholesale Order Kombucha</h3>
                </Grid>
                <Grid item xs={12}>
                  <h4>Contact us with questions regarding pricing.</h4>
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
                  <h4> Call us: 816-419-2158</h4>
                  <h4>
                    We will send you an invoice when the order is filled and
                    ready to be delivered.
                  </h4>
                </Grid>
                {flavorCatalog.map(({ name, description, outOfStock }) => {
                  return dropDown(name, description, outOfStock);
                })}
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
                    label='Contact Name'
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
                <Grid item xs={12} key={'company'}>
                  <TextField
                    required
                    fullWidth
                    id='company'
                    name='company'
                    label='Company'
                    value={formik.values.company}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.company && Boolean(formik.errors.company)
                    }
                    helperText={formik.touched.company && formik.errors.company}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <BusinessIcon className={classes.inputIconsColor} />
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
                    label='Phone - (optional)'
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
                <Grid item xs={12} key={'taxID'}>
                  <TextField
                    fullWidth
                    id='taxID'
                    name='taxID'
                    label='Tax ID Number (optional)'
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
