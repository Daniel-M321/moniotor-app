import test from 'unit.js';
import {analyseBasic, analyseCO} from '../analyse.mjs'
import {extraAnalysis} from "../assets/analyseText.mjs";

const mockApiResponse = {
    main: {
      temp: 15,
      humidity: 50
    }
};

function mockFetch() {
    return Promise.resolve({
      json: () => Promise.resolve(mockApiResponse)
    });
}
global.fetch = mockFetch;

// tests for the analytic data that is sent back.

describe('Temperature value analysis test', function(){
    it('normal temps', async function(){
        var tempAnalysis = await analyseBasic({
            "14.53:12-2-2023": 23,
            "14.57:12-2-2023": 26,
            "15.02:12-2-2023": 29
        }, "Temperature", [10, 30], "°C")

        test.assert.equal(
            tempAnalysis[0],
            "Average Temperature in this selected period: 26°C. A minimum value of 23°C was found, and a maximum of 29°C"+extraAnalysis.outsideTemperature+"15°C"
        )
    })
    it('high temps', async function(){

        const tempAnalysis = await analyseBasic({
            "14.53:12-2-2023": 36,
            "14.57:12-2-2023": 33,
            "15.02:12-2-2023": 27
        }, "Temperature", [10, 30], "°C")

        test.assert.equal(
            tempAnalysis[0],
            "WARNING: Excessive Temperature above 30°C has been detected at the following time(s):\n\t- From 14.53:12-2-2023 To 14.57:12-2-2023"+"\n\nAverage Temperature in this selected period: 32°C. A minimum value of 27°C was found, and a maximum of 36°C"+extraAnalysis.outsideTemperature+"15°C"
        )
    })
    it('low temps - two long periods', async function(){

        const tempAnalysis = await analyseBasic({
            "14.53:12-2-2023": 9,
            "14.57:12-2-2023": 7,
            "15.02:12-2-2023": 8,
            "15.07:12-2-2023": 13,
            "15.12:12-2-2023": 9,
            "15.17:12-2-2023": 7,
            "15.22:12-2-2023": 6,
            "15.27:12-2-2023": 11,
        }, "Temperature", [10, 30], "°C", 1)

        test.assert.equal(
            tempAnalysis[0],
            "WARNING: Excessive Temperature below 10°C has been detected at the following time(s):\n\t- From 14.53:12-2-2023 To 15.02:12-2-2023\n\t- From 15.12:12-2-2023 To 15.22:12-2-2023.\nThis excessive Temperature has been detected for over 0.08 hour(s), "+extraAnalysis.lowTemperature+"\n\nAverage Temperature in this selected period: 9°C. A minimum value of 6°C was found, and a maximum of 13°C"+extraAnalysis.outsideTemperature+"15°C"
        )
    })
})

describe('Humidity value analysis test', function(){
    it('normal humidity', async function(){
        var humAnalysis = await analyseBasic({
            "14.53:12-2-2023": 50,
            "14.57:12-2-2023": 55,
            "15.02:12-2-2023": 60
        }, "Humidity", [20, 75], "%")

        test.assert.equal(
            humAnalysis[0],
            "Average Humidity in this selected period: 55%. A minimum value of 50% was found, and a maximum of 60%"+extraAnalysis.recommendedHum+extraAnalysis.outsideHumidity+"50%"
        )
    })
    it('low humidity', async function(){

        const humAnalysis = await analyseBasic({
            "14.53:12-2-2023": 15,
            "14.57:12-2-2023": 18,
            "15.02:12-2-2023": 21
        }, "Humidity", [20, 75], "%")

        test.assert.equal(
            humAnalysis[0],
            "WARNING: Excessive Humidity below 20% has been detected at the following time(s):\n\t- From 14.53:12-2-2023 To 14.57:12-2-2023\n\nAverage Humidity in this selected period: 18%. A minimum value of 15% was found, and a maximum of 21%"+extraAnalysis.recommendedHum+extraAnalysis.outsideHumidity+"50%"
        )
    })
    it('low humidity, long period', async function(){

        const humAnalysis = await analyseBasic({
            "14.53:12-2-2023": 15,
            "14.57:12-2-2023": 18,
            "15.02:12-2-2023": 21
        }, "Humidity", [20, 75], "%", 1)

        test.assert.equal(
            humAnalysis[0],
            "WARNING: Excessive Humidity below 20% has been detected at the following time(s):\n\t- From 14.53:12-2-2023 To 14.57:12-2-2023.\nThis excessive Humidity has been detected for over 0.08 hour(s), "+extraAnalysis.lowHumidity+"\n\nAverage Humidity in this selected period: 18%. A minimum value of 15% was found, and a maximum of 21%"+extraAnalysis.recommendedHum+extraAnalysis.outsideHumidity+"50%"
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
            COAnalysis[0],
            "ACTION IS NEEDED. WARNING: Excessive CO levels above 25ppm has been detected at the following time(s):\n\t- From 14.57:12-2-2023 To end of results.\n\nAverage CO levels in this selected period: 43ppm. A minimum value of 20ppm was found, and a maximum of 55ppm"
        )
    })
})