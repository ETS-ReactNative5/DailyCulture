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
    total: Yup.string(),
  });

  const OrderForm = () => {
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
        total: orderTotal,
      },
      validationSchema: validationSchema,
      onSubmit: (values) => {
        send(
          'service_khybsuh',
          'template_iug13b3',
          {
            address: values.address,
            name: values.name,
            phone: values.phone,
            email: values.email,
            blueberryMintSM: order.blueberryMintSM.quantity,
            blueberryMintLG: order.blueberryMintLG.quantity,
            fallYallSM: order.fallYallSM.quantity,
            fallYallLG: order.fallYallLG.quantity,
            lemonGingerSM: order.lemonGingerSM.quantity,
            lemonGingerLG: order.lemonGingerLG.quantity,
            strawMerrySM: order.strawMerrySM.quantity,
            strawMerryLG: order.strawMerryLG.quantity,
            total: orderTotal,
          },
          'user_S1s9CZ9xV8Lt9QB3D5WOH'
        )
          .then((response) => {
            setOrder(initialOrder);
            setOrderTotal(0);
            toast.success('Successfully ordered!', {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
          })
          .catch((err) => {
            console.log('FAILED...', err);
          });
      },
    });

    const updateTotal = (quantity, name) => {
      const orderCopy = { ...order };
      orderCopy[name].cost = orderCopy[name].price * quantity;
      orderCopy[name].quantity = quantity;
      setOrder(orderCopy);
      setOrderTotal(
        Object.keys(order).reduce((acc, item) => {
          const newTotal = acc + order[item].cost;
          return newTotal;
        }, 0)
      );
    };

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
              id={name}
              size={4}
              inputProps={{
                name: name,
                id: 'uncontrolled-native',
              }}
              value={order[name].quantity}
              // formik.values.name}
              // onBlur={()=> formik.setFieldValue(name, order[name].quantity)}
              // order[name].quantity}
              //{formik.values[name]}
              // {formik.values.name}
              onChange={(event) => {
                // formik.handleChange(name)(event);
                updateTotal(event.target.value, name);
              }}
            >
              <option value={0}>0</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </NativeSelect>
          </FormControl>
          <DeleteForeverIcon
            variant='outlined'
            className={classes.buttonIcon}
            onClick={() => {
              updateTotal(0, name);
            }}
          />
        </Grid>
      );
    };

    return (
      <>
        <form onSubmit={formik.handleSubmit} ref={form}>
          <CardBody>
            <FormControl component='fieldset'>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <h2>Order Kombucha</h2>
                </Grid>
                {flavors.map((flavor) => {
                  return dropDown(flavor);
                })}
                <Grid item xs={12}>
                  <Typography id='total' value={orderTotal}>
                    Total: ${orderTotal}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant='h5'>
                    Let's get some information for this order! (We do not save
                    this)
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
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
                  <Button
                    color='twitter'
                    variant='contained'
                    fullWidth
                    type='submit'
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
