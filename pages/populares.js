import React, { useContext, useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { FirebaseContext } from "@/firebase";
import { collection, getDocs, orderBy } from "firebase/firestore";
import DetallesProducto from "@/components/layout/DetallesProducto";
import { id } from "date-fns/locale";

// const q = query(citiesRef, orderBy("name"), limit(3));

export default function Populares() {
  const [productos, guardarProductos] = useState([]);

  const { firebase } = useContext(FirebaseContext);


  useEffect(() => {
    const obtenerProductos = async () => {
  
      const querySnapshot = await getDocs(collection(firebase.db, "productos"));
      const produx = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),  
        };
      });

const productos = produx.slice().sort((a,b) => b.votos - a.votos);

      guardarProductos(productos);



     
      
      guardarProductos(productos);
    };
    obtenerProductos();
  }, []);

  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
              {productos.map((producto) => (
                <DetallesProducto key={producto.id} producto={producto} />
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  );
}
