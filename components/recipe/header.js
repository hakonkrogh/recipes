import styled from "styled-components";
import { Image } from "@crystallize/react-image";

const Outer = styled.header`
  h1 {
    margin: 2rem var(--spacing-x);
    line-height: 1.2em;
  }
`;

const Images = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  scroll-behavior: smooth;

  > figure {
    flex: 0 0 80vw;
    width: 80vw;
    height: 250px;
    position: relative;

    &:not(:last-child) {
      margin-right: 2px;
    }

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
`;

const Servings = styled.div`
  margin: 2rem 0;
  display: flex;
  align-items: center;

  > label {
    flex: 1 1 auto;
    height: 2.3rem;
    line-height: 2.3rem;
    padding-left: var(--spacing-x);
  }

  > input {
    flex: 0 0 80px;
    min-width: 0;
    text-align: right;
    margin-right: var(--spacing-x);
  }
`;

export default function Header({ name, images, servings, setServings }) {
  function onServingsChange(e) {
    setServings(e.target.value);
  }

  return (
    <Outer>
      <Images>
        {images?.map((image, index) => (
          <Image key={index} {...image} />
        ))}
      </Images>
      <h1>{name}</h1>
      <Servings>
        <label htmlFor="servings">Serveringer</label>
        <input
          inputMode="numeric"
          value={servings}
          id="servings"
          onChange={onServingsChange}
        />
      </Servings>
    </Outer>
  );
}
