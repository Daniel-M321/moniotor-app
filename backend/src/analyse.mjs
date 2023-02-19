
function analyseHumidData(data, warningPeriod=288){
    var average = 0
    var max = null
    var min = null
    var analytics = ""
    var humWarning = ""
    var lowHumTime = []
    var highHumTime = []
    var highCounter = 0
    var lowCounter = 0
    var highStreak = 0
    var lowStreak = 0

    const dataLength = Object.keys(data).length
    for(var i = 0; i < dataLength; i++)
    {
        var point = Object.values(data)[i]

        average += point

        if(point > max || max == null) { // max won't have value at start
            max = point
        }
        if(point > 75) {                            // online answer of high humidity in UK
            highHumTime.push(Object.keys(data)[i])  // list of high humidity times
            highCounter++                           // counter on how long there has been high humidity in one sitting
        }
        else if(highCounter > 0){                   // if humidity goes below threshold, reset counter
            if(highCounter > highStreak){
                highStreak = highCounter
            }
            highCounter = 0
        }

        if(point < min || min == null) {            // vice versa for low
            min = point 
        }
        if(point < 20) {
            lowHumTime.push(Object.keys(data)[i])
            lowCounter++
        }
        else if(lowCounter > 0){
            if(lowCounter > lowStreak){
                lowStreak = lowCounter
            }
            lowCounter = 0
        }

    }
    if(max > 75) {
        humWarning = ". WARNING: Excessive Humidity above 75% have been detected at "+highHumTime
        if(highStreak > warningPeriod){ // readings are every five mins, 288 five mins are in 24 hours.
            humWarning += ". This excessive humidity has been detected for over 24 hours, there is a risk of mould growth at this level. This level of humidity can also be unhealthy and leave a person lethargic."
        }
    }
    if(min < 20) {
        humWarning = ". Warning: Excessive Humidity below 20% have been detected at "+lowHumTime
        if(lowStreak > warningPeriod){ // readings are every five mins, 288 five mins are in 24 hours.
            humWarning += ". This excessive humidity has been detected for over 24 hours, there is a risk of irritation to skin and nasal passages and possible respiratory illnesses. If you have any respiratory issues, consider raising the humidity for health reasons."
        }
    }

    average = average/dataLength
    analytics = "Average Humidity in this selected period: "+average+"%. A minimum value of "+min+"% was found, and a maximum of "+max+"%"+humWarning
    
    console.log(analytics)
    return analytics
}

function analyseTempData(data){
    var average = 0
    var max = null
    var min = null
    var analytics = ""
    var tempWarning = ""
    var lowTempTime = []
    var highTempTime = []

    const dataLength = Object.keys(data).length
    for(var i = 0; i < dataLength; i++)
    {
        var point = Object.values(data)[i]

        average += point

        if(point > max || max == null)
            max = point
        if(point > 30)
            highTempTime.push(Object.keys(data)[i])
        if(point < min || min == null)
            min = point
        if(point < 10)
            lowTempTime.push(Objects.keys(data)[i])

    }
    if(max > 30)
        tempWarning = ". WARNING: Excessive temperatures above 30*C have been detected at "+highTempTime
    if(min < 10)
        tempWarning = ". Warning: Excessive temperatures below 10*C have been detected at "+lowTempTime

    average = average/dataLength
    analytics = "Average temperature in this selected period: "+average+"*C. A minimum value of "+min+"*C was found, and a maximum of "+max+"*C"+tempWarning
    
    console.log(analytics)
    return analytics
}

export {analyseHumidData, analyseTempData}