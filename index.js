var express = require('express');
var unirest = require('unirest');
require('datejs');
var _ = require('lodash');
// Twilio Credentials
var accountSid = 'AC129b0323812ab3abc77f733f1dce22c1';
var authToken = '1a1a24fd726808a5e507a4988583c94b';
//require the Twilio module and create a REST client
var twilio = require('twilio')(accountSid, authToken);
//the server
var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(express.static('client'));
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));

});
//endpoint for testing SMS
app.all('/snowText', function(request, response) {
        twilio.messages.create({
            to: "+18473379845",
            from: "+16305239634",
            body: "Hey Swagata! Wear a coat tomorrow! It will snow."
        }, function(err, message) {
            console.log(message.sid);
            console.log(message.status);
            if (message.status === 'accepted' ||
                message.status === 'queued')
                response.status(200).send(message.uri);
            else
                response.status(500).send(err);
        });
    })
//Main endpoint
app.all('/weather', function(request, response) {
    var openWeatherURL = 'http://api.openweathermap.org/data/2.5/forecast?q=Chicago&units=metric&appid=2d589af36e84627d0b7ea0a51ceccf0c';
    processGet(request, response, openWeatherURL);
});
//make call with unirest
function processGet(requestFromClient, responseToClient, targetUrl, query) {
    var Request = unirest.get(targetUrl)
        .header(requestFromClient.headers)
        .qs(query)
        .end(function(response) {
            responseToClient.set('Content-Type', 'application/json');
            if (response.code !== undefined) {
                var timeStart = { hour: 08, minute: 00 };
                var timeEnd = { hour: 20, minute: 00 };
                var startT = ((1).day().fromNow().at(timeStart)).getTime();
                var endT = ((1).day().fromNow().at(timeEnd)).getTime();

                var plist = _.filter(_.filter(response.body.list, function(o) {
                    return ((o.dt * 1000) > startT && (o.dt * 1000) < endT);
                }), function(p) {
                    return (p.weather[0].description).toUpperCase().indexOf("SNOW") !== -1;
                })
                if (plist.length > 0) {
                    twilio.messages.create({
                        to: "+18473379845",
                        from: "+16305239634",
                        body: "Hey Swagata! Take your warm coat tomorrow! It will snow."
                    }, function(err, message) {
                        console.log(message.sid);
                        console.log(message.status);
                    });
                }
                responseToClient.status(response.code).send(plist);
            } else {
                responseToClient.status(500).send(response.code);
            }
        });
}
