import {getFirebaseAuth, getFirebaseStore, getFirebaseStorage} from "./config.js"
import { getUserProfileImage } from "./utility.js"
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js"

const auth = getFirebaseAuth()
let userUID = localStorage.getItem("userUID")
// get Firestore & Storage APIs
const storage = getFirebaseStorage()
const db = getFirebaseStore()

onAuthStateChanged(auth, async (user) => {
    if (user) {
        userUID = user.uid
    }
    await getUserProfileImage(userUID, db, storage)
})

async function getWeather() {
    const url = "Your-CloudFunction-API"
    var city = document.getElementById("city").value
    console.log(city)
    var data = "Feeling Good!"
  
    try {
        let response = await axios.get(url, {
            params: {
                city : city
            }
        })
        console.log(response.data)
        data = computedata(response.data.result);
        document.getElementById("demo").innerText = data;
    } catch(error) {
            console.log(error.message)
            // return null if there is exception/error
            data = "Invalid Input or No data found!";
    } 
}

function computedata(obj) {
    var desc = obj.weather[0].description;
    var temp = obj.main.temp;
    temp = convert(temp); // convert to celsius
    var humid = obj.main.humidity;
    var wind = obj.wind.speed;

    var data = "The weather is " +
            desc + ". The temperature is " +
            temp + " degree celsius. The humidity is " +
            humid + "%. The wind speed is " +
            wind + " meter/sec.";
    
    return data;
}

function convert(kel) {
    // conver from kelvin to celsius 
    // and round to 2 decimal places
    var cel = Math.round(kel - 273.15,2);
    return cel;
}


    