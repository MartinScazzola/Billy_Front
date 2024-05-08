import { initializeApp } from "firebase/app";

const firebaseConfig = {

  apiKey: "AIzaSyCbLA6qr561wIdqRoER4bfMU6PvobNWSUA",

  authDomain: "billy-login-a1b6a.firebaseapp.com",

  projectId: "billy-login-a1b6a",

  storageBucket: "billy-login-a1b6a.appspot.com",

  messagingSenderId: "355198247537",

  appId: "1:355198247537:web:43dbe4609bd1ca3447b1d0",

  measurementId: "G-DD93PDBBR2"

};

const appFirebase = initializeApp(firebaseConfig);

export default appFirebase;