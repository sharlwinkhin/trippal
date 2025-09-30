import {getFirebaseAuth, getFirebaseStore} from "./config.js"
import {validateEmail, validatePassword} from "./utility.js"
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";


const auth = getFirebaseAuth()
const db = getFirebaseStore()

const createBtn = document.getElementById("create")
const errorMsg = document.getElementById("error-message")

createBtn.addEventListener("click", doRegister)

async function doRegister() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value
    errorMsg.innerText = "";

    if (!validateEmail(email)) {
      errorMsg.innerText = "Invalid email format."
      return
    }
    if (!validatePassword(password)) {
      errorMsg.innerText = "Password must be at least 6 characters."
      return
    }

    try {
      // Create authentication user
      // note: await is used since createUserWithEmailAndPassword is an async function that returns a promise object, whose data is not immediately available
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Create user document in Firestore
      createUserDocument(user.uid, email)
      localStorage.setItem("userUID", user.uid)
      // User acc has created. Go back to login page
      window.location.href = "login.html"
    } catch (error) {
      console.error("Registration error:", error);

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMsg.innerText = "This email is already in use. Please use a different one."
          break;
        case 'auth/invalid-email':
          errorMsg.innerText = "Invalid email format."
          break;
        case 'auth/weak-password':
          errorMsg.innerText = "Weak password. Please provide a stronger password."
          break;
        default:
          errorMsg.innerText = "An error occurred during registration. Please try again."
      }
    }
}


// Function to create user document in Firestore
function createUserDocument(userId, email) {
  try {
    setDoc(doc(db, "users", userId), {
      email: email,
      createdAt: new Date(),
      // Add any other initial user data you want to store
    });
  } catch (error) {
    console.error("Error creating user document:", error);
    throw error;
  }
}