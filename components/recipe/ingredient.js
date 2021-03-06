import styled from "styled-components";
import { Image } from "@crystallize/react-image";
import is from "styled-is";

import Amount from "./amount";

const Outer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${is("$compact")`
    display: block;
    width: 75px;
    text-align: center;
    font-size: .75rem;
  `};
`;

const Meta = styled.div`
  display: flex;
  align-items: center;

  figure {
    margin-right: 1rem;
  }

  img {
    width: 50px;
    height: 50px;
    object-fit: contain;
  }

  ${is("$compact")`
    figure {
      margin-right: 0;
      margin-bottom: 15px;
    }
  `};
`;

export default function Ingredient({
  ingredient,
  baseServings,
  servings,
  compact,
  ...rest
}) {
  return (
    <Outer $compact={compact} {...rest}>
      <Meta $compact={compact}>
        <Image {...ingredient.defaultVariant.firstImage} sizes="100px" />
        {!compact && <span>{ingredient.name}</span>}
      </Meta>
      <Amount
        amounts={ingredient.amounts}
        baseServings={baseServings}
        servings={servings}
      />
    </Outer>
  );
}
