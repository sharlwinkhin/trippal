// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// import Firebase authentication libraries
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js"

// import Firestore libraries
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, getDoc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js"

// Add Cloud Storage
import { getStorage } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-storage.js"

// Your web app's Firebase configuration
const firebaseConfig = {
apiKey: "Your-Firebase-API-Key",
authDomain: "is216-demo-app.firebaseapp.com",
projectId: "is216-demo-app",
storageBucket: "is216-demo-app.firebasestorage.app",
messagingSenderId: "830452017100",
appId: "1:830452017100:web:d4ae566848d9c987f19f69"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app); // Pass the initialized 'app' instance

// export Firebase services 
// Firebase authentication service
export function getFirebaseApp() {
    return app
}
export function getFirebaseAuth() {
    return auth
}
// Firestore 
export function getFirebaseStore() {
    const db = getFirestore(app)
    return db
}
export function getFirebaseProvider() {
    return provider
}
export function getFirebaseStorage() {
    // Initialize Cloud Storage
    const storage = getStorage(app)
    return storage
}

export function isAuthenticated() {
    const userUID  = localStorage.getItem("userUID")
     if (!userUID) {
        return false
     } else {
        return true
     }
}
