// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "@firebase/auth";
import {getFirestore} from "@firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDd132gIRch36jFUMXt7pE18M345-JtRKE",
    authDomain: "prepwise-22289.firebaseapp.com",
    projectId: "prepwise-22289",
    storageBucket: "prepwise-22289.firebasestorage.app",
    messagingSenderId: "733616142359",
    appId: "1:733616142359:web:7cea3bf02c5eedf8578452",
    measurementId: "G-DXQFQBRF7D"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig):getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);