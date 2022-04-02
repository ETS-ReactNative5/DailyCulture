import { Client, Environment } from 'square';
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

// Get an instance of the Square API you want call
const { invoicesApi, ordersApi, customersApi } = client;

const searchCustomers = async (email, name, company) => {
  try {
    const response = await customersApi.searchCustomers({
      limit: 1,
      query: {
        filter: {
          emailAddress: {
            exact: email,
          },
        },
        sort: {
          field: 'CREATED_AT',
          order: 'ASC',
        },
      },
    });

    if (!response.result.customers) {
      const splitName = name.split(' ');
      const response = await customersApi.createCustomer({
        idempotencyKey: uuidv4(),
        givenName: splitName[0],
        familyName: splitName[1],
        emailAddress: email,
        companyName: company,
      });

      return response.result.customer;
    }

    return response.result.customers[0];
  } catch (error) {
    console.log(error);
  }
};

const createOrder = async (
  locationID,
  referenceID,
  order,
  idempotencyKey,
  customer,
  phone,
  taxID
) => {
  try {
    const response = await ordersApi.createOrder({
      order: {
        locationId: locationID,
        referenceId: referenceID,
        lineItems: order,
        fulfillments: [
          {
            type: 'SHIPMENT',
            state: 'PROPOSED',
            shipmentDetails: {
              recipient: {
                customerId: customer.id,
              },
            },
          },
        ],
        metadata: {
          phoneNumber: phone || 'not given',
          taxID: taxID || 'not given',
        },
      },
      idempotencyKey,
    });
    return response.result;
  } catch (error) {
    console.log(error);
  }
};

const createInvoice = async (order, customer) => {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);

  const { taxID, phoneNumber } = order.order.metadata;

  const taxIDandPhone = `Phone #: ${phoneNumber}. Tax ID: ${taxID}.`;

  try {
    const invoice = await invoicesApi.createInvoice({
      invoice: {
        orderId: order.order.id,
        primaryRecipient: {
          customerId: customer.id,
        },
        paymentRequests: [
          {
            requestType: 'BALANCE',
            dueDate: dueDate.toISOString().split('T')[0],
            automaticPaymentSource: 'NONE',
            reminders: [
              {
                relativeScheduledDays: -1,
                message: 'Your invoice is due tomorrow',
              },
              {
                relativeScheduledDays: 0,
                message: 'Your invoice is due today!',
              },
            ],
          },
        ],
        deliveryMethod: 'EMAIL',
        title: 'Daily Culture Kombucha',
        description: `${taxIDandPhone} \n\n Thanks for your oder!  Give us a couple days to get this filled.  We will reach out if order times are longer than usual.  We appreciate your business!`,
        acceptedPaymentMethods: {
          card: true,
          bankAccount: true,
          squareGiftCard: true,
        },
      },
      idempotencyKey: uuidv4(),
    });

    const response = await invoicesApi.publishInvoice(
      invoice.result.invoice.id,
      {
        version: invoice.result.invoice.version,
        idempotencyKey: uuidv4(),
      }
    );

    return response.result;
  } catch (error) {
    console.log(error);
  }
};

export default async (req, res) => {
  const { locationID, order, email, company, name, phone, address, taxID } =
    req.body;
  const idempotencyKey = uuidv4();
  const referenceID = `${company}-${idempotencyKey}`.substring(0, 40);
  try {
    const customer = await searchCustomers(email, name, company, address);

    const squareOrder = await createOrder(
      locationID,
      referenceID,
      order,
      idempotencyKey,
      customer,
      phone,
      taxID
    );

    const result = await createInvoice(squareOrder, customer);

    return res.status(200).send({
      invoiceUrl: result.invoice.publicUrl,
    });
  } catch (error) {
    console.log(error);
  }
};
