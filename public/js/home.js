import { collection, doc, addDoc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js"
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js"
import { ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-storage.js"

import {getFirebaseAuth, getFirebaseStore, getFirebaseStorage} from "./config.js"
import { getUserProfileImage } from "./utility.js"

const auth = getFirebaseAuth()
let userUID = localStorage.getItem("userUID")
// get Firestore & Storage APIs
const storage = getFirebaseStorage()
const db = getFirebaseStore()

onAuthStateChanged(auth, async (user) => {
    if (user) {
        userUID = user.uid
    }
    await loadTrip()
    await getUserProfileImage(userUID, db, storage)
})

// Flatpickr Date Range Picker Initialization
document.addEventListener('DOMContentLoaded', function () {
    flatpickr("#date-range", {
        mode: "range",
        dateFormat: "Y-m-d",
        minDate: "today"
    })
})

document.getElementById("plan").addEventListener("click", saveTrip)

async function saveTrip() {
    if (userUID != "") {
        // const userUID = user.uid
        console.log(userUID)
        // Get form fields and error message element
        const tripName = document.getElementById("tripName").value.trim()
        const location = document.getElementById("location").value.trim()
        const dateRange = document.getElementById("date-range").value.trim()
        const errorMessage = document.getElementById("errorMessage")
        const [startDate, endDate] = dateRange.split(" to ")
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.min(7, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1)

        // Store number of days and trip name in localStorage
        localStorage.setItem("tripDays", days)
        localStorage.setItem("tripName", tripName)

        // Validate the form fields
        if (!tripName || !location || !dateRange) {
            errorMessage.style.display = "block"; // Show error message
            errorMessage.innerText = "Please fill in all fields."; // Set error text
            return; // Stop form submission
        } else {
            errorMessage.style.display = "none"; // Hide error message if fields are filled
        }

        // // Check if already submitting to avoid duplicates
        // if (isSubmitting) return
        // isSubmitting = true

        try {
            // Create new trip in Firebase
            // note: setDoc is an async func. hence, await is used to wait for the result
            const tripRef = doc(db, 'trips', userUID); // one trip per user
            // to save more than one trip per user, use "collection"
            // const tripRef = await addDoc(collection(db, `users/${userUID}/trips`), {
            await setDoc(tripRef, {
                name: tripName,
                location: location,
                dates: generateDateRange(startDate, endDate),
                createdAt: new Date()
            })

            // Save the newly created trip ID
            localStorage.setItem("selectedTripId", tripRef.id);
            localStorage.setItem("location", location);
            localStorage.setItem("tripName", tripName); 
            localStorage.setItem("tripDays", days);
            // Set a flag to indicate a new trip was created
            localStorage.setItem("showBudgetModal", "true");

            // Redirect to the dashboard
            // window.location.href = `dashboard.html`;
            window.location.href = `dashboard.html?tripID=${tripRef.id}&location=${encodeURIComponent(location)}`;

        } catch (error) {
            console.error("Error creating new trip:", error);
        } finally {
            // isSubmitting = false; // Reset the flag
        }
    
    } else {
        // If not logged in, redirect to login page
        window.location.href = "login.html";
    }
}

async function loadTrip() {
    console.log("load trip")
    // load the saved data
    const tripDocRef = doc(db, "trips", userUID); // Get a DocumentReference
    const savedTrip = await getDoc(tripDocRef); 
    // const savedTrip = await getDoc(collection(db, `users/${userUID}/trips`))
    
    if(savedTrip.exists()) {
        const tripRef = savedTrip.data()
        console.log(tripRef)

        let name = tripRef.name
        let location = tripRef.location
        let dates = tripRef.dates

        document.getElementById("tripName").value = name
        document.getElementById("location").value = location
        document.getElementById("date-range").value = dates
    }
   
}

function generateDateRange(startDate, endDate) {
    const dates = [];
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate <= lastDate) {
        dates.push(new Date(currentDate).toISOString().split("T")[0]); // Format as YYYY-MM-DD
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}

// --- Function to get and display user's profile image ---
// async function getUserProfileImage(userUID) {
//     try {
//         // 1. Get the user's document from Firestore to find the image filename/URL
//         const docRef = doc(db, 'profilePictures', userUID);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//             // const userData = docSnap.data();
//             // let imageUrl = userData.profileImageURL; // Check if you stored the direct URL
            
//             // Try to fetch the image from Firebase Storage
//              const { fileName } = docSnap.data()
//             const storageRef = ref(storage, 'users/' + userUID + '/' + fileName);
//             const downloadURL = await getDownloadURL(storageRef)
        
//             console.log(downloadURL)
//             const imgElement = document.getElementById('profile')
//             if (imgElement) {
//                 imgElement.src = downloadURL
//                 imgElement.style.display = 'block'
//             }
           
//         }

//     } catch (error) {
//         console.error(`Error getting profile image for user ${userUID}:`, error);
//         return null;
//     }
// }