// js/firebase-init.js

// Importamos las funciones necesarias desde los SDKs de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// TODO: Reemplaza esto con la configuración de TU proyecto de Firebase

const firebaseConfig = {
  apiKey: "AIzaSyDmiYRcmYf1TUY4vYP7eS7875w-TolLYmo",
  authDomain: "app-delygo.firebaseapp.com",
  projectId: "app-delygo",
  storageBucket: "app-delygo.firebasestorage.app",
  messagingSenderId: "901393358444",
  appId: "1:901393358444:web:9730aebf37df93b9880249"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios que usaremos
const db = getFirestore(app); // La base de datos Firestore
const auth = getAuth(app); // El servicio de autenticación

// Exportamos los servicios para poder usarlos en otros archivos (login.js, main.js, etc.)
export { db, auth };
