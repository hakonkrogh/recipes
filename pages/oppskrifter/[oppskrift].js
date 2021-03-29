import { Image } from "@crystallize/react-image";
import CrystallizeContent from "@crystallize/content-transformer/react";
import { fetcher } from "lib/graphql";
import Section from "components/story/section";
import FeaturedProducts from "components/story/featured-products";
import Layout from "components/layout";
import Meta from "components/meta";
import {
  Outer,
  ScrollWrapper,
  Title,
  Byline,
  Content,
  ContentInner,
  Lead,
  Author,
  AuthorName,
  AuthorRole,
  AuthorPhoto,
  SectionHeading,
} from "components/story/styles";

const query = `
  query GET_RECIPE($path: String!) {
    recipe: catalogue(path: $path, language: "no") {
      name
    }
  }
`;

export async function getStaticProps({ params }) {
  const path = `/oppskrifter/${params.oppskrift}`;
  const { data } = await fetcher([query, { path }]);

  return { props: { ...data }, revalidate: 1 };
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

export default function Recipe({ recipe }) {
  return recipe.name;
}
