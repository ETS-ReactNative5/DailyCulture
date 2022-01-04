import { ApiError, Client, Environment } from 'square';
import { v4 as uuidv4 } from 'uuid';

// package.json sets NODE_ENV in its scripts
const isProduction = process.env.NODE_ENV === 'production';

// Create an instance of the API Client
// and initialize it with the credentials
// for the Square account whose assets you want to manage
const client = new Client({
  timeout: 3000,
  environment: isProduction ? Environment.Production : Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

export default async (req, res) => {
  // Get an instance of the Square API you want call
  const { checkoutApi } = client;

  try {
    const response = await checkoutApi.createCheckout(req.body.locationID, {
      idempotencyKey: uuidv4(),
      order: {
        order: {
          locationId: req.body.locationID,
          lineItems: req.body.order,
        },
        idempotencyKey: uuidv4(),
      },
      askForShippingAddress: false,
      merchantSupportEmail: 'dailyculturekc@gmail.com',
      prePopulateBuyerEmail: req.body.email,
      // prePopulateShippingAddress: {
      //   addressLine1: req.body.values.address,
      //   addressLine2: '',
      //   locality: '',
      //   administrativeDistrictLevel1: '',
      //   postalCode: '',
      //   country: 'US',
      //   firstName: req.body.values.firstName,
      //   lastName: req.body.values.lastName,
      // },
      redirectUrl: 'https:dailyculturekombucha.com/order',
    });

    console.log(response);
    return res.status(200).send({
      checkoutID: response.result.checkout.id,
      checkoutPageUrl: response.result.checkout.checkoutPageUrl,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      console.log('There was an error in your request: ', error.errors);
    } else {
      console.log('Unexpected Error: ', error);
    }
  }
};
