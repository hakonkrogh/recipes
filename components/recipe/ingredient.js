import styled from "styled-components";
import { Image } from "@crystallize/react-image";

import Amount from "./amount";

const Outer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;

  figure {
    margin-right: 1rem;
  }

  img {
    width: 75px;
    height: 75px;
    object-fit: contain;
  }
`;

export default function Ingredient({ ingredient, baseServings, servings }) {
  return (
    <Outer>
      <Meta>
        <Image {...ingredient.defaultVariant.images[0]} sizes="100px" />
        <span>{ingredient.name}</span>
      </Meta>
      <Amount
        amounts={ingredient.amounts}
        baseServings={baseServings}
        servings={servings}
      />
    </Outer>
  );
}
