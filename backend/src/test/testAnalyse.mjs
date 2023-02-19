import test from 'unit.js';
import {analyseHumidData, analyseTempData} from '../analyse.mjs'


describe('Temperature value analysis test', function(){
    it('normal temps', function(){
        var tempAnalysis = analyseTempData({
            "14.53:12-2-2023": 23,
            "14.57:12-2-2023": 26,
            "15.02:12-2-2023": 29
        })

        test.assert.equal(
            tempAnalysis,
            "Average temperature in this selected period: 26*C. A minimum value of 23*C was found, and a maximum of 29*C"
        )
    })
    it('high temps', function(){

        const tempAnalysis = analyseTempData({
            "14.53:12-2-2023": 36,
            "14.57:12-2-2023": 33,
            "15.02:12-2-2023": 27
        })

        test.assert.equal(
            tempAnalysis,
            "Average temperature in this selected period: 32*C. A minimum value of 27*C was found, and a maximum of 36*C. WARNING: Excessive temperatures above 30*C have been detected at 14.53:12-2-2023,14.57:12-2-2023"
        )
    })
})

describe('Humidity value analysis test', function(){
    it('normal humidity', function(){
        var humAnalysis = analyseHumidData({
            "14.53:12-2-2023": 50,
            "14.57:12-2-2023": 55,
            "15.02:12-2-2023": 60
        })

        test.assert.equal(
            humAnalysis,
            "Average Humidity in this selected period: 55%. A minimum value of 50% was found, and a maximum of 60%"
        )
    })
    it('low humidity', function(){

        const humAnalysis = analyseHumidData({
            "14.53:12-2-2023": 15,
            "14.57:12-2-2023": 18,
            "15.02:12-2-2023": 21
        })

        test.assert.equal(
            humAnalysis,
            "Average Humidity in this selected period: 18%. A minimum value of 15% was found, and a maximum of 21%. Warning: Excessive Humidity below 20% have been detected at 14.53:12-2-2023,14.57:12-2-2023"
        )
    })
    it('low humidity, long period', function(){

        const humAnalysis = analyseHumidData({
            "14.53:12-2-2023": 15,
            "14.57:12-2-2023": 18,
            "15.02:12-2-2023": 21
        }, 1)

        test.assert.equal(
            humAnalysis,
            "Average Humidity in this selected period: 18%. A minimum value of 15% was found, and a maximum of 21%. Warning: Excessive Humidity below 20% have been detected at 14.53:12-2-2023,14.57:12-2-2023. This excessive humidity has been detected for over 24 hours, there is a risk of irritation to skin and nasal passages and possible respiratory illnesses. If you have any respiratory issues, consider raising the humidity for health reasons."
        )
    })
})