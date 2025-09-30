
import { getFirebaseStorage, getFirebaseStore } from "./config.js"
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js"
import { ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-storage.js"

// For uploading of image to Cloud Storage
const uploadArea = document.getElementById('uploadpic')
const fileInput = document.getElementById('fileinput')
const uploadedImage = document.getElementById('uploadedimage')
let userUID = localStorage.getItem("userUID")
// get Firestore & Storage APIs
const storage = getFirebaseStorage()
const db = getFirebaseStore()

// load previously uploaded pic
document.addEventListener('DOMContentLoaded', loadUploadedPic)

// Handle drag-and-drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault()
    uploadArea.style.borderColor = 'green'
})

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#ccc'
})

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault()
    uploadArea.style.borderColor = '#ccc'

    const file = e.dataTransfer.files[0]
    if (file) {
        uploadImage(file)
    }
})

// Handle click to upload
uploadArea.addEventListener('click', () => {
    fileInput.click()
})

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        uploadImage(file);
    }
})

// Function to upload image to Firebase Storage
async function uploadImage(file) {
    const storageRef = ref(storage, 'users/' + userUID + '/' + file.name)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on('state_changed',
        (snapshot) => {
            // Optional: Track upload progress
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log('Upload is ' + progress + '% done')
        },
        (error) => {
            console.error('Upload failed:', error)
            alert('Failed to upload image.')
        },
        async () => {
            // Handle successful upload
            try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)

                // Save image metadata (file name & downloadURL) to Firestore
                await setDoc(doc(db, 'profilePictures', userUID), {
                    fileName: file.name,
                    downloadURL : downloadURL,
                    timestamp: new Date()
                });

                // Display uploaded image
                uploadedImage.src = downloadURL;
                uploadedImage.style.display = 'block';
                console.log('File available at', downloadURL);
            } catch (error) {
                console.error('Error saving image data:', error);
            }
        }
    );
}

// Load the previously uploaded image if it exists
async function loadUploadedPic() {
    console.log(userUID)
    if (!userUID) {
        window.location.href = "login.html"; // Redirect to login if not authenticated
    }
    try {
        // Check Firestore to see if the user has uploaded an image before
        const docRef = doc(db, 'profilePictures', userUID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const { fileName } = docSnap.data();

            // Try to fetch the image from Firebase Storage
            const storageRef = ref(storage, 'users/' + userUID + '/' + fileName);
            const downloadURL = await getDownloadURL(storageRef);

            // Display the image in the img element
            uploadedImage.src = downloadURL;
            uploadedImage.style.display = 'block';
        } else {
            console.log("No uploaded image found for this user.");
        }
    } catch (error) {
        console.error("Error loading image:", error);
    }
}

