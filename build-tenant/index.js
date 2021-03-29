require("dotenv-flow").config();

const fetch = require("node-fetch");
const xml2js = require("xml2js");
const {
  componentTypes,
  shapeTypes,
  buildCreateShapeMutation,
  buildCreateItemMutation,
  ItemType,
} = require("@crystallize/import-utilities");
const WebAutoExtractor = require("web-auto-extractor").default;

const { simpleCrystallizeFetch } = require("./utils");
const uploadImage = require("./image-upload");

let TENANT_ID;
let rootItemId;
let vatTypeId;
let fails = 0;

const { NEXT_PUBLIC_CRYSTALLIZE_TENANT_IDENTIFIER } = process.env;

async function getUrlsFromSitemap(url) {
  const xml = await fetch(url).then((r) => r.text());

  const json = await xml2js.parseStringPromise(xml);

  return json.urlset.url
    .map((entry) => ({
      url: entry.loc[0],
      path: entry.loc[0].replace("https://meny.no/", ""),
    }))
    .map((u) => {
      const parts = u.path.split("/");
      const parentPath = parts.slice(0, -1).join("/");

      return {
        ...u,
        parts,
        parentPath,
      };
    });
}

async function getTenantIdFromIdentifier() {
  const r = await simpleCrystallizeFetch({
    uri: `https://api-dev.crystallize.digital/${NEXT_PUBLIC_CRYSTALLIZE_TENANT_IDENTIFIER}/catalogue`,
    query: `
      {
        tenant {
          id
        }
      }
    `,
  });

  return r.data.tenant.id;
}

async function getIdForPath(path) {
  const r = await simpleCrystallizeFetch({
    uri: `https://api-dev.crystallize.digital/${NEXT_PUBLIC_CRYSTALLIZE_TENANT_IDENTIFIER}/catalogue`,
    query: `
      {
        catalogue(path: "${path}", language: "no") {
          id
        }
      }
    `,
  });
  console.log(`{
    catalogue(path: "${path}", language: "no") {
      id
    }
  }`);

  return r.data.catalogue.id;
}

async function getTenantDetails() {
  const r = await simpleCrystallizeFetch({
    query: `
      {
        tenant {
          get(id:"${TENANT_ID}") {
            rootItemId
            vatTypes {
              id
            }
          }
        }
      }
    `,
  });

  return r.data.tenant.get;
}

async function createShapes() {
  const numericIngredientAmountConfig = {
    decimalPlaces: 2,
    units: [
      "dl",
      "l",
      "ml",
      "gram",
      "kg",
      "tbsp",
      "tsp",
      "units",
      "cloves",
      "pounds",
      "ounces",
      "cups",
    ],
  };

  const Grocery = {
    tenantId: TENANT_ID,
    name: "Grocery",
    identifier: "grocery",
    type: shapeTypes.product,
    components: [
      {
        id: "images",
        name: "Images",
        type: componentTypes.images,
      },
      {
        id: "replacement-ingredient",
        name: "Replacement ingredient",
        type: componentTypes.contentChunk,
        config: {
          contentChunk: {
            components: [
              {
                id: "ingredient",
                name: "Ingredient",
                type: componentTypes.itemRelations,
              },
              {
                id: "original-amount",
                name: "Original amount",
                type: componentTypes.numeric,
                config: {
                  numeric: numericIngredientAmountConfig,
                },
              },
              {
                id: "replacement-amount",
                name: "Replacement amount",
                type: componentTypes.numeric,
                config: {
                  numeric: numericIngredientAmountConfig,
                },
              },
            ],
          },
        },
      },
      {
        id: "webshop-urls",
        name: "Webshop URLs",
        type: componentTypes.contentChunk,
        config: {
          contentChunk: {
            repeatable: true,
            components: [
              {
                id: "url",
                name: "URL",
                type: componentTypes.singleLine,
              },
            ],
          },
        },
      },
    ],
  };

  const Folder = {
    tenantId: TENANT_ID,
    name: "Folder",
    identifier: "folder",
    type: shapeTypes.folder,
    components: [],
  };

  const Recipe = {
    tenantId: TENANT_ID,
    name: "Recipe",
    identifier: "recipe",
    type: shapeTypes.document,
    components: [
      {
        id: "images",
        name: "Images",
        type: componentTypes.images,
      },
      {
        id: "intro",
        name: "Intro",
        type: componentTypes.richText,
      },
      {
        id: "servings",
        name: "Servings",
        type: componentTypes.numeric,
        config: {
          numeric: {
            decimalPlaces: 0,
            units: [],
          },
        },
      },
      {
        id: "instructions",
        name: "Instructions",
        type: componentTypes.contentChunk,
        config: {
          contentChunk: {
            repeatable: true,
            components: [
              {
                id: "title",
                name: "Title",
                type: componentTypes.singleLine,
              },
              {
                id: "body",
                name: "Body",
                type: componentTypes.richText,
              },
              {
                id: "equipment",
                name: "Equipment",
                type: componentTypes.itemRelations,
              },
              {
                id: "ingredient",
                name: "Ingredient",
                type: componentTypes.itemRelations,
              },
              {
                id: "ingredient-amount",
                name: "Ingredient amount",
                type: componentTypes.numeric,
                config: {
                  numeric: numericIngredientAmountConfig,
                },
              },
              {
                id: "prep-time",
                name: "Prep time",
                type: componentTypes.numeric,
                config: {
                  numeric: {
                    decimalPlaces: 0,
                    units: ["minutes", "hours"],
                  },
                },
              },
              {
                id: "cook-time",
                name: "Cook time",
                type: componentTypes.numeric,
                config: {
                  numeric: {
                    decimalPlaces: 0,
                    units: ["minutes", "hours"],
                  },
                },
              },
            ],
          },
        },
      },
    ],
  };

  const shapesToInject = [/*Folder, Grocery,*/ Recipe];

  for (let i = 0; i < shapesToInject.length; i++) {
    const mutation = buildCreateShapeMutation(shapesToInject[i]);
    const response = await simpleCrystallizeFetch({ query: mutation });
    const { errors } = response;
    if (errors) {
      console.log("\x1b[31m", `${shapesToInject[i].name} failed,`);

      for (let i = 0; i < errors.length; i++) {
        console.log("\x1b[37m", `-${errors[i].message}`);
        fails++;
      }
    } else {
      console.log(
        "\x1b[32m",
        `${shapesToInject[i].name} successfully imported`
      );
    }
  }
}

const categoryMap = new Map();

// const categoryUrls = await getUrlsFromSitemap(
//   "https://meny.no/productcategories-sitemap.xml"
// );

// console.log(`Found ${categoryUrls.length} categories`);

// for (let i = 0; i < categoryUrls.length; i++) {
//   await createCategoryAndParents(categoryUrls[i]);
// }

async function createAscendentFolders(parts) {
  for (let i = 0; i < parts.length; i++) {
    const path = parts.slice(0, i + 1).join("/");

    let parentId = categoryMap.get(path);
    if (!parentId) {
      await createCategory(path);
    }
  }

  async function createCategory(path) {
    const parts = path.split("/");

    const parentPath = parts.slice(0, -1).join("/");
    let parentId = categoryMap.get(parentPath);
    if (!parentId) {
      throw new Error(`Cannot create category "${path}" without parentId`);
    }

    const nameLower = decodeURIComponent(parts[parts.length - 1]);
    const name = nameLower[0].toUpperCase() + nameLower.substring(1);

    const mutation = buildCreateItemMutation(
      {
        tenantId: TENANT_ID,
        name,
        shapeIdentifier: "folder",
        tree: {
          parentId,
        },
      },
      ItemType.Folder,
      "no"
    );

    const response = await simpleCrystallizeFetch({ query: mutation });
    const { errors } = response;
    if (errors) {
      console.log("\x1b[31m", `${path} failed,`);

      for (let i = 0; i < errors.length; i++) {
        console.log("\x1b[37m", `-${errors[i].message}`);
        fails++;
      }
    } else {
      console.log("\x1b[32m", `folder:  ${path} successfully imported`);
      categoryMap.set(path, response.data[ItemType.Folder].create.id);
    }
  }
}

async function createProducts() {
  const products = await getUrlsFromSitemap(
    "https://meny.no/products-sitemap.xml"
  );

  for (let i = 0; i < products.length; i++) {
    await createProduct(products[i]);
  }

  async function createProduct({ url, path, parentPath }) {
    await createAscendentFolders(parentPath.split("/"));

    const parentId = categoryMap.get(parentPath);
    // const parentId = categoryMap.get("");

    if (!parentId) {
      fails++;
      console.log("\x1b[31m", `${url} failed, no parent path found`);
      return;
    }

    try {
      const html = await fetch(url).then((r) => r.text());
      const { name, sku, offers, image } = WebAutoExtractor().parse(
        html
      ).jsonld.product[0];
      const [imageUrl] = image;
      const imageUrlParts = imageUrl.split("/");
      const filename = imageUrlParts[imageUrlParts.length - 1];

      // Download image
      const imageBuffer = await fetch(imageUrl).then((r) => r.buffer());

      // Upload to S3
      const uploadResult = await uploadImage({
        tenantId: TENANT_ID,
        file: imageBuffer,
        filename,
      });

      const mutation = buildCreateItemMutation(
        {
          tenantId: TENANT_ID,
          name,
          shapeIdentifier: "grocery",
          tree: {
            parentId,
          },
          vatTypeId,
          variants: [
            {
              name,
              sku,
              images: [uploadResult],
              price: parseFloat(offers.price, 10),
              isDefault: true,
            },
          ],
        },
        ItemType.Product,
        "no"
      );

      const response = await simpleCrystallizeFetch({ query: mutation });
      const { errors } = response;
      if (errors) {
        console.log("\x1b[31m", `${path} failed,`);

        for (let i = 0; i < errors.length; i++) {
          console.log("\x1b[37m", `-${errors[i].message}`);
          fails++;
        }
      } else {
        console.log("\x1b[32m", `product: ${path}`);
      }
    } catch (e) {
      console.log(e);
      fails++;
    }
  }
}

(async function run() {
  TENANT_ID = await getTenantIdFromIdentifier();
  const tenantDetails = await getTenantDetails();
  rootItemId = tenantDetails.rootItemId;
  vatTypeId = tenantDetails.vatTypes[0].id;

  categoryMap.set("", rootItemId);

  // Todo: create "no" language
  // Todo: create "no" price variant

  await createShapes();
  // await createProducts();

  console.log(
    fails > 0 ? "\x1b[31m" : "\x1b[32m",
    `Import completed with ${fails} errors`
  );
})();
