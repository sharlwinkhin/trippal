/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

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
        var city = request.city
        var apikey = "Your-openweathermap-api-key"
        var url = "https://api.openweathermap.org/data/2.5/weather"
      
        try {
            let result = await axios.get(url, {
                    params: {
                        q : city,
                        APPID : apikey
                    }
                })

            let data = {
                    status: "cloud function success",
                    result: result.data
                }
            response.status(200).json(data)
               
        } catch(error) {
            response.status(500).send("An error occurred");
        } 

    })
        
