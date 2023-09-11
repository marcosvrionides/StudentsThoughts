import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBbenkMCvh6lgEAt78mLgRfUFlZe4cC_CM",
    authDomain: "studentsthoughtsfyp.firebaseapp.com",
    databaseURL: "https://studentsthoughtsfyp-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "studentsthoughtsfyp",
    storageBucket: "studentsthoughtsfyp.appspot.com",
    messagingSenderId: "880511116664",
    appId: "1:880511116664:web:eaa70ee14873c6995e548d",
    measurementId: "G-FS889K07GR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export default app;