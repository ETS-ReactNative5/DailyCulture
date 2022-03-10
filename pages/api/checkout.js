import { ApiError, Client, Environment } from 'square';
import { useRouter } from 'next/router';
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

  console.log(req.body);

  try {
    const response = await checkoutApi.createCheckout(req.body.locationID, {
      idempotencyKey: uuidv4(),
      order: {
        order: {
          locationId: req.body.locationID,
          lineItems: req.body.order,
          taxes: [
            {
              name: 'Tax',
              percentage: '8.86',
              appliedMoney: {
                amount: req.body.total,
                currency: 'USD',
              },
            },
          ],
        },
        idempotencyKey: uuidv4(),
      },
      askForShippingAddress: true,
      merchantSupportEmail: 'dailyculturekc@gmail.com',
      prePopulateBuyerEmail: req.body.email,
      note: `${req.body.phone}`,
      redirectUrl: `${req.body.basePath}/order`,
    });

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
