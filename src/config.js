import Firebase from 'firebase';
import 'firebase/firestore';
let config = {
    apiKey: "AIzaSyA_vGCSGgss8wZ9SHKsou2mlkvtAQlC5Iw",
    authDomain: "growiy-37e6e.firebaseapp.com",
    databaseURL: "https://growiy-37e6e.firebaseio.com",
    projectId: "growiy-37e6e",
    storageBucket: "growiy-37e6e.appspot.com",
    messagingSenderId: "886254283116"
};
let app = Firebase.initializeApp(config);  
export const db = app.firestore();  