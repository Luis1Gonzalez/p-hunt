import React, { useState, useContext } from "react";
import Router, { useRouter } from "next/router";
import { collection, addDoc } from "firebase/firestore";
import Layout from "@/components/layout/Layout";
import { css } from "@emotion/react";
import {
  Formulario,
  Campo,
  InputSubmit,
  Errores,
} from "@/components/ui/Formulario";
import Error404 from "@/components/layout/404";
import { FirebaseContext } from "@/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "@firebase/storage";

//Validaciones
import useValidacion from "@/hooks/useValidacion";
import validarCrearProducto from "@/validacion/validarCrearProducto";

const STATE_INICIAL = {
  nombre: "",
  empresa: "",
  imagen: "",
  url: "",
  imagen: "",
  descripcion: "",
};

export default function NuevoProducto() {
  const [error, guardarError] = useState(false);
  // States para la subida de la imagen
  // const [uploading, setUploading] = useState(false);
  const [urlimagen, setURLImage] = useState("");

  const { valores, errores, handleSubmit, handleChage, handleBlur } =
    useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);
  //El STATE_INICIAL, los pasamos al hook useValidacion

  const { nombre, empresa, imagen, url, descripcion } = valores;

  //hook de routing para redireccionar
  const router = useRouter();

  //context con las operaciones crud de firebase
  const { usuario, firebase } = useContext(FirebaseContext);

  console.log(usuario);

  async function crearProducto() {
    //Si el usuario no esta autenticado llevar al login
    if (!usuario) {
      return router.push("/login");
    }

    //Crear el objeto de nuevo producto
    const producto = {
      nombre,
      empresa,
      url,
      urlimagen,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador: {
        id: usuario?.uid,
        nombre: usuario?.displayName,
      },
      haVotado: []
    };

    //Insertar en la base de datos
    try {
      await addDoc(collection(firebase.db, "productos"), producto);
      await Router.push("/");
    } catch (error) {
      console.error(error);
    }
  }

  //Inicio Imagen
  const handleImageUpload = async (e) => {
    try {
      const result = await firebase.uploadFile(e.target.files[0]);
      setURLImage(result);
    } catch (error) {
      console.error(error);
    }
  };
  //Fin de Imagen

  return (
    <div>
      <Layout>
        {!usuario ? (
          <Error404 />
        ) : (
          <>
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >
              Nuevo Producto
            </h1>

            <Formulario onSubmit={handleSubmit} noValidate>
              <fieldset>
                <legend>Información General</legend>

                <Campo>
                  <label htmlFor="nombre">Nombre</label>
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
                  <label htmlFor="empresa">Empresa</label>
                  <input
                    type="text"
                    id="empresa"
                    placeholder="Empresa"
                    name="empresa"
                    value={empresa}
                    onChange={handleChage}
                    onBlur={handleBlur}
                  />
                </Campo>
                {errores.empresa && <Errores>{errores.empresa}</Errores>}

                <Campo>
                  <label htmlFor="imagen">Imagen</label>
                  <input
                    accept="image/*"
                    onChange={handleImageUpload}
                    type="file"
                    id="image"
                    name="image"
                  />
                </Campo>
                {errores.imagen && <Errores>{errores.imagen}</Errores>}

                <Campo>
                  <label htmlFor="url">URL</label>
                  <input
                    type="url"
                    id="url"
                    placeholder="URL de tu producto"
                    name="url"
                    value={url}
                    onChange={handleChage}
                    onBlur={handleBlur}
                  />
                </Campo>
                {errores.url && <Errores>{errores.url}</Errores>}
              </fieldset>

              <fieldset>
                <legend>Sobre tu producto</legend>

                <Campo>
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={descripcion}
                    onChange={handleChage}
                    onBlur={handleBlur}
                  />
                </Campo>
                {errores.descripcion && (
                  <Errores>{errores.descripcion}</Errores>
                )}
              </fieldset>

              {error && <Errores>{error}</Errores>}

              <InputSubmit type="submit" value="Crear Producto" />
            </Formulario>
          </>
        )}
      </Layout>
    </div>
  );
}
