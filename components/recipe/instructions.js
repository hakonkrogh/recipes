import styled from "styled-components";
import ContentTransformer from "@crystallize/content-transformer/react";

import Ingredient from "./ingredient";

const Outer = styled.div`
  margin-bottom: 3rem;
  margin: 0 var(--spacing-x);
`;

const InstructionItem = styled.div`
  margin-bottom: 3rem;
`;

const BodyAndIngredient = styled.div`
  display: flex;
`;

const Body = styled.div`
  flex: 0 1 65vw;
  margin-right: 2rem;
`;

export default function Instructions({ instructions, servings, baseServings }) {
  return (
    <Outer>
      <h2>Instruksjoner</h2>
      {instructions.map((instruction, index) => {
        const { title, body, ingredient } = instruction;
        return (
          <InstructionItem key={index}>
            {title && <h3>{title}</h3>}
            <BodyAndIngredient>
              <Body>{body && <ContentTransformer {...body} />}</Body>
              {ingredient && (
                <Ingredient
                  ingredient={{
                    ...ingredient,
                    amounts: [instruction["ingredient-amount"]],
                  }}
                  baseServings={baseServings}
                  servings={servings}
                  compact
                />
              )}
            </BodyAndIngredient>
          </InstructionItem>
        );
      })}
    </Outer>
  );
}
