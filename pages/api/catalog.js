import { Client, Environment } from 'square';

// package.json sets NODE_ENV in its scripts
const isProduction = process.env.NODE_ENV === 'production';

const LIMITED_CATEGORY = 'limited';

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

    const individualCategory = response.result.objects.find((object) => {
      return object.categoryData && object.categoryData.name === 'individual';
    });

    const limitedCategory = response.result.objects.find((object) => {
      return (
        object.categoryData && object.categoryData.name === LIMITED_CATEGORY
      );
    });

    const individualFlavors = response.result.objects.reduce((acc, object) => {
      if (!object.itemData) {
        return acc;
      }
      if (![individualCategory.id].includes(object.itemData.categoryId)) {
        return acc;
      }

      const { isDeleted, itemData } = object;

      const newFlavors = itemData.variations.reduce(
        (accumulator, variation) => {
          accumulator.push({
            id: variation.id,
            isDeleted,
            name: `${
              variation.itemVariationData.name === 'Regular'
                ? ''
                : variation.itemVariationData.name
            } ${itemData.name}`.trim(),
            description: itemData.description,
            price: `${variation.itemVariationData.priceMoney.amount}`,
            outOfStock: variation.absentAtLocationIds
              ? variation.absentAtLocationIds.includes(location.id)
              : false,
            imageIDs: variation.itemVariationData.imageIds || null,
            limited: individualCategory.categoryData.name === LIMITED_CATEGORY,
          });
          return accumulator;
        },
        []
      );

      acc.push(...newFlavors);

      return acc;
    }, []);

    const limitedFlavors = response.result.objects.reduce((acc, object) => {
      if (!object.itemData) {
        return acc;
      }
      if (![limitedCategory.id].includes(object.itemData.categoryId)) {
        return acc;
      }

      const { isDeleted, itemData } = object;

      const newFlavors = itemData.variations.reduce(
        (accumulator, variation) => {
          accumulator.push({
            id: variation.id,
            isDeleted,
            name: `${
              variation.itemVariationData.name === 'Regular'
                ? ''
                : variation.itemVariationData.name
            } ${itemData.name}`.trim(),
            description: itemData.description,
            price: `${variation.itemVariationData.priceMoney.amount}`,
            outOfStock: variation.absentAtLocationIds
              ? variation.absentAtLocationIds.includes(location.id)
              : false,
            imageIDs: variation.itemVariationData.imageIds || null,
            limited: individualCategory.categoryData.name === LIMITED_CATEGORY,
          });
          return accumulator;
        },
        []
      );

      acc.push(...newFlavors);

      return acc;
    }, []);

    const limitedReleaseFlavors = await Promise.all(
      limitedFlavors.map(async (flavor) => {
        if (flavor.imageIDs) {
          const image = await catalogApi.retrieveCatalogObject(
            flavor.imageIDs[0],
            false
          );

          const imageUrl = image.result.object.imageData.url;
          return { ...flavor, imageUrl };
        }
        return flavor;
      })
    );

    const flavors = await Promise.all(
      individualFlavors.map(async (flavor) => {
        if (flavor.imageIDs) {
          const image = await catalogApi.retrieveCatalogObject(
            flavor.imageIDs[0],
            false
          );

          const imageUrl = image.result.object.imageData.url;
          return { ...flavor, imageUrl };
        }
        return flavor;
      })
    );

    return res.status(200).send({
      location,
      catalog: flavors,
      limited: limitedReleaseFlavors,
    });
  } catch (error) {
    console.log(error);
  }
};
