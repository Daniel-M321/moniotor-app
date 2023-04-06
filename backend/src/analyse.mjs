import {extraAnalysis} from "./assets/analyseText.mjs";
import {apiKey} from '../env.mjs'


async function analyseBasic(data, measurement, threshold, unit, warningPeriod=12){
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
    const errors = {
        high: false,
        low: false,
        fatal: false,
        measurement: measurement
    }
    var outsideTemp = null
    var outsideHum = 0

    const apiUrl = "https://api.openweathermap.org/data/2.5/weather?lat=53.61&lon=-8.90&appid=" + apiKey + "&units=metric";

    await fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          outsideTemp = data.main.temp;
          outsideHum = data.main.humidity;
          console.log(measurement+" = sensor. Outside Temperature: ", outsideTemp);
          console.log("Outside Humidity: ", outsideHum);
        })
        .catch(error => console.error(error));

    const dataLength = Object.keys(data).length

    if(dataLength == 0){                            //todo check outside temperature and contrast (API?)
        return ["There is no data for "+measurement+" in this period...", 0, 0, 0, errors]
    }

    for(var i = 0; i < dataLength; i++)
    {
        var point = Object.values(data)[i]

        average += point

        if(point > max || max == null) {            // max won't have value at start
            max = point
        }
        if(point > threshold[1]) {
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
            highDataTime[highDataTime.length - 1] = Object.keys(data)[i-1] // adding end time
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
            lowDataTime[lowDataTime.length - 1] = Object.keys(data)[i-1] // adding end time
            lowCounter = 0
        }
    }

    const hours = (warningPeriod/12).toFixed(2)
    if(max > threshold[1]) {

        dataWarning += "WARNING: Excessive "+measurement+" above "+threshold[1]+unit+" has been detected at the following time(s):"
        while(highDataTime.length > 1){
            dataWarning += "\n\t- From "+highDataTime.shift()+" To "+highDataTime.shift()
        }
        if(highDataTime.length != 0){
            dataWarning += "\nWARNING: There still seems to be high readings that have not fallen since "+highDataTime.shift()
        }
        if(highStreak > warningPeriod){ // readings are every five mins, default = 144 five mins are in 12 hours.
            errors.high = true

            dataWarning += ".\nThis excessive "+measurement+" has been detected for over "+hours+" hour(s), "
            if(measurement == "Humidity"){
                dataWarning += extraAnalysis.highHumidity
            }
            if(measurement == "Temperature"){
                dataWarning += extraAnalysis.highTemperature
            }
        }
    }
    if(min < threshold[0]) {
        if(dataWarning != ""){
            dataWarning += "\n\n"
        }

        dataWarning += "WARNING: Excessive "+measurement+" below "+threshold[0]+unit+" has been detected at the following time(s):"
        while(lowDataTime.length > 1){
            dataWarning += "\n\t- From "+lowDataTime.shift()+" To "+lowDataTime.shift()
        }
        if(lowDataTime.length != 0){
            dataWarning += "\nWARNING: There still seems to be low readings that have not risen since "+highDataTime.shift()
        }
        if(lowStreak > warningPeriod){ // readings are every five mins, 12 five mins are in 1 hour.
            errors.low = true

            dataWarning += ".\nThis excessive "+measurement+" has been detected for over "+hours+" hour(s), "
            if(measurement == "Humidity"){
                dataWarning += extraAnalysis.lowHumidity
            }
            if(measurement == "Temperature"){
                dataWarning += extraAnalysis.lowTemperature
            }
        }
    }

    if(dataWarning != ""){
        dataWarning += "\n\n"
    }

    average = Math.round(average/dataLength)
    analytics = dataWarning+"Average "+measurement+" in this selected period: "+average+unit+". A minimum value of "+min+unit+" was found, and a maximum of "+max+unit
    
    if(measurement == "Humidity"){
        analytics += extraAnalysis.recommendedHum
        if (outsideHum != 0){
            analytics += extraAnalysis.outsideHumidity+outsideHum+unit
        }
    }
    else if(measurement == "Temperature" && outsideTemp != null){
        analytics += extraAnalysis.outsideTemperature+outsideTemp+unit
    }

    console.log(analytics)
    return [analytics, max, min, average, errors]
}

