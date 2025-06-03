// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3s7GgEU2Lu2nOWW56HgSK6FacfZd1B5M",
  authDomain: "kaushalya-setu.firebaseapp.com",
  projectId: "kaushalya-setu",
  storageBucket: "kaushalya-setu.firebasestorage.app",
  messagingSenderId: "247869560586",
  appId: "1:247869560586:web:69b94c94104c4c30cb0cf3",
  measurementId: "G-R6WWPR5FXB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);