import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from '@firebase/storage';
import { getFirestore } from 'firebase/firestore';

import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { v4 } from "uuid";
import firebaseConfig from "./config";

class Firebase {
  constructor() {
    initializeApp(firebaseConfig);
    this.auth = getAuth();
    this.storage = getStorage(this.app);
    this.db = getFirestore(app);
  }

  // Registra un usuario
  async registrar(nombre, email, password) {
    const nuevoUsuario = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    return await updateProfile(nuevoUsuario.user, {
      displayName: nombre,
    });
  }

  // Inicia sesión del usuario
  async login(email, password) {
    const loginUser = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    return loginUser;
  }

  // Cierra la sesión del usuario
  async cerrarSesion() {
    await this.auth.signOut();
  }

async uploadFile(file) {
    const storageRef = ref(this.storage, v4())
    await uploadBytes(storageRef, file);
   const url = await getDownloadURL(storageRef);
   return url;
}}

const firebase = new Firebase();
export default firebase;























// import app from "firebase/app";
// import "firebase/auth";
// import "firebase/firestore";
// import { getStorage } from '@firebase/storage';
// import { getFirestore } from 'firebase/firestore';

// import { initializeApp } from "firebase/app";
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   getAuth,
//   updateProfile,
// } from "firebase/auth";

// import firebaseConfig from "./config";

// class Firebase {
//   constructor() {
//     initializeApp(firebaseConfig);
//     this.auth = getAuth();
//     this.storage = getStorage(this.app);
//     this.db = getFirestore(app);
//   }

//   // Registra un usuario
//   async registrar(nombre, email, password) {
//     const nuevoUsuario = await createUserWithEmailAndPassword(
//       this.auth,
//       email,
//       password
//     );

//     return await updateProfile(nuevoUsuario.user, {
//       displayName: nombre,
//     });
//   }

//   // Inicia sesión del usuario
//   async login(email, password) {
//     const loginUser = await signInWithEmailAndPassword(
//       this.auth,
//       email,
//       password
//     );

//     return loginUser;
//   }

//   // Cierra la sesión del usuario
//   async cerrarSesion() {
//     await this.auth.signOut();
//   }
// }

// const firebase = new Firebase();
// export default firebase;

