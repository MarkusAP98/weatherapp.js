function getColorForTemperature(tempInCelsius) {
  const coldThreshold = 5; // Below this temperature, the color will be blue
  const normalThreshold = 10; // Between coldThreshold and normalThreshold, the color will be light blue
  const hotThreshold = 20; // Between normalThreshold and hotThreshold, the color will be orange
  const superHotThreshold = 28; // Above superHotThreshold, the color will be red

  let red, green, blue;
  if (tempInCelsius <= coldThreshold) {
    red = 0;
    green = 0;
    blue = 255;
  } else if (tempInCelsius <= normalThreshold) {
    const ratio =
      (tempInCelsius - coldThreshold) / (normalThreshold - coldThreshold);
    red = 0;
    green = Math.round(ratio * 255);
    blue = 255;
  } else if (tempInCelsius <= hotThreshold) {
    const ratio =
      (tempInCelsius - normalThreshold) / (hotThreshold - normalThreshold);
    red = Math.round(ratio * 255);
    green = 255;
    blue = Math.round((1 - ratio) * 255);
  } else {
    const ratio = Math.min(
      (tempInCelsius - hotThreshold) / (superHotThreshold - hotThreshold),
      1
    );
    red = 255;
    green = Math.round((1 - ratio) * 255);
    blue = 0;
  }

  // Return the color as a CSS RGB value
  return `rgb(${red}, ${green}, ${blue})`;
}

const cityInput = document.getElementById("city-input");
const getWeatherButton = document.getElementById("get-weather");
// Fetch the weather data for a city
function fetchWeather(cityName) {
  fetch(
    "http://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&appid=35bec7975453a194a19f31a4f6bcba1a"
  )
    .then((response) => response.json())
    .then((data) => {
      const tempInCelsius = data.main.temp - 273.15;
      const weatherCondition = data.weather[0].main;
      const weatherDescription = data.weather[0].description;
      const windSpeed = data.wind.speed;

      // Set the background color based on the temperature
      document.body.style.backgroundColor =
        getColorForTemperature(tempInCelsius);
      // Map weather conditions to emojis
      let weatherEmoji;
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
      // Update the weather data in the UI
      document.getElementById("weather-data").innerHTML = `
    <div class='temperature'>🌡️ ${tempInCelsius.toFixed(2)}°C</div><br>
    💧 ${data.main.humidity}%<br>
    ${weatherEmoji} ${weatherCondition}<br>
    🌬️ ${windSpeed} m/s
  `;
      // Show or hide the sun icon based on the weather condition
      if (weatherCondition === 'Clear') {
        document.getElementById('sun-icon').style.display = 'inline';
      } else {
        document.getElementById('sun-icon').style.display = 'none';
      }
      // Restore the button text and enable the button when done
      document.getElementById("get-weather").innerHTML = "Get Weather";
      document.getElementById("get-weather").disabled = false;
    })

    .catch((error) => {
      console.log("Error:", error);
      // Display a generic error message in the UI
      document.getElementById("weather-data").innerHTML =
        "🚫 An error occurred!";
      // Restore the button text and enable the button when an error occurs
      document.getElementById("get-weather").innerHTML = "Get Weather";
      document.getElementById("get-weather").disabled = false;
    });
}

// When the page loads, check if there's a city name in local storage
window.onload = function () {
  const cityName = localStorage.getItem("city");
  if (cityName) {
    document.getElementById("city-input").value = cityName;
    fetchWeather(cityName);
  }
};

getWeatherButton.addEventListener("click", () => {
  const cityName = cityInput.value;
  localStorage.setItem("city", cityName);
  getWeatherButton.innerHTML = "⏳ Loading...";
  getWeatherButton.disabled = true;
  fetchWeather(cityName);
});
cityInput.addEventListener("keyup", function (event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    getWeatherButton.click();
  }
});

// Fetch the weather data every 10 minutes
setInterval(function () {
  var cityName = localStorage.getItem("city");
  if (cityName) {
    fetchWeather(cityName);
  }
}, 600000); // 600000ms = 10 minutes
