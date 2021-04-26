import Link from "next/link";
import styled from "styled-components";
import { Image } from "@crystallize/react-image";

const Outer = styled.div`
  > a {
    display: block;
    position: relative;
    border-radius: 15px;
    overflow: hidden;
  }
`;

const ImageWrap = styled.div`
  position: relative;
  z-index: 1;

  img {
    width: 100%;
    height: auto;
    height: var(--recipe-image-height);
  }
`;

const NameBackdrop = styled.div`
  position: absolute;
  z-index: 2;
  left: 0;
  bottom: 0;
  height: 50%;
  width: 100%;
  background: linear-gradient(#fff0, #000b);
`;

const Name = styled.h2`
  position: absolute;
  z-index: 3;
  left: 0;
  bottom: 0;
  width: 100%;
  color: #fff;
  text-align: center;
  padding: 1.5em 3em;
  margin: 0;
  text-transform: uppercase;
`;

export default function RecipeCard({ path, images, name }) {
  const image = images?.content?.firstImage;
  if (!image) {
    return null;
  }

  return (
    <Outer>
      <Link href={path}>
        <a>
          <ImageWrap>
            <Image {...image} />
          </ImageWrap>

          <NameBackdrop />
          <Name>{name}</Name>
        </a>
      </Link>
    </Outer>
  );
}
