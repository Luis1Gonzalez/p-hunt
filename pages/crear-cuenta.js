import React, { useState } from "react";
import Router from "next/router";
import Layout from "@/components/layout/Layout";
import { css } from "@emotion/react";
import { Formulario, Campo, InputSubmit, Errores } from "@/components/ui/Formulario";

import firebase from "@/firebase";

//Validaciones
import useValidacion from "@/hooks/useValidacion";
import validarCrearCuenta from "@/validacion/validarCrearCuenta";

const STATE_INICIAL = {
  nombre: "",
  email: "",
  password: "",
};

export default function CrearCuenta() {

const [error, guardarError] = useState(false);

  const { valores, errores, handleSubmit, handleChage, handleBlur } =
    useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta);
  //El STATE_INICIAL, los pasamos al hook useValidacion

  const { nombre, email, password } = valores;

  async function crearCuenta() {
    try {
      await firebase.registrar(nombre, email, password);
      Router.push('/')
    } catch (error) {
      console.error('Hubo un error al crear el usuario', error.message);
      guardarError(error.message)
    }
  }

  return (
    <div>
      <Layout>
        <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >
            Crear Cuenta
          </h1>

          <Formulario onSubmit={handleSubmit} noValidate>
            <Campo>
              <label htmlFor="nom,bre">Nombre</label>
              <input
                type="text"
                id="nombre"
                placeholder="Tu Nombre"
                name="nombre"
                value={nombre}
                onChange={handleChage}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.nombre && <Errores>{errores.nombre}</Errores>}

            <Campo>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Tu Email"
                name="email"
                value={email}
                onChange={handleChage}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.email && <Errores>{errores.email}</Errores>}

            <Campo>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Tu Password"
                name="password"
                value={password}
                onChange={handleChage}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.password && <Errores>{errores.password}</Errores>}

            {error && <Errores>{error}</Errores>}

            <InputSubmit type="submit" value="Crear Cuenta" />
          </Formulario>
        </>
      </Layout>
    </div>
  );
}
