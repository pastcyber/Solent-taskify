
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD3PNoAyrT1-i2kSDcVu-TSLvZGaDz05WY",
  authDomain: "solent-taskify.firebaseapp.com",
  projectId: "solent-taskify",
  storageBucket: "solent-taskify.appspot.com",
  messagingSenderId: "631993617869",
  appId: "1:631993617869:web:ead29e8e72580446f34884"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const googleProvider = new firebase.auth.GoogleAuthProvider().setCustomParameters({
  prompt: 'select_account',
});
export const facebookProvider = new firebase.auth.FacebookAuthProvider();
export const twitterProvider = new firebase.auth.TwitterAuthProvider();


export const auth = app.auth();

export default app;
