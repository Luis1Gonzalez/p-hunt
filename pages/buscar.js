import React, { useContext, useEffect, useState } from "react";
import Layout from '../components/layout/Layout';
import { useRouter } from 'next/router';
import DetallesProducto from '../components/layout/DetallesProducto';
import { FirebaseContext } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

const Buscar = () => {

  const router = useRouter();
  const { firebase } = useContext(FirebaseContext);
  const { query: { q }} = router;

  // Todos los productos
  const [ resultado, guardarResultado ] = useState([]);
const [productos, guardarProductos] = useState([])

  useEffect(() => {
    const obtenerProductos = async () => {
      const querySnapshot = await getDocs(collection(firebase.db, "productos"));
      const productos = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      guardarProductos(productos);
    };
    obtenerProductos();
  }, []);

  useEffect(() => {
      const busqueda = q.toLowerCase();
      const filtro =  productos.filter(producto => {
        return (
          producto.nombre.toLowerCase().includes(busqueda) || 
          producto.descripcion.toLowerCase().includes(busqueda)
        )
      });
      guardarResultado(filtro);
      
  }, [ q, productos ]);


  return (
    <div>
      <Layout>
        <div className="listado-productos">
            <div className="contenedor">
              <ul className="bg-white">
                  {resultado.map(producto => (
                      <DetallesProducto
                          key={producto.id}
                          producto={producto}
                      />
                  ))}
              </ul>
            </div>
        </div>
      </Layout>
    </div>
  )
}

export default Buscar