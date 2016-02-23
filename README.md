## Checking Twilio out with a simple app.

### What the app does

Looks at a weather API from http://openweathermap.org/ and figures out if it's
going to snow the next day between 9 am and 7 pm. If yes, the program uses the
Twilio API to send a text alert to my wife, reminding her to wear a coat the
day after.

### How to run
`curl https://shrouded-river-30351.herokuapp.com/weather`
I have a cron job setup on my laptop that runs this in the evening.

### Basic design

- Express based web server responds to http request by making a call to
openweathermap for a 5 day report.
- Use lodash to filter out any data point outside of tomorrow
- Filter out results without indication of snow.
- If what remains > 0, send text and respond with list of data points.

### Future iterations
 - Remove all the hardcoding
 - Expose a web endpoint to register for snow alerts
 - Expose mesasge.uri for updates checking.
