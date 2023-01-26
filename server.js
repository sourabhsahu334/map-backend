const express = require('express');
const request = require('request');
const app = express();
const cors= require("cors");

app.use(cors()) 
app.use(cors({
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  origin: ['http://localhost:3003', 'http://localhost:4000']
}));

const API_KEY = '013e7d218339a551f92048bc2fc624ff';
const CITIES = ['New York', 'Los Angeles','Bhopal', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'San Francisco', 'Charlotte', 'Indianapolis', 'Seattle', 'Denver', 'Washington', 'Boston', 'El Paso', 'Nashville', 'Detroit', 'Portland', 'Memphis', 'Oklahoma City', 'Las Vegas', 'Louisville', 'Baltimore', 'Milwaukee'];

app.get(`/weather`, (req, res) => {
    let start=0;
    let index=parseInt(req.params.pg);
    if (index<2){
        index=index*10;
    }
    else{
        start=index-1*10;
        index=index*10
    }
   
    let weatherData = [];
    let requests = CITIES.map(city => {
        return new Promise((resolve, reject) => {
            let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
            request(url, (err, response, body) => {
                if(err){
                    reject(err);
                }else{
                    resolve(JSON.parse(body));
                }
            });
        });
    });

    Promise.all(requests)
        .then(responses => {
         
            res.json(responses);
        })
        .catch(err => {
            res.json({error: err});
        });
});

const PORT=process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server running on port ',PORT);
});
