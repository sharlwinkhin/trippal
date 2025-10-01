// export the following utility functions
export function validateEmail(email) {
    const re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
    return re.test(String(email).toLowerCase())
}

export function validatePassword(password) {
    return password.length >= 6
}

// --- Function to get and display user's profile image ---
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js"
import { ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-storage.js"
export async function getUserProfileImage(userUID, db, storage) {
    try {
        // 1. Get the user's document from Firestore to find the image filename/URL
        const docRef = doc(db, 'profilePictures', userUID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // const userData = docSnap.data();
            // let imageUrl = userData.profileImageURL; // Check if you stored the direct URL
            
            // Try to fetch the image from Firebase Storage
             const { fileName } = docSnap.data()
            const storageRef = ref(storage, 'users/' + userUID + '/' + fileName);
            const downloadURL = await getDownloadURL(storageRef)
        
            console.log(downloadURL)
            const imgElement = document.getElementById('profile')
            if (imgElement) {
                imgElement.src = downloadURL
                imgElement.style.display = 'block'
            }
           
        }

    } catch (error) {
        console.error(`Error getting profile image for user ${userUID}:`, error);
        return null;
    }
}