function analyseLPG(data, warningPeriod=6){
    var average = 0
    var max = null
    var min = null
    var analytics = ""
    var LPGWarning = ""
    var highLPGTime = []
    var highCounter = 0
    var highStreak = 0
    var direWarning = ""
    const errors = {
        high: false,
        low: false,
        fatal: false,
        measurement: "LPG"
    }
    var fatalCounter = 0

    const dataLength = Object.keys(data).length

    if(dataLength == 0){
        return ["There is no data for LPG in this period...", 0, 0, 0, errors]
    }

    for(var i = 0; i < dataLength; i++)
    {
        var point = Object.values(data)[i]

        average += point

        if(point > max || max == null) {            // max won't have value at start
            max = point
        }
        if(point > 15) {
            if(point > 50){                        // life threatening values, user will already be called
                fatalCounter++
                if(fatalCounter > 3){
                    errors.fatal = true
                    direWarning = "WARNING: LPG levels have exceeded safe limits, PLEASE take immediate actions. A measure of "+point+"ppm of LPG has been measured in your home, this has the potential to be FATAL!\n\n"
                }
            }
            else{
                fatalCounter = 0
            }                            
            if(highCounter == 0){
                highLPGTime.push(Object.keys(data)[i])  // adding start time
                highLPGTime.push("end of results.")
            }
            highCounter++                           // counter on how long there has been high data in one sitting
        }
        else if(highCounter > 0){                   // if data goes below threshold, reset counter
            if(highCounter > highStreak){
                highStreak = highCounter
            }
            highLPGTime[highLPGTime.length - 1] = Object.keys(data)[i-1] // adding end time
            highCounter = 0
        }

        if(point < min || min == null) {          
            min = point 
        }
    }

    const earlyPoint = data[Math.round(dataLength*0.1)]   // measuring early and late points to see if values have risen
    const latePoint = data[Math.round(dataLength*0.9)]
    const diff = latePoint - earlyPoint

    if(max > 15) {
        LPGWarning = "ACTION IS NEEDED. WARNING: Excessive LPG levels above 15ppm has been detected at the following time(s):"
        while(highLPGTime.length > 1){
            LPGWarning += "\n\t- From "+highLPGTime.shift()+" To "+highLPGTime.shift()
        }
        if(highStreak > warningPeriod){ // readings are every five mins, default = 6 five mins are in 1/2 hour.
            errors.high = true

            LPGWarning += "\n\nThese excessive LPG levels has been detected for over "+(warningPeriod/12).toFixed(2)+" hour(s), Action is needed to prevent physical symptons. "
            LPGWarning += extraAnalysis.dangerousLPG
        }
    }
    else if(diff > 10){                         // no need to talk about difference if emergency action is needed.
        LPGWarning = "Warning: LPG levels have been rising over this period. "+extraAnalysis.risingLPG
    }
    else if(diff < -5){
        analytics += "LPG levels have fallen this period. This is a good outcome.\n"
    }
    
    if(LPGWarning != ""){
        LPGWarning += "\n\n"
    }

    average = Math.round(average/dataLength)
    analytics += direWarning+LPGWarning+"Average LPG levels in this selected period: "+average+"ppm. A minimum value of "+min+"ppm was found, and a maximum of "+max+"ppm"

    console.log(analytics)
    return [analytics, max, min, average, errors]
}

function analyseSmoke(data, warningPeriod=6){
    var average = 0
    var max = null
    var min = null
    var analytics = ""
    var Warning = ""
    var highTime = []
    var highCounter = 0
    var highStreak = 0
    var direWarning = ""
    const errors = {
        high: false,
        low: false,
        fatal: false,
        measurement: "Smoke"
    }
    var fatalCounter = 0

    const dataLength = Object.keys(data).length

    if(dataLength == 0){
        return ["There is no data for Smoke in this period...", 0, 0, 0, errors]
    }

    for(var i = 0; i < dataLength; i++)
    {
        var point = Object.values(data)[i]

        average += point

        if(point > max || max == null) {            // max won't have value at start
            max = point
        }
        if(point > 200) {
            if(point > 400){                        // life threatening values, user will already be called
                fatalCounter++
                if(fatalCounter > 3){
                    errors.fatal = true
                    direWarning = "WARNING: Smoke levels have exceeded safe limits, PLEASE take immediate actions. A measure of "+point+"ppm of Smoke has been measured in your home, this has the potential to be FATAL!\n\n"
                }
            }
            else{
                fatalCounter = 0
            }                            
            if(highCounter == 0){
                highTime.push(Object.keys(data)[i])  // adding start time
                highTime.push("end of results.")
            }
            highCounter++                           // counter on how long there has been high data in one sitting
        }
        else if(highCounter > 0){                   // if data goes below threshold, reset counter
            if(highCounter > highStreak){
                highStreak = highCounter
            }
            highTime[highTime.length - 1] = Object.keys(data)[i-1] // adding end time
            highCounter = 0
        }

        if(point < min || min == null) {          
            min = point 
        }
    }

    const earlyPoint = data[Math.round(dataLength*0.1)]   // measuring early and late points to see if values have risen
    const latePoint = data[Math.round(dataLength*0.9)]
    const diff = latePoint - earlyPoint

    if(max > 200) {
        Warning = "ACTION IS NEEDED. WARNING: Excessive Smoke levels above 200ppm has been detected at the following time(s):"
        while(highTime.length > 1){
            Warning += "\n\t- From "+highTime.shift()+" To "+highTime.shift()
        }
        if(highStreak > warningPeriod){ // readings are every five mins, default = 6 five mins are in 1/2 hour.
            errors.high = true

            Warning += "\n\nThese excessive Smoke levels has been detected for over "+(warningPeriod/12).toFixed(2)+" hour(s), Action is needed to prevent physical symptons. "
            Warning += extraAnalysis.dangerousSmoke
        }
    }
    else if(diff > 30){                         // no need to talk about difference if emergency action is needed.
        Warning = "Warning: Smoke levels have been rising over this period. "+extraAnalysis.risingSmoke
    }
    else if(diff < -10){
        analytics += "Smoke levels have fallen this period. This is a good outcome.\n"
    }

    if(Warning != ""){
        Warning += "\n\n"
    }
    average = Math.round(average/dataLength)
    analytics += direWarning+Warning+"Average Smoke levels in this selected period: "+average+"ppm. A minimum value of "+min+"ppm was found, and a maximum of "+max+"ppm"

    console.log(analytics)
    return [analytics, max, min, average, errors]
}

function analyseCO(data, warningPeriod=6){
    var average = 0
    var max = null
    var min = null
    var analytics = ""
    var COWarning = ""
    var highCOTime = []
    var highCounter = 0
    var highStreak = 0
    var direWarning = ""
    const errors = {
        high: false,
        low: false,
        fatal: false,
        measurement: "CO"
    }
    var fatalCounter = 0

    const dataLength = Object.keys(data).length

    if(dataLength == 0){
        return ["There is no data for CO in this period...", 0, 0 ,0, errors]
    }

    for(var i = 0; i < dataLength; i++)
    {
        var point = Object.values(data)[i]

        average += point

        if(point > max || max == null) {            // max won't have value at start
            max = point
        }
        if(point > 25) {
            if(point > 100){                        // life threatening values, user will already be called
                fatalCounter++
                if(fatalCounter > 3){
                    errors.fatal = true
                    direWarning = "WARNING: CO levels have exceeded safe limits, PLEASE take immediate actions. A measure of "+point+"ppm of CO has been measured in your home, this has the potential to be FATAL!\n\n"
                }
            }
            else{
                fatalCounter = 0
            }                              
            if(highCounter == 0){
                highCOTime.push(Object.keys(data)[i])  // adding start time
                highCOTime.push("end of results.")
            }
            highCounter++                           // counter on how long there has been high data in one sitting
        }
        else if(highCounter > 0){                   // if data goes below threshold, reset counter
            if(highCounter > highStreak){
                highStreak = highCounter
            }
            highCOTime[highCOTime.length - 1] = Object.keys(data)[i-1] // adding end time
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
        if(highStreak > warningPeriod){ // readings are every five mins, default = 6 five mins are in 1/2 hour.
            errors.high = true

            COWarning += "\n\nThese excessive CO levels has been detected for over "+(warningPeriod/12).toFixed(2)+" hour(s), Action is needed to prevent physical symptons. "
            COWarning += extraAnalysis.dangerousCO
        }
    }
    else if(diff > 10){                         // no need to talk about difference if emergency action is needed.
        COWarning = "Warning: CO levels have been rising over this period. "+extraAnalysis.risingCO
    }
    else if(diff < -5){
        analytics += "CO levels have fallen this period. This is a good outcome.\n"
    }

    average = Math.round(average/dataLength)
    if(COWarning != ""){
        COWarning += "\n\n"
    }
    analytics += direWarning+COWarning+"Average CO levels in this selected period: "+average+"ppm. A minimum value of "+min+"ppm was found, and a maximum of "+max+"ppm"

    console.log(analytics)
    return [analytics, max, min, average, errors]
}

export {analyseBasic, analyseLPG, analyseSmoke, analyseCO}