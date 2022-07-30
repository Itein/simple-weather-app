//Day and time of update for current weather
function formatDate(timestap) {
  let now = new Date(timestap);
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentDay = days[now.getDay()];
  document.querySelector("#day-of-week").innerHTML = currentDay;
  return `${hours}:${minutes}`;
}
//Days for Five-day forecast
function formatDayForForecast(timestap) {
  let date = new Date(timestap * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}
//Five-day forecast
function showForecast(response) {
  let forecast = response.data.daily.slice(1, 6);

  let forecastElement = document.querySelector("#forecast-for-next-days");
  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (nextDaysForecast) {
    forecastHTML =
      forecastHTML +
      `<div class="col ">
              <div class="day-in-forecast">${formatDayForForecast(
                nextDaysForecast.dt
              )}</div>
              <img
                src="http://openweathermap.org/img/wn/${
                  nextDaysForecast.weather[0].icon
                }@2x.png"
                class="forecast-img"
              />
              <br/> 
              <span id="max-temperature">${Math.round(
                nextDaysForecast.temp.max
              )}°</span> /
              <span id="min-temperature">${Math.round(
                nextDaysForecast.temp.min
              )}°</span>
              
            </div>`;
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
//Coordinates of city for search
function getForecast(coordinates) {
  let key = "dab72d36ef441c0085acb35134183521";
  let units = "metric";
  let apiZeroPoint = "https://api.openweathermap.org/data/2.5/onecall?";
  let apiURL = `${apiZeroPoint}lat=${coordinates.lat}&lon=${coordinates.lon}&units=${units}&appid=${key}`;
  axios.get(apiURL).then(showForecast);
}
//Current weather
function showWeather(response) {
  let cityName = response.data.name;
  document.querySelector("h1").innerHTML = cityName;

  let weatherConditionElement = response.data.weather[0].description;
  document.querySelector("#weather-condition").innerHTML =
    weatherConditionElement;

  console.log(response);
  let temperatureElement = Math.round(response.data.main.temp);
  document.querySelector("#current-temperature").innerHTML = temperatureElement;

  let tempByFeeling = Math.round(response.data.main.feels_like);
  document.querySelector(
    "#feels-like-temperature"
  ).innerHTML = `${tempByFeeling} °C`;

  let windElement = Math.round(response.data.wind.speed);
  document.querySelector("#wind-speed").innerHTML = windElement;

  let humidityElement = response.data.main.humidity;
  document.querySelector("#humidity").innerHTML = humidityElement;

  let timeElement = formatDate(response.data.dt * 1000);
  document.querySelector("#update-time").innerHTML = timeElement;

  celsiumTemperature = response.data.main.temp;
  feelingTemprature = response.data.main.feels_like;

  let rainChek = response.data;
  let rainResult = rainChek.hasOwnProperty("rain");
  console.log(rainResult);
  if (rainResult === true) {
    let rainAlert = "Don't forget your umbrella";
    let rainIcon = `<i class="fa-solid fa-umbrella"></i>`;
    document.querySelector("#rain").innerHTML = `${rainAlert}   ${rainIcon}`;
  } else {
    let niceWeather = "";
    document.querySelector("#rain").innerHTML = niceWeather;
  }

  let weatherIcon = response.data.weather[0].icon;
  let img = new Image();
  img.src = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
  let icon = document.querySelector("#main-icon");
  icon.classList.add("main-image");
  icon.appendChild(img);
  let existingImage = icon.getElementsByTagName("img");
  if (existingImage.length) {
    existingImage[0].parentNode.replaceChild(img, existingImage[0]);
  }
  getForecast(response.data.coord);
}

//City Search
function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input");
  let apiKey = "dab72d36ef441c0085acb35134183521";
  let apiZeroPoint = "https://api.openweathermap.org/data/2.5/weather?";
  let units = "metric";
  userCity = city.value;
  let apiUrl = `${apiZeroPoint}q=${userCity}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(showWeather);
}
let citySearch = document.querySelector(".search-form");
citySearch.addEventListener("submit", handleSubmit);

//Celsium to Fahrenheit and back
function displayFahrenheitTemprature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temperature");
  let toFahrenheit = (celsiumTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(toFahrenheit);

  let tempByFeeling = document.querySelector("#feels-like-temperature");
  let feelingsToFahrenheit = (feelingTemprature * 9) / 5 + 32;
  tempByFeeling.innerHTML = `${Math.round(feelingsToFahrenheit)} °F`;
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temperature");
  temperatureElement.innerHTML = Math.round(celsiumTemperature);

  let tempByFeeling = document.querySelector("#feels-like-temperature");
  tempByFeeling.innerHTML = `${Math.round(feelingTemprature)} °C`;
}
let fahrenheitLink = document.querySelector("#fahrenheit-unit");
fahrenheitLink.addEventListener("click", displayFahrenheitTemprature);

let celsiumLink = document.querySelector("#celsium-unit");
celsiumLink.addEventListener("click", displayCelsiusTemperature);

let celsiumTemperature = null;
let feelingTemprature = null;

//Geo Location
function userLocationDetector() {
  function userLocation(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let apiKey = "dab72d36ef441c0085acb35134183521";
    let apiZeroPoint = "https://api.openweathermap.org/data/2.5/weather?";
    let units = "metric";
    let url = `${apiZeroPoint}lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
    axios.get(url).then(showWeather);
  }
  navigator.geolocation.getCurrentPosition(userLocation);
}
let currentLocationIcon = document.querySelector("#location-icon");
currentLocationIcon.addEventListener("click", userLocationDetector);

//Start city
function zeroCity(city) {
  let apiKey = "dab72d36ef441c0085acb35134183521";
  let apiZeroPoint = "https://api.openweathermap.org/data/2.5/weather?";
  let units = "metric";

  let apiUrl = `${apiZeroPoint}q=${city}&units=${units}&appid=${apiKey}`;

  axios.get(apiUrl).then(showWeather);
}
zeroCity("Kyiv");
showForecast();
