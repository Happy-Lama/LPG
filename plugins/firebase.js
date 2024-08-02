import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// move this to a secrets file
const firebaseConfig = {
    apiKey: "AIzaSyAv3ENUYsrx3Pv_4cQaRUqbfGdnW0ofMzs",
    authDomain: "lpgprototype.firebaseapp.com",
    projectId: "lpgprototype",
    storageBucket: "lpgprototype.appspot.com",
    messagingSenderId: "1031353852015",
    appId: "1:1031353852015:web:f180ecfa8a7102d4e56d9a",
    measurementId: "G-17NGRFKT7J"
};

const firebaseApp = initializeApp(firebaseConfig)
const firebasAuth = getAuth(firebaseApp)
const firestore = getFirestore(firebaseApp)
// const dbRef = ref;
export default defineNuxtPlugin( nuxtApp => {
    nuxtApp.provide('firebaseApp', firebaseApp);
    nuxtApp.provide('firebaseAuth', firebasAuth);
    nuxtApp.provide('firestore', firestore);
})