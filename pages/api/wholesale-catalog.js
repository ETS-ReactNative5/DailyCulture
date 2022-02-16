import { Client, Environment } from 'square';

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
  const { locationsApi, catalogApi } = client;

  //   // Call listLocations method to get all locations in this Square account
  let listLocationsResponse = await locationsApi.listLocations();

  //   // Get first location from list
  const location = listLocationsResponse.result.locations[0];

  try {
    const response = await catalogApi.listCatalog();

    const wholesaleCategory = response.result.objects.find((object) => {
      return object.categoryData && object.categoryData.name === 'wholesale';
    });

    const wholesaleFlavors = response.result.objects.reduce((acc, object) => {
      if (!object.itemData) {
        return acc;
      }
      if (object.itemData.categoryId !== wholesaleCategory.id) {
        return acc;
      }

      const { isDeleted, itemData } = object;
      acc.push({
        id: itemData.variations[0].id,
        isDeleted,
        name: itemData.name,
        description: itemData.description,
        price: `${itemData.variations[0].itemVariationData.priceMoney.amount}`,
        outOfStock: object.itemData.variations[0].absentAtLocationIds
          ? object.itemData.variations[0].absentAtLocationIds.includes(
              location.id
            )
          : false,
      });
      return acc;
    }, []);

    return res.status(200).send({
      locationID: location.id,
      catalog: wholesaleFlavors,
    });
  } catch (error) {
    console.log(error);
  }
};
