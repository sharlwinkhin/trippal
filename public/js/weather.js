
async function getWeather() {
    console.log("getWeather")
    var city = document.getElementById("city").value
    console.log(city)
    var data = "Feeling Good!"
    var apikey = "Your-openweathermap-api-key"
    var url = "https://api.openweathermap.org/data/2.5/weather"
    
    // get weather json data
    // use error/exception handling code in case the server doesn't return data
    try {
        let response = await axios.get(url, {
            params: {
                q : city,
                APPID : apikey
            }
        })
        console.log(response.data)
        data = computedata(response.data);
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

