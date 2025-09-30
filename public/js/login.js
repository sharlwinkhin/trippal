import {getFirebaseAuth} from "./config.js"
import {validateEmail, validatePassword} from "./utility.js"
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

const auth = getFirebaseAuth()

// monitor if the user has been authenticated.
// if yes, store the userId in browser's local storage
document.addEventListener("DOMContentLoaded", 
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // keep userId in user's browser local storage
            localStorage.setItem("userUID", user.uid)
        }
    })
)

// listen to click event in login button
let loginBtn = document.getElementById("login")
loginBtn.addEventListener("click", handleLogin)

// handle login event
function handleLogin() {
    let errorMessage = ""
    let email = document.getElementById("email").value
    let password = document.getElementById("password").value

    if (!validateEmail(email)) {
        errorMessage = "Invalid email format."
        document.getElementById("error-message").innerText = errorMessage
        return
    }

    if (!validatePassword(password)) {
        errorMessage = "Password must be at least 6 characters."
         document.getElementById("error-message").innerText = errorMessage
        return
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            localStorage.setItem("userUID", user.uid);
            window.location.href = "home.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            errorMessage = errorCode === 'auth/invalid-credential'
                ? "Invalid username or password. Please try again."
                : error.message;
             document.getElementById("error-message").innerText = errorMessage
        });
}


