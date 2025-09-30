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
        data = computedata(response.data);
        document.getElementById("demo").innerText = data;
    } catch(error) {
            console.log(error.message)
            // return null if there is exception/error
            data = "Invalid Input or No data found!";
    } 
}

function computedata(obj) {
    // note: some data are float/int type, need to use repr() or str() to convert to string type
    // weather is a property of PHP object, which is an array
    var desc = obj.weather[0].description;
    var temp = obj.main.temp;
    temp = convert(temp); // convert to celsius
    var humid = obj.main.humidity;
    var wind = obj.wind.speed;

    /* weather object
    # weather = obj['weather'][0]

    # output some object attributes
    # print("Weather: " + weather['main'] + " " + weather['description'])

    # create data according to our application requirement
    # data = "Weather: " + weather['main'] + " " + weather['description']
    */

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


    