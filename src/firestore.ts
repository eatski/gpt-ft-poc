import { initializeApp } from "@firebase/app";
import { initializeFirestore } from "@firebase/firestore";

const app = initializeApp({
    apiKey: "AIzaSyBsmGnSryVAEWoUgLjMQ1IjMWVZq2x3hkk",
  authDomain: "nandemo-jinro.firebaseapp.com",
  projectId: "nandemo-jinro",
  storageBucket: "nandemo-jinro.appspot.com",
  messagingSenderId: "824985421559",
  appId: "1:824985421559:web:1d1b3f60c12cd71af2b5f2",
  measurementId: "G-7X6FHRGW5J"
});

export const store = initializeFirestore(app,{});