import styled from "styled-components";

import Meta from "components/meta";
import Layout from "components/layout";
import { fetcher } from "lib/graphql";
import RecipeCard from "components/recipe-card";

const Outer = styled.div`
  background: #fff;
  min-height: 100vh;
  --recipe-image-height: 300px;
  padding: 2rem;
`;

const query = `
  {
    catalogue(path: "/oppskrifter", language: "no") {
      recipes: children {
        id
        name
        path
        images: component(id: "images") {
          content {
            ... on ImageContent {
              firstImage {
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
    }
  }
`;

export async function getStaticProps() {
  const { data } = await fetcher(query);

  return { props: { ...data }, revalidate: 1 };
}

export default function Home({ catalogue }) {
  const meta = {
    description: "Mine oppskrifter, enkle og smakfulle",
    type: "website",
  };

  return (
    <>
      <Meta {...meta} />
      <Layout tint="black">
        <Outer>
          {catalogue.recipes.map((recipe) => (
            <RecipeCard key={recipe.id} {...recipe} />
          ))}
        </Outer>
      </Layout>
    </>
  );
}
