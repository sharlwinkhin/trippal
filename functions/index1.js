/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

const URLS = ['Your-website-url', 'http://localhost']
const axios = require('axios');
exports.weather = onRequest({cors: URLS}, 
    async (request, response) => {    
        var city = request.query.city
        var apikey =  "Your-openweathermap-api-key"
        var url = "https://api.openweathermap.org/data/2.5/weather"
        var data = { city: city }
      
        try {
            let result = await axios.get(url, {
                    params: {
                        q : city,
                        APPID : apikey
                    }
                })

            data["status"] = "cloud function success"
            data["result"] = result.data
                  
            response.status(200).json(data)
               
        } catch(error) {
            // data["status"] = "An error occurred"
            response.status(500).send("An error occurred. City: " + city);
            // response.status(500).json(data);
        } 
});

// import * as functions from 'firebase-functions';
// import * as cors from 'cors';
// const corsHandler = cors({ origin: true }); // Allows all origins, useful for testing with Postman
// // const corsHandler = cors({ origin: 'https://trippal-85ba7.web.app' }); // use this for production (after testing)

// exports.weather = onRequest((req, res) => {
//   corsHandler(req, res, async () => {
//     // Your function logic goes here
//     // res.status(200).send('Hello from your CORS-enabled function!');
//     var city = req.query.city
//     var apikey =  "Your-openweathermap-api-key"
//     var url = "https://api.openweathermap.org/data/2.5/weather"
//     var data = { city: city }
    
//     try {
//         let result = await axios.get(url, {
//                 params: {
//                     q : city,
//                     APPID : apikey
//                 }
//             })

//         data["status"] = "cloud function success"
//         data["result"] = result.data
                
//         res.status(200).json(data)
            
//     } catch(error) {
//         // data["status"] = "An error occurred"
//         res.status(500).send("An error occurred. City: " + city);
//         // response.status(500).json(data);
//     } 
//   });
// });

