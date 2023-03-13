import {InfluxDB} from '@influxdata/influxdb-client'
import {url, token, org} from './env.mjs'
import {queryTime} from './src/queryDB.mjs'

import {fileURLToPath} from 'node:url'
import express from 'express'

const queryApi = new InfluxDB({url, token}).getQueryApi(org)
const app = express();
const PORT = process.env.PORT || 8081;
const dirName = fileURLToPath(new URL('./', import.meta.url))
app.use(express.static(dirName, {index: false}))

app.get("/", (request, response) => {
    response.status(200).json({ message: "Psst Go away, this is the backend Express Server!" });
});

app.get("/queryinflux", (request, response) => {
    queryTime(request.query, queryApi).then(data => {
        if(!data)
            response.status(200).json({ message: "There was no data found with that query"});
        else
            response.status(200).json({info: data});
    })
});

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else 
        console.log("Error occurred, server can't start", error);
    });