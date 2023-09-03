const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { time } = require("console");


const app = express();
//get info after posting
app.use(bodyParser.urlencoded({ extended: true }));

// static site
app.use(express.static('public'));

// setting view folder
app.set('view engine', 'ejs');


const days = ['SUNDAY', 'MONDAY', 'TUEDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const api_key = '&appid=85a3ffd9d6d2345cf26c662ce305d3b9&&units=metric';


app.get("/", (req, res) => {

    let city = "delhi";
    let url = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + api_key;

    // https post
    https.get(url, (response) => {
        // collecting response data in buffer(hexadecimal format) dataType
        response.on("data", (data) => {
            const weatherData = JSON.parse(data); //explixtly coverting into objectData

            let bg = getCitybg(weatherData);
            let cityDate = getCityDate(weatherData);
            let temp = weatherData.main.temp;
            temp = Math.floor(temp);
            let humid = weatherData.main.humidity;
            let desc = weatherData.weather[0].main;
            let icon = weatherData.weather[0].icon;
            let wind = weatherData.wind.speed;
            let pressuer = weatherData.main.pressure;
            let cityName = weatherData.name;
            let bgTime = weatherData.weather[0].main;
            let bgMain = bg +"-" + bgTime;
            console.log(bgMain);

            // console.log(bg + " " + cityDate + " " + temp + " " + humid + " " + desc + " " + icon + " " + wind + " " + pressuer + " " + cityName);
            
            let urlFore = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + api_key;
            https.get(urlFore, (respo) => {
                
                // collecting response data in buffer(hexadecimal format) dataType
                respo.on("data", (data) => {
                    const forecastData = JSON.parse(data); //explixtly coverting into objectData
                    let minTemp = [];
                    let maxTemp = [];
                    let forIcon = [];

                    for(var i = 0 ; i<5 ; i++){
                        minTemp.push(forecastData.list[i].main.temp_min);
                        maxTemp.push(forecastData.list[i].main.temp_max);
                        forIcon.push(forecastData.list[i].weather[0].icon);
                    }

                    res.render("index" , {
                        tempRender : temp,
                        cityRender : cityName,
                        cityDateRender : cityDate,
                        descRender : desc,
                        iconRender : icon,
                        pressureRender : pressuer,
                        humidRender : humid,
                        windSpeedRender : wind,
                        forIconRender : forIcon,
                        minTempRender : minTemp,
                        maxTempRender : maxTemp,
                        bgRender : bgMain
                    })
                })
            })
        })
    })

})

app.post("/", (req, res) => {

    let city = req.body.city;

    let url = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + api_key;


    // https post
    https.get(url, (response) => {

        // collecting response data in buffer(hexadecimal format) dataType
        response.on("data", (data) => {
            const weatherData = JSON.parse(data); //explixtly coverting into objectData

            let bg = getCitybg(weatherData);
            let cityDate = getCityDate(weatherData);
            let temp = weatherData.main.temp;
            temp = Math.floor(temp);
            let humid = weatherData.main.humidity;
            let desc = weatherData.weather[0].main;
            let icon = weatherData.weather[0].icon;
            let wind = weatherData.wind.speed;
            let pressuer = weatherData.main.pressure;
            let cityName = weatherData.name;
            let bgTime = weatherData.weather[0].main;
            let bgMain = bg +"-" + bgTime;
            console.log(bgMain);

            // console.log(bg + " " + cityDate + " " + temp + " " + humid + " " + desc + " " + icon + " " + wind + " " + pressuer + " " + cityName);
            
            let urlFore = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + api_key;
            try{
                https.get(urlFore, (respo) => {
                
                    // collecting response data in buffer(hexadecimal format) dataType
                    respo.on("data", (data) => {
                        const forecastData = JSON.parse(data); //explixtly coverting into objectData
                        let minTemp = [];
                        let maxTemp = [];
                        let forIcon = [];
    
                        for(var i = 0 ; i<5 ; i++){
                            minTemp.push(forecastData.list[i].main.temp_min);
                            maxTemp.push(forecastData.list[i].main.temp_max);
                            forIcon.push(forecastData.list[i].weather[0].icon);
                        }
    
                        res.render("index" , {
                            tempRender : temp,
                            cityRender : cityName,
                            cityDateRender : cityDate,
                            descRender : desc,
                            iconRender : icon,
                            pressureRender : pressuer,
                            humidRender : humid,
                            windSpeedRender : wind,
                            forIconRender : forIcon,
                            minTempRender : minTemp,
                            maxTempRender : maxTemp,
                            bgRender : bgMain
                        })
                    })
                })
            }

            catch(error){
                res.send("<center><h1> ERROR</h1><p>city data not available in api </p></center>");
            }
        })
    });
})

app.listen(process.env.PORT || 3000, ()=>{
    console.log("server started : 3000");
  })


function getCityDate(weatherData) {

    let utcSeconds = weatherData.dt + weatherData.timezone;
    let d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(utcSeconds); //converting epoch to normal date-time;

    let day = days[d.getUTCDay()];
    let month = months[d.getMonth()];
    let dt = d.getUTCDate();
    let time = d.getUTCHours() + ":" + d.getUTCMinutes();
    let date = time + "-" + day + " " + month + " " + dt;
    return date;
}

function getCitybg(weatherData) {
    let dt = parseInt(weatherData.dt);
    let sunrise = parseInt(weatherData.sys.sunrise);
    let sunset = parseInt(weatherData.sys.sunset);

    let b = dt < sunrise ? "night" : dt < sunset ? "day" : "night";
    return (b);

}

// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// api.openweathermap.org/data/2.5/forecast?q=' + city + api_key