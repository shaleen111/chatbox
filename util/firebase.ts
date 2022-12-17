import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth, GoogleAuthProvider, signInWithPopup,
         signOut } from "firebase/auth"
import withFirebaseAuth from "react-with-firebase-auth";

const firebaseConfig = {

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
