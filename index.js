var cardHolder = $('#card-holder');
var searchForm = $('#search-form');
submitbtn = $('#submit');

var temp = 0;
var averageTemp = 0;
var windSpeed = 0;
var averageWindSpeed = 0;
var humidity = 0;
var averageHumidity = 0;
var weather = [];
var icon;
var t;

//Checks if day or night, to change icons
if (moment().format('H') >= 20) {
  t = 'n';
} else {
  t = 'd';
}

submitbtn.click(function(e){
    e.preventDefault();
    var cityEl = $('#city-search').val();
    var queryURL = `http://api.openweathermap.org/data/2.5/forecast?q=${cityEl}&units=imperial&APPID=2eccc5069a92b45c4e66fa64bfe81446`
    $.ajax({
      url: queryURL.replace(/\s/g, "+"),
      method: 'GET',
  }).then(function(r) {
      cardHolder.empty();
      let city = r.city.name;
      let dailyForecast = r.list;
      console.log(city);
      //console.log(r);
      buildWeatherCards(dailyForecast,city);
  });
})

function mode(arr){
  return arr.sort((a,b) =>
        arr.filter(v => v===a).length
      - arr.filter(v => v===b).length
  ).pop();
}

function findIcon(likelyWeather) {
  if (likelyWeather === 'Drizzle') {
    icon = `09${t}`;
  } else if (likelyWeather === 'Rain') {
    icon = `10${t}`;
  } else if (likelyWeather === 'Snow') {
    icon = `13${t}`;
  } else if (likelyWeather === 'Clear') {
    icon = `01${t}`;
  } else if (likelyWeather === 'Clouds') {
    icon = `03${t}`;
  } else {
    icon = '50d';
  }
  return icon;
}

function buildWeatherCards(dailyForecast,city) {
  for (var i = 0; i < dailyForecast.length; i += 8) {
    temp = 0;
    averageTemp = 0;
    windSpeed = 0;
    averageWindSpeed = 0;
    humidity = 0;
    averageHumidity = 0;
    weather = [];
    for(var j = 0; j < 8; j++) {
      temp += dailyForecast[(i+j)].main.temp;
      windSpeed += dailyForecast[(i+j)].wind.speed;
      humidity += dailyForecast[(i+j)].main.humidity;
      weather.push(dailyForecast[(i+j)].weather[0].main);
    }
    averageTemp = Math.round(temp/8);
    averageWindSpeed = Math.round(windSpeed/8);
    averageHumidity = Math.round(humidity/8);
    likelyWeather = mode(weather);
    var newCard = ($(`<div class='col-sm-3 col-xs-9 m-1 ml-1 p-0'><div class="card">
    <div class="card-body">
      <p class="card-text">${city}</p>
      <p class="card-text">${moment(dailyForecast[i].dt_txt).format('dddd')}</p>
      <p class="card-text">${moment(dailyForecast[i].dt_txt).format('L')}</p>
      <p class="card-text">${averageTemp}&#176</p>
      <p class="card-text">Wind: ${averageWindSpeed}mph</p>
      <p class="card-text">Humidity: ${averageHumidity}</p>
      <p class="card-text">${likelyWeather}</p>
      <img src="http://openweathermap.org/img/w/${findIcon(likelyWeather)}.png">
    </div>
    </div></div>`));
    cardHolder.append(newCard);
  }
}