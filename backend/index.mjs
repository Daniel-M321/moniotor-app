import {queryTime} from './influx/queryDB.mjs'

import {fileURLToPath} from 'node:url'
import express from 'express'

const app = express();
const PORT = process.env.PORT || 8081;
const dirName = fileURLToPath(new URL('./', import.meta.url))
app.use(express.static(dirName, {index: false}))

app.get("/", (request, response) => {
    response.status(200).json({ message: "Psst Go away, this is the backend Express Server!" });
});

app.get("/queryinflux", (request, response) => {
    queryTime(request.query).then(data => {
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