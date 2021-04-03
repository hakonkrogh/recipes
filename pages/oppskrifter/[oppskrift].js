import { fetcher } from "lib/graphql";

import Header from "components/recipe/header";
import { useState } from "react";
import Ingredients from "components/recipe/ingredients";
import Instructions from "components/recipe/instructions";

export async function getStaticPaths() {
  const data = await fetcher(`
    {
      catalogue(path: "/oppskrifter", language: "no") {
        children {
          path
        }
      }
    }
  `);

  return {
    paths: data?.data?.catalogue?.children?.map((c) => c.path) || [],
    fallback: "blocking",
  };
}

const query = `
  query GET_RECIPE($path: String!) {
    recipe: catalogue(path: $path, language: "no") {
      name

      images: component(id: "images") {
        content {
          ... on ImageContent {
            images {
              url
              altText
              variants {
                url
                width
                height
              }
            }
          }
        }
      }

      intro: component(id: "intro") {
        content {
          ... on RichTextContent {
            json
          }
        }
      }

      servings: component(id: "servings") {
        content {
          ... on NumericContent {
            number
          }
        }
      }
      instructions: component(id: "instructions") {
        content {
          ... on ContentChunkContent {
            chunks {
              id,
              name
              content {
                ... on SingleLineContent {
                  text
                }
                ... on RichTextContent {
                  json
                }
                ... on NumericContent {
                  number
                  unit
                }
                ... on ItemRelationsContent {
                  ...relatedItemContent
                }
              }
            }
          }
        }
      }
    }
  }

  fragment relatedItemContent on ItemRelationsContent {
    items {
      id
      name
      path
      ... on Product {
        defaultVariant {
          images {
            url
            altText
            variants {
              url
              width
              height
            }
          }
        }
      }
    }
  }
`;

function normalise({ recipe }) {
  const { servings, intro, images, instructions, ...rest } = recipe;

  function getIngredients() {
    const ingredients = [];

    instructions.content.chunks.forEach((chunk) => {
      const ingredient = chunk.find((c) => c.id === "ingredient")?.content
        ?.items?.[0];
      if (ingredient) {
        const amount = chunk.find((c) => c.id === "ingredient-amount")?.content;

        const existing = ingredients.find((i) => i.id === ingredient.id);

        if (existing) {
          existing.amounts.push(amount);
        } else {
          ingredients.push({
            ...ingredient,
            amounts: [amount],
          });
        }
      }
    });

    return ingredients;
  }

  return {
    ...rest,
    intro: intro.content.json,
    baseServings: servings.content.number,
    images: images.content.images,
    ingredients: getIngredients(),
    instructions: instructions.content.chunks.map((chunk) => {
      const find = (id) => chunk.find((i) => i.id === id);
      return {
        title: find("title")?.content?.text ?? null,
        body: find("body")?.content.json ?? null,
        equipment: find("equipment")?.content?.items ?? null,
        ingredient: find("ingredient")?.content?.items?.[0] ?? null,
        "ingredient-amount": find("ingredient-amount")?.content ?? null,
        "prep-time": find("prep-time")?.content ?? null,
        "cook-time": find("cook-time")?.content ?? null,
      };
    }),
  };
}

export async function getStaticProps({ params }) {
  const path = `/oppskrifter/${params.oppskrift}`;
  const { data } = await fetcher([query, { path }]);

  return { props: { ...normalise(data) }, revalidate: 1 };
}

export default function Recipe({
  name,
  images,
  baseServings,
  ingredients,
  instructions,
}) {
  const [servings, setServings] = useState(baseServings);

  return (
    <div>
      <Header
        name={name}
        images={images}
        servings={servings}
        setServings={setServings}
      />
      <Ingredients
        ingredients={ingredients}
        servings={servings}
        baseServings={baseServings}
      />
      <Instructions
        instructions={instructions}
        servings={servings}
        baseServings={baseServings}
      />
    </div>
  );
}
