import React, { useContext } from "react";
import Buscar from "../ui/Buscar";
import Navegacion from "./Navegacion";
import Link from "next/link";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import Boton from "../ui/Boton";
import { FirebaseContext } from "@/firebase";

const ContenedorHeader = styled.div`
  max-width: 1200px;
  width: 95%;
  margin: 0 auto;
  @media (min-width: 768px) {
    display: flex;
    justify-content: space-between;
  }
`;

const Logo = styled.p`
  color: var(--naranja);
  font-size: 4rem;
  line-height: 0;
  font-weight: 700;
  font-family: "Roboto Slab", serif;
  margin-right: 2rem;
`;

const Header = () => {
  const { usuario, firebase } = useContext(FirebaseContext);

  return (
    <header
      css={css`
        border-bottom: 2px solid var(--gris3);
        padding: 1rem 0;
      `}
    >
      <ContenedorHeader>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;

            @media (min-width: 768px) {
              flex-direction: row;
            }
          `}
        >
          <Link href="/">
            <Logo>P</Logo>
          </Link>

          <Buscar />

          <Navegacion />
        </div>

        <div
          css={css`
            display: flex;
            align-items: center;
            justify-content: flex-end;
          `}
        >
          {usuario ? (
            <div
              css={css`
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 2rem;
              `}
            >
              <p
                css={css`
                  margin-right: 2rem;
                `}
              >
                Hola: {usuario.displayName}
              </p>
              <Boton onClick={() => firebase.cerrarSesion()}>Cerrar Sesión</Boton>
            </div>
          ) : (
            <div
              css={css`
                display: flex;
                flex-direction: row;
                gap: 2rem;
              `}
            >
              <Link href="/login">
                <Boton>Login</Boton>
              </Link>
              <Link href="/crear-cuenta">
                <Boton>Crear Cuenta</Boton>
              </Link>
            </div>
          )}
        </div>
      </ContenedorHeader>
    </header>
  );
};

export default Header;
