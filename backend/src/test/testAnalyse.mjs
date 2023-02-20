import test from 'unit.js';
import {analyseSTD} from '../analyse.mjs'


describe('Temperature value analysis test', function(){
    it('normal temps', function(){
        var tempAnalysis = analyseSTD({
            "14.53:12-2-2023": 23,
            "14.57:12-2-2023": 26,
            "15.02:12-2-2023": 29
        }, "Temperature", [10, 30], "*C")

        test.assert.equal(
            tempAnalysis,
            "Average Temperature in this selected period: 26*C. A minimum value of 23*C was found, and a maximum of 29*C"
        )
    })
    it('high temps', function(){

        const tempAnalysis = analyseSTD({
            "14.53:12-2-2023": 36,
            "14.57:12-2-2023": 33,
            "15.02:12-2-2023": 27
        }, "Temperature", [10, 30], "*C")

        test.assert.equal(
            tempAnalysis,
            "Average Temperature in this selected period: 32*C. A minimum value of 27*C was found, and a maximum of 36*C. WARNING: Excessive Temperature above 30*C has been detected at the following times, From 14.53:12-2-2023 To 15.02:12-2-2023"
        )
    })
})

describe('Humidity value analysis test', function(){
    it('normal humidity', function(){
        var humAnalysis = analyseSTD({
            "14.53:12-2-2023": 50,
            "14.57:12-2-2023": 55,
            "15.02:12-2-2023": 60
        }, "Humidity", [20, 75], "%")

        test.assert.equal(
            humAnalysis,
            "Average Humidity in this selected period: 55%. A minimum value of 50% was found, and a maximum of 60%"
        )
    })
    it('low humidity', function(){

        const humAnalysis = analyseSTD({
            "14.53:12-2-2023": 15,
            "14.57:12-2-2023": 18,
            "15.02:12-2-2023": 21
        }, "Humidity", [20, 75], "%")

        test.assert.equal(
            humAnalysis,
            "Average Humidity in this selected period: 18%. A minimum value of 15% was found, and a maximum of 21%. Warning: Excessive Humidity below 20% has been detected at the following times, From 14.53:12-2-2023 To 15.02:12-2-2023"
        )
    })
    it('low humidity, long period', function(){

        const humAnalysis = analyseSTD({
            "14.53:12-2-2023": 15,
            "14.57:12-2-2023": 18,
            "15.02:12-2-2023": 21
        }, "Humidity", [20, 75], "%", 1)

        test.assert.equal(
            humAnalysis,
            "Average Humidity in this selected period: 18%. A minimum value of 15% was found, and a maximum of 21%. Warning: Excessive Humidity below 20% has been detected at the following times, From 14.53:12-2-2023 To 15.02:12-2-2023. This excessive Humidity has been detected for over 0.017 hours, there is a risk of irritation to skin and nasal passages and possible respiratory illnesses. If you have any respiratory issues, consider raising the humidity for health reasons."
        )
    })
})