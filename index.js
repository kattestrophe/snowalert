var express = require('express');
var unirest = require('unirest');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static('client'));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

//Weather
app.all('/getWeather', function (request, response) {
	  var openWeatherURL = 'http://api.openweathermap.org/data/2.5/find?q=Chicago&units=metric&appid=2d589af36e84627d0b7ea0a51ceccf0c';
    processGet(request, response, variationStatusAPIUrl);
);

//Function to handle all Http Get Requests
function processGet(requestFromClient, responseToClient, targetUrl, query) {
    var Request = unirest.get(targetUrl)
        .header(extraHeaderRemoval(requestFromClient.headers))
        .qs(query)
        .end(function(response) {
            responseToClient.set('Content-Type', 'application/json');
            if (response.code !== undefined)
                responseToClient.send(response.code, response.body);
            else
                responseToClient.send(200, response.body);
        });
}