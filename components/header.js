import Logo from "ui/logo";
import Link from "next/link";
import styled from "styled-components";
// import { IconUser, IconSearch, IconCart } from "ui/icons";
// import { useRouter } from "next/router";
// import Search from "./search";

const Outer = styled.header`
  padding: 1em 0.5em;

  h1 {
    margin: 0;
    text-align: center;
  }

  a {
    color: inherit;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

// const Actions = styled.div`
//   display: flex;
// `;
// const ActionBtn = styled.a`
//   height: 50px;
//   width: 50px;
//   display: flex;
//   align-items: center;
//   margin: 0 3px;
//   justify-content: center;
//   border-radius: 4px;
//   cursor: pointer;
//   border: 1px solid rgba(0, 0, 0, 0);
//   &:hover {
//     border: 1px solid rgba(0, 0, 0, 0.15);
//   }
// `;

export default function Header() {
  return (
    <Outer>
      <h1>
        <Link href="/">
          <a>Håkons Oppskrifter</a>
        </Link>
      </h1>
      {/* <Actions>
        <Search>
          <ActionBtn>
            <IconSearch fill={tints[tint]} />
          </ActionBtn>
        </Search>
        <ActionBtn>
          <IconUser fill={tints[tint]} />
        </ActionBtn>
        <ActionBtn>
          <IconCart fill={tints[tint]} />
        </ActionBtn>
      </Actions> */}
    </Outer>
  );
}
