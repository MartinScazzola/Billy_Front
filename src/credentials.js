// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyCbLA6qr561wIdqRoER4bfMU6PvobNWSUA",

  authDomain: "billy-login-a1b6a.firebaseapp.com",

  projectId: "billy-login-a1b6a",

  storageBucket: "billy-login-a1b6a.appspot.com",

  messagingSenderId: "355198247537",

  appId: "1:355198247537:web:43dbe4609bd1ca3447b1d0",

  measurementId: "G-DD93PDBBR2"

};


// Initialize Firebase

const appFirebase = initializeApp(firebaseConfig);

export default appFirebase;

//const analytics = getAnalytics(app);