import styled from "styled-components";
import { Image } from "@crystallize/react-image";

const Outer = styled.header`
  h1 {
    margin: 2rem 3rem;
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
    height: 300px;
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

export default function Header({ name, images }) {
  return (
    <Outer>
      <h1>{name}</h1>
      <Images>
        {images?.map((image, index) => (
          <Image key={index} {...image} />
        ))}
      </Images>
    </Outer>
  );
}
