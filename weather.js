const Http = new XMLHttpRequest();
const url = 'http://api.openweathermap.org/data/2.5/weather?id=5125086&appid=6779005616f3f04892a47365ce665058';
Http.open("GET", url);
Http.send();

Http.onreadystatechange = (e) => {
  var response = Http.response;               // get data
  var weatherData = JSON.parse(response);     // format the data to JSON

  var windSpeed = weatherData.wind.speed;     // get wind speed data
  var windDirection = weatherData.wind.deg;   // get wind direction data

  var windSpeedStr = JSON.stringify(windSpeed);    // convert wind data JSON to string
  var windDirectionStr = JSON.stringify(windDirection);

  $("#windSpeed").text("Wind Speed: " + windSpeedStr + " mph");
  $("#windDirection").text("Wind Direction: " + windDirectionStr + " NE");
}
