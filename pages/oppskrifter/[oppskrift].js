import { fetcher } from "lib/graphql";

import Header from "components/recipe/header";

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
    }
  }
`;

function normalise({ recipe }) {
  const { servings, intro, images, ...rest } = recipe;

  return {
    ...rest,
    intro: intro.content.json,
    servings: servings.content.number,
    images: images.content.images,
  };
}

export async function getStaticProps({ params }) {
  const path = `/oppskrifter/${params.oppskrift}`;
  const { data } = await fetcher([query, { path }]);

  return { props: { ...normalise(data) }, revalidate: 1 };
}

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

export default function Recipe({ name, images, servings }) {
  return (
    <div>
      <Header name={name} images={images} />
      Servings: {servings}
    </div>
  );
}
