import sinon from 'sinon';
import test from 'unit.js';

import {InfluxDB} from '@influxdata/influxdb-client'
import {queryTime} from '../queryDB.mjs';

describe('Test queryTime', () => {

    let influxDbMock;
    let collectRowsStub;
    beforeEach(() => {
        // Create a mock for the InfluxDB client and its methods
        influxDbMock = sinon.createStubInstance(InfluxDB);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should call for data rows from InfluxDB', async () => {
        // Arrange
        const queryApiMock = {
            collectRows: sinon.stub().resolves([]),
        };
        influxDbMock.getQueryApi.returns(queryApiMock);
    
        const req_params = {
            measurement: 'Temperature',
            period: '30',
            p_unit: 'Day(s)',
        };
    
        // Act
        var result = await queryTime(req_params, queryApiMock);

        const expectedQuery = {
            fluxValue: 'from(bucket:"sensors") \n' +
              '    |> range(start: duration(v: "-30d"), stop: now()) \n' +
              '    |> filter(fn: (r) => r._measurement == "Temperature")'
          };
        test.assert(queryApiMock.collectRows.calledWithMatch(expectedQuery));
    });

    it('should default to a period of 30 days if period and p_unit are not provided', async () => {
        // Arrange
        const queryApiMock = {
            collectRows: sinon.stub().resolves([]),
        };
        influxDbMock.getQueryApi.returns(queryApiMock);
    
        const req_params = {
            measurement: 'Temperature',
        };
    
        // Act
        await queryTime(req_params, queryApiMock);
        console.log(queryApiMock.collectRows.getCall(0).args)
    
        const expectedQuery = {
            fluxValue: 'from(bucket:"sensors") \n' +
                '    |> range(start: duration(v: "-30d"), stop: now()) \n' +
                '    |> filter(fn: (r) => r._measurement == "Temperature")'
        };
        test.assert(queryApiMock.collectRows.calledWithMatch(expectedQuery));
    });

    it('should return data in lineBarData', async () => {
        // Arrange
        const queryApiMock = {
          collectRows: sinon.stub().resolves([
            {
              _time: '2022-03-11T13:00:00Z',
              _measurement: 'Temperature',
              _value: 22.5
            }
          ]),
        };
        influxDbMock.getQueryApi.returns(queryApiMock);
      
        const req_params = {
          measurement: 'Temperature',
          period: '30',
          p_unit: 'Day(s)',
        };
      
        // Act
        const result = await queryTime(req_params, queryApiMock);
      
        // Assert
        test.assert.equal(Object.keys(result.lineBarData).length, 1);
        test.assert(result.analytics !== "");
      });
});