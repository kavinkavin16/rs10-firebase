// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCE0hDukLzNfFlzNseRu1JM2PhoFe5Tcec",
    authDomain: "semmarikulam-2104d.firebaseapp.com",
    databaseURL: "https://semmarikulam-2104d-default-rtdb.firebaseio.com",
    projectId: "semmarikulam-2104d",
    storageBucket: "semmarikulam-2104d.appspot.com",
    messagingSenderId: "583907444408",
    appId: "1:583907444408:web:f0043dfc5a8194dc3b964d",
    measurementId: "G-JYFFR0DY3J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
