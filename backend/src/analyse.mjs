import {extraAnalysis} from "./assets/analyseText.mjs";


function analyseBasic(data, measurement, threshold, unit, warningPeriod=144){
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
                highDataTime.push("end of results")
            }
            highCounter++                           // counter on how long there has been high data in one sitting
        }
        else if(highCounter > 0){                   // if data goes below threshold, reset counter
            if(highCounter > highStreak){
                highStreak = highCounter
            }
            highDataTime[highDataTime.length - 1] = Object.keys(data)[i] // adding end time
            highCounter = 0
        }

        if(point < min || min == null) {            // vice versa for low
            min = point 
        }
        if(point < threshold[0]) {
            if(lowCounter == 0){
                lowDataTime.push(Object.keys(data)[i])  // adding start time
                lowDataTime.push("end of results")
            }
            lowCounter++
        }
        else if(lowCounter > 0){
            if(lowCounter > lowStreak){
                lowStreak = lowCounter
            }
            lowDataTime[lowDataTime.length - 1] = Object.keys(data)[i] // adding end time
            lowCounter = 0
        }
    }

    const hours = (warningPeriod/60).toFixed(3)
    if(max > threshold[1]) {
        dataWarning = ".\nWARNING: Excessive "+measurement+" above "+threshold[1]+unit+" has been detected at the following time(s):"
        while(highDataTime.length > 1){
            dataWarning += "\n\t- From "+highDataTime.shift()+" To "+highDataTime.shift()
        }
        if(highStreak > warningPeriod){ // readings are every five mins, default = 144 five mins are in 12 hours.
            dataWarning += ".\n\nThis excessive "+measurement+" has been detected for over "+hours+" hour(s), "
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
        dataWarning = ".\nWARNING: Excessive "+measurement+" below "+threshold[0]+unit+" has been detected at the following time(s):"
        while(lowDataTime.length > 1){
            dataWarning += "\n\t- From "+lowDataTime.shift()+" To "+lowDataTime.shift()
        }
        if(lowStreak > warningPeriod){ // readings are every five mins, 144 five mins are in 12 hours.
            dataWarning += ".\n\nThis excessive "+measurement+" has been detected for over "+hours+" hour(s), "
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

    average = Math.round(average/dataLength)
    analytics = "Average "+measurement+" in this selected period: "+average+unit+". A minimum value of "+min+unit+" was found, and a maximum of "+max+unit+dataWarning
    
    console.log(analytics)
    return analytics
}

function analyseCO(data, warningPeriod=12){
    var average = 0
    var max = null
    var min = null
    var analytics = ""
    var COWarning = ""
    var highCOTime = []
    var mildWarning = ""
    var highCounter = 0
    var highStreak = 0

    const dataLength = Object.keys(data).length
    for(var i = 0; i < dataLength; i++)
    {
        var point = Object.values(data)[i]

        average += point

        if(point > max || max == null) {            // max won't have value at start
            max = point
        }
        if(point > 25) {
            if(point > 100){                        // life threatening values, user will already be called
                return "WARNING: CO levels have exceeded safe limits, Please take immediate actions. A measure of "+point+"ppm of CO has been measured in your home, this has the potential to be fatal!"
            }                            
            if(highCounter == 0){
                highCOTime.push(Object.keys(data)[i])  // adding start time
                highCOTime.push("end of results.")
            }
            if(point > 50){
                mildWarning = "\nElevated Co levels have been detected at "+Object.keys(data)[i]
            }
            highCounter++                           // counter on how long there has been high data in one sitting
        }
        else if(highCounter > 0){                   // if data goes below threshold, reset counter
            if(highCounter > highStreak){
                highStreak = highCounter
            }
            highCOTime[highCOTime.length - 1] = Object.keys(data)[i] // adding end time
            highCounter = 0
        }

        if(point < min || min == null) {          
            min = point 
        }
    }

    const earlyPoint = data[Math.round(dataLength*0.1)]   // measuring early and late points to see if values have risen
    const latePoint = data[Math.round(dataLength*0.9)]
    const diff = latePoint - earlyPoint

    if(max > 25) {
        COWarning = "ACTION IS NEEDED. WARNING: Excessive CO levels above 25ppm has been detected at the following time(s):"
        while(highCOTime.length > 1){
            COWarning += "\n\t- From "+highCOTime.shift()+" To "+highCOTime.shift()
        }
        if(highStreak > warningPeriod){ // readings are every five mins, default = 12 five mins are in 1 hour.
            COWarning += "\n\nThese excessive CO levels has been detected for over "+(warningPeriod/60).toFixed(3)+" hour(s), Action is needed to prevent physical symptons. "
            COWarning += extraAnalysis.dangerousCO
        }
        COWarning += mildWarning+"\n"
    }
    else if(diff > 10){                         // no need to talk about difference if emergency action is needed.
        COWarning = "Warning: CO levels have been rising over this period. "+extraAnalysis.risingCO
    }
    else if(diff < -5){
        analytics += "CO levels have fallen this period. This is a good outcome.\n"
    }

    average = Math.round(average/dataLength)
    analytics += COWarning+"Average CO levels in this selected period: "+average+"ppm. A minimum value of "+min+"ppm was found, and a maximum of "+max+"ppm"

    console.log(analytics)
    return analytics
}

export {analyseBasic, analyseCO}