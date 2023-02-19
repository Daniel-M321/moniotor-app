
function analyseData(data){
    var analytics = ""

    const lastTime = new Date(Object.keys(data)[Object.keys(data).length-1]).getTime() 
    const firstTime = new Date(Object.keys(data)[0]).getTime() 

    var difference = lastTime - firstTime
    analytics = "The difference between times in this data is "+difference+" milliseconds"

    console.log(analytics)
    return analytics
}

export {analyseData}