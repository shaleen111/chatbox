import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth, GoogleAuthProvider, signInWithPopup,
         signOut } from "firebase/auth"
import withFirebaseAuth from "react-with-firebase-auth";

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
const auth = getAuth()

const providers = {
  googleProvider: new GoogleAuthProvider()
}

const createComponentWithAuth = withFirebaseAuth({
  providers,
  firebaseAppAuth: auth
})

const signInWithGoogle = () => {
  signInWithPopup(auth, providers.googleProvider)
}

const signOutFirebase = () => {
  signOut(auth)
}

export {
  db,
  auth,
  createComponentWithAuth,
  signInWithGoogle,
  signOutFirebase as signOut,
}
