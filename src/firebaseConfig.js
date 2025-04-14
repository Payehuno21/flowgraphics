// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCE3imFIQfg4jGyNNrUaSColJpWgaxwP5M",
  authDomain: "digital-53a4f.firebaseapp.com",
  projectId: "digital-53a4f",
  storageBucket: "digital-53a4f.firebasestorage.app",
  messagingSenderId: "T249939132220",
  appId: "1:249939132220:web:291cb1decd7b81b018e839"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

export { db };
