import styled from "styled-components";

import Ingredient from "components/recipe/ingredient";

const Outer = styled.div`
  margin: 2rem 0;

  h2 {
    margin: 0 var(--spacing-x) 1rem;
  }
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid #eee;

  > li {
    display: block;
    border-bottom: 1px solid #eee;
    padding: 1rem var(--spacing-x);
    margin: 0;
  }
`;

export default function Ingredients({ ingredients, servings, baseServings }) {
  return (
    <Outer>
      <h2>Ingredienser</h2>
      <List>
        {ingredients.map((i) => (
          <li key={i.id}>
            <Ingredient
              ingredient={i}
              baseServings={baseServings}
              servings={servings}
            />
          </li>
        ))}
      </List>
    </Outer>
  );
}
