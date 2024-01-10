import React, { useEffect, useState } from "react";

const useValidacion = (stateInicial, validar, fn) => {
  const [valores, guardarValores] = useState(stateInicial);
  const [errores, guardarErrores] = useState({});
  const [submitForm, guardarSubmitForm] = useState(false);

  useEffect(() => {
    if(submitForm) {
      const noErrores = Object.keys(errores).length === 0;

      if(noErrores) {
        fn(); //fn = Función que se ejecuta en el componente
      }
      guardarSubmitForm(false);
    }
  }, [errores]);

  //Función que se ejecuta conforme el usuario escribe algo
  const handleChage = (e) => {
    guardarValores({
      ...valores,
      [e.target.name]: e.target.value,
      //De esta manera la funcion se ejecutara todo el tiempo cargando lo que el usuaro ingrese en el input
    });
  };

//Función que se ejecuta cunado el usuario hace submit
const handleSubmit = (e) => {
e.preventDefault();

const erroresValidacion = validar(valores)
guardarErrores(erroresValidacion)
guardarSubmitForm(true)
}

//Cuando se realiza el evento de blur
const handleBlur = () => {
    const erroresValidacion = validar(valores);
    guardarErrores(erroresValidacion);
}

  return{
    valores,
    errores,
    handleSubmit,
    handleChage,
    handleBlur
  };
};

export default useValidacion;
