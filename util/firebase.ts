import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAnPMKfVIKERo0xi_Qx4yDaH0QngGgM0Vo",
  authDomain: "chatbox-71f08.firebaseapp.com",
  projectId: "chatbox-71f08",
  storageBucket: "chatbox-71f08.appspot.com",
  messagingSenderId: "481405540940",
  appId: "1:481405540940:web:e1291287f42caf7ac632e9",
  measurementId: "G-2YJ1CR1HGQ"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

const db = getFirestore(app)

export { db }
