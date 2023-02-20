import test from 'unit.js';
import {analyseBasic, analyseCO} from '../analyse.mjs'
import {extraAnalysis} from "../assets/analyseText.mjs";



describe('Temperature value analysis test', function(){
    it('normal temps', function(){
        var tempAnalysis = analyseBasic({
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

        const tempAnalysis = analyseBasic({
            "14.53:12-2-2023": 36,
            "14.57:12-2-2023": 33,
            "15.02:12-2-2023": 27
        }, "Temperature", [10, 30], "*C")

        test.assert.equal(
            tempAnalysis,
            "Average Temperature in this selected period: 32*C. A minimum value of 27*C was found, and a maximum of 36*C. WARNING: Excessive Temperature above 30*C has been detected at the following time(s), From 14.53:12-2-2023 To 15.02:12-2-2023"
        )
    })
    it('low temps - two long periods', function(){

        const tempAnalysis = analyseBasic({
            "14.53:12-2-2023": 9,
            "14.57:12-2-2023": 7,
            "15.02:12-2-2023": 8,
            "15.07:12-2-2023": 13,
            "15.12:12-2-2023": 9,
            "15.17:12-2-2023": 7,
            "15.22:12-2-2023": 6,
            "15.27:12-2-2023": 11,
        }, "Temperature", [10, 30], "*C", 1)

        test.assert.equal(
            tempAnalysis,
            "Average Temperature in this selected period: 8.75*C. A minimum value of 6*C was found, and a maximum of 13*C. Warning: Excessive Temperature below 10*C has been detected at the following time(s), From 14.53:12-2-2023 To 15.07:12-2-2023, From 15.12:12-2-2023 To 15.27:12-2-2023. This excessive Temperature has been detected for over 0.017 hour(s), "+extraAnalysis.lowTemperature
        )
    })
})

describe('Humidity value analysis test', function(){
    it('normal humidity', function(){
        var humAnalysis = analyseBasic({
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

        const humAnalysis = analyseBasic({
            "14.53:12-2-2023": 15,
            "14.57:12-2-2023": 18,
            "15.02:12-2-2023": 21
        }, "Humidity", [20, 75], "%")

        test.assert.equal(
            humAnalysis,
            "Average Humidity in this selected period: 18%. A minimum value of 15% was found, and a maximum of 21%. Warning: Excessive Humidity below 20% has been detected at the following time(s), From 14.53:12-2-2023 To 15.02:12-2-2023"
        )
    })
    it('low humidity, long period', function(){

        const humAnalysis = analyseBasic({
            "14.53:12-2-2023": 15,
            "14.57:12-2-2023": 18,
            "15.02:12-2-2023": 21
        }, "Humidity", [20, 75], "%", 1)

        test.assert.equal(
            humAnalysis,
            "Average Humidity in this selected period: 18%. A minimum value of 15% was found, and a maximum of 21%. Warning: Excessive Humidity below 20% has been detected at the following time(s), From 14.53:12-2-2023 To 15.02:12-2-2023. This excessive Humidity has been detected for over 0.017 hour(s), "+extraAnalysis.lowHumidity
        )
    })
})
describe('CO levels analysis test', function(){
    it('High CO', function(){
        var COAnalysis = analyseCO({
            "14.53:12-2-2023": 20,
            "14.57:12-2-2023": 55,
            "15.02:12-2-2023": 54
        })

        test.assert.equal(
            COAnalysis,
            "ACTION IS NEEDED. WARNING: Excessive CO levels above 25ppm has been detected at the following time(s), From 14.57:12-2-2023 To end of results. Elavated Co levels have been detected at 15.02:12-2-2023\nAverage CO levels in this selected period: 43ppm. A minimum value of 20ppm was found, and a maximum of 55ppm"
        )
    })
})