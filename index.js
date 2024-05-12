// Fetch the weather data for a city
function fetchWeather(cityName) {
  fetch(
    "http://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&appid=35bec7975453a194a19f31a4f6bcba1a"
  )
    .then((response) => response.json())
    .then((data) => {
      var tempInCelsius = data.main.temp - 273.15;
      var weatherCondition = data.weather[0].main;
      var weatherDescription = data.weather[0].description;

       // Map weather conditions to emojis
       var weatherEmoji;
       switch (weatherCondition) {
         case "Clear":
           weatherEmoji = "☀️";
           break;
         case "Clouds":
           weatherEmoji = "☁️";
           break;
         case "Rain":
         case "Drizzle":
         case "Mist":
           weatherEmoji = "🌧️";
           break;
         case "Thunderstorm":
           weatherEmoji = "⛈️";
           break;
         case "Snow":
           weatherEmoji = "❄️";
           break;
         default:
           weatherEmoji = "";
       }

      document.getElementById("weather-data").innerHTML =
  "🌡️ Temperature: " +
  tempInCelsius.toFixed(2) +
  "°C<br> 💧 Humidity: " +
  data.main.humidity +
  "%<br> " + weatherEmoji + " Condition: " +
  weatherCondition +
  " (" +
  weatherDescription +
  ")";
      // Restore the button text and enable the button when done
      document.getElementById("get-weather").innerHTML = "Get Weather";
      document.getElementById("get-weather").disabled = false;
    })
    .catch((error) => {
      alert("🚫 City not found!");
      console.log(error);
      // Restore the button text and enable the button when an error occurs
      document.getElementById("get-weather").innerHTML = "Get Weather";
      document.getElementById("get-weather").disabled = false;
    });
}

// When the page loads, check if there's a city name in local storage
window.onload = function() {
  var cityName = localStorage.getItem('city');
  if (cityName) {
    document.getElementById("city-input").value = cityName;
    fetchWeather(cityName);
  }
};

const cityInput = document.getElementById("city-input");
const getWeatherButton = document.getElementById("get-weather");

getWeatherButton.addEventListener("click", () => {
  const cityName = cityInput.value;
  localStorage.setItem("city", cityName);
  getWeatherButton.innerHTML = "⏳ Loading...";
  getWeatherButton.disabled = true;
  fetchWeather(cityName);
});

// Fetch the weather data every 10 minutes
setInterval(function() {
  var cityName = localStorage.getItem('city');
  if (cityName) {
    fetchWeather(cityName);
  }
}, 600000); // 600000ms = 10 minutes