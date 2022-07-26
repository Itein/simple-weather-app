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

function showForecast() {
  let forecastElement = document.querySelector("#forecast-for-next-days");
  let forecastHTML = `<div class="row">`;
  let days = ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `<div class="col">
              <div class="day-in-forecast">${day}</div>
              <img
                src="http://openweathermap.org/img/wn/09d@2x.png"
                class="forecast-img"
              />
              <span id="max-temperature">28</span> /
              <span id="min-temperature">18</span>
            </div>`;
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
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
}

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
