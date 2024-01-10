import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/layout/Layout";
import { doc, getDoc, updateDoc, increment, deleteDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage"
import Error404 from "@/components/layout/404";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { FirebaseContext } from "@/firebase";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
import { Campo, InputSubmit } from "@/components/ui/Formulario";
import Boton from "@/components/ui/Boton";
import Link from "next/link";

const ContenedorProducto = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;
const CreadorProducto = styled.p`
  padding: 0.5rem 2rem;
  background-color: #4cc0c8;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
`;

const Producto = () => {
  const [producto, guardarProducto] = useState({});
  const [error, guardarError] = useState(false);
  const [comentario, guardarComentario] = useState({});
  const [consultarDB, guardarConsultarDB] = useState(true);

  //Routing para obtener el id actual.
  const router = useRouter();
  const {
    query: { id },
  } = router;

  const { firebase, usuario } = useContext(FirebaseContext);
  const db = firebase.db;

  useEffect(() => {
    if (id && consultarDB) {
      const obtenerProducto = async () => {
        const docRef = doc(db, "productos", `${id}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          guardarProducto(docSnap.data());
          guardarConsultarDB(false);
        } else {
          // docSnap.data() will be undefined in this case
          guardarError(true);
          guardarConsultarDB(false);
        }
      };
      obtenerProducto();
    }
  }, [id]);

  if (Object.keys(producto).length === 0 && !error) return "Cargando ...";

  const {
    comentarios,
    creado,
    descripcion,
    empresa,
    nombre,
    url,
    urlimagen,
    votos,
    creador,
    haVotado,
  } = producto;

  //Administrar y validar los votos
  const votarProducto = () => {
    if (!usuario) {
      return router.push("/");
    }

    //Obtener y sumar un nuevo voto
    const nuevoTotal = votos + 1;

    //Ver si el usuario actual ha votado
    if (haVotado.includes(usuario.uid)) return;

    //Guardar el ID del usuario que ha votado
    const nuevoHaVotado = [...haVotado, usuario.uid];

    //Actualizar DB
    const docRef = doc(db, "productos", `${id}`);

    updateDoc(docRef, {
      votos: increment(nuevoTotal),
      haVotado: nuevoHaVotado,
    });

    //Actualizar el state
    guardarProducto({
      ...producto,
      votos: nuevoTotal,
    });

    guardarConsultarDB(true); //Hay un voto por lo tanto hay que volver a consultar a la db.
  };

  //Funciones para crear comentarios
  const comentarioChange = (e) => {
    guardarComentario({
      ...comentario,
      [e.target.name]: e.target.value,
    });
  };

  //Identificar si el comentario es por el creador del producto
  const esCreador = (id) => {
    if (creador.id === id) {
      return true;
    }
  };

  const agregarComentario = (e) => {
    e.preventDefault();
    e.target.reset();

    if (!usuario) {
      return router.push("/");
    }

    //Información extra al comentario
    comentario.usuarioId = usuario.uid;
    comentario.usuarioNombre = usuario.displayName;

    // Tomar copia de comentarios y agregarlos al arreglo
    const nuevoComentarios = [...comentarios, comentario];

    //Actualizar la DB
    const docRef = doc(db, "productos", `${id}`);

    updateDoc(docRef, {
      comentarios: nuevoComentarios,
    });

    //Actualizar el state
    guardarProducto({
      ...producto,
      comentarios: nuevoComentarios,
    });

    guardarConsultarDB(true); //Hay un comentario, por lo tanto se consulta a la base de datos nuevamente.
  };

  //Función que revisa que el creador del producto sea el que esta autenticado.
  const puedeBorrar = () => {
    if (!usuario) return false;

    if (creador.id === usuario.uid) {
      return true;
    }
  };

  //Elimina un producto de db
  const eliminarProducto = async () => {

    if (!usuario) {
        return router.push("/login");
    }
        if (creador.id !== usuario.uid) {
          return router.push("/");
        }
      

        try {
            // Eliminar Producto
            await deleteDoc(doc(firebase.db, "productos", id))
            // Eliminar imagen
            const storage = getStorage()
            const imgRef = ref(storage, urlimagen)
            deleteObject(imgRef).then(() => {
              // Imagen eliminada correctamente
            }) .catch((error) => {
              console.log(error)
            })
            router.push("/")
          } catch (error) {
            console.log(error)
          }
  };

  return (
    <Layout>
      <>
        {error ? (
          <Error404 />
        ) : (
          <div>
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >
              {nombre}
            </h1>

            <ContenedorProducto>
              <div>
                <p>
                  Publicado hace:{" "}
                  {formatDistanceToNow(new Date(creado), { locale: es })}
                </p>
                <p>
                  Por: {creador?.nombre} de {empresa}
                </p>
                <div
                  css={css`
                    text-align: center;
                  `}
                >
                  <img src={urlimagen} />
                </div>

                <p>{descripcion}</p>

                {usuario && (
                  <>
                    <h2>Agrega tu comentario</h2>

                    <form onSubmit={agregarComentario}>
                      <Campo>
                        <input
                          type="text"
                          required
                          name="mensaje"
                          onChange={comentarioChange}
                        />
                      </Campo>

                      <InputSubmit type="submit" value="Agregar Comentario" />
                    </form>
                  </>
                )}

                <h2
                  css={css`
                    margin: 2rem 0;
                  `}
                >
                  Comentarios
                </h2>
                {comentarios.length === 0 ? (
                  "Aun no hay comentarios"
                ) : (
                  <ul>
                    {comentarios.map((comentario, i) => (
                      <li
                        key={`${comentario.usuarioId}-${i}`}
                        css={css`
                          border: 1px solid #e1e1e1;
                          padding: 2rem;
                        `}
                      >
                        <p>{comentario.mensaje}</p>
                        <p>
                          Escrito por:
                          <span
                            css={css`
                              font-weight: bold;
                            `}
                          >
                            {" "}
                            {comentario.usuarioNombre}
                          </span>
                        </p>
                        {esCreador(comentario.usuarioId) && (
                          <CreadorProducto>Es Creador</CreadorProducto>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <aside>
                <Boton>
                  <Link href={url} target="_blank">
                    Visitar URL
                  </Link>
                </Boton>

                <div
                  css={css`
                    margin-top: 5rem;
                    text-align: center;
                  `}
                >
                  <p>{votos} Votos</p>

                  {usuario && <Boton onClick={votarProducto}>Votar</Boton>}
                </div>
              </aside>
            </ContenedorProducto>

            {puedeBorrar() && (
              <Boton onClick={eliminarProducto}>Eliminar Producto</Boton>
            )}
          </div>
        )}
      </>
    </Layout>
  );
};

export default Producto;
