import {extraAnalysis} from "./assets/analyseText.mjs";


function analyseSTD(data, measurement, threshold, unit, warningPeriod=288){
    var average = 0
    var max = null
    var min = null
    var analytics = ""
    var dataWarning = ""
    var lowDataTime = []
    var highDataTime = []                            // list of high data start and end times
    var highCounter = 0
    var lowCounter = 0
    var highStreak = 0
    var lowStreak = 0

    const dataLength = Object.keys(data).length
    for(var i = 0; i < dataLength; i++)
    {
        var point = Object.values(data)[i]

        average += point

        if(point > max || max == null) {            // max won't have value at start
            max = point
        }
        if(point > threshold[1]) {                  // online answer of high humidity in UK
            if(highCounter == 0){
                highDataTime.push(Object.keys(data)[i])  // adding start time
            }
            highCounter++                           // counter on how long there has been high data in one sitting
        }
        else if(highCounter > 0){                   // if data goes below threshold, reset counter
            if(highCounter > highStreak){
                highStreak = highCounter
            }
            highDataTime.push(Object.keys(data)[i]) // adding end time
            highCounter = 0
        }

        if(point < min || min == null) {            // vice versa for low
            min = point 
        }
        if(point < threshold[0]) {
            if(lowCounter == 0){
                lowDataTime.push(Object.keys(data)[i])  // adding start time
            }
            lowCounter++
        }
        else if(lowCounter > 0){
            if(lowCounter > lowStreak){
                lowStreak = lowCounter
            }
            lowDataTime.push(Object.keys(data)[i]) // adding end time, TODO if last number, wont be added to list
            lowCounter = 0
        }
    }

    const hours = (warningPeriod/60).toFixed(3)
    if(max > threshold[1]) {
        dataWarning = ". WARNING: Excessive "+measurement+" above "+threshold[1]+unit+" has been detected at the following times"
        while(highDataTime.length > 1){
            dataWarning += ", From "+highDataTime.shift()+" To "+highDataTime.shift()
        }
        if(highStreak > warningPeriod){ // readings are every five mins, default = 288 five mins are in 24 hours.
            dataWarning += ". This excessive "+measurement+" has been detected for over "+hours+" hours, "
            if(measurement == "Humidity"){
                dataWarning += extraAnalysis.highHumidity
            }
            if(measurement == "Temperature"){
                dataWarning += extraAnalysis.highTemperature
            }
            if(measurement == "Gas"){
                dataWarning += extraAnalysis.highHumidity
            }
        }
    }
    if(min < threshold[0]) {
        dataWarning = ". Warning: Excessive "+measurement+" below "+threshold[0]+unit+" has been detected at the following times"
        while(lowDataTime.length > 1){
            dataWarning += ", From "+lowDataTime.shift()+" To "+lowDataTime.shift()
        }
        if(lowStreak > warningPeriod){ // readings are every five mins, 288 five mins are in 24 hours.
            dataWarning += ". This excessive "+measurement+" has been detected for over "+hours+" hours, "
            if(measurement == "Humidity"){
                dataWarning += extraAnalysis.lowHumidity
            }
            if(measurement == "Temperature"){
                dataWarning += extraAnalysis.lowTemperature
            }
            if(measurement == "Gas"){
                dataWarning += extraAnalysis.lowHumidity
            }
        }
    }

    average = average/dataLength
    analytics = "Average "+measurement+" in this selected period: "+average+unit+". A minimum value of "+min+unit+" was found, and a maximum of "+max+unit+dataWarning
    
    console.log(analytics)
    return analytics
}

export {analyseSTD}