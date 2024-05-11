document.getElementById("get-weather").addEventListener("click", function () {
  var cityName = document.getElementById("city-input").value;
  // Show a timer icon and disable the button while waiting
  document.getElementById("get-weather").innerHTML = "⏳ Loading...";
  document.getElementById("get-weather").disabled = true;

  setTimeout(function () {
    fetch(
      "http://api.openweathermap.org/data/2.5/weather?q=" +
        cityName +
        "&appid=35bec7975453a194a19f31a4f6bcba1a"
    )
      .then((response) => response.json())
      .then((data) => {
        var tempInCelsius = data.main.temp - 273.15;
        document.getElementById("weather-data").innerHTML =
          "🌡️ Temperature: " +
          tempInCelsius.toFixed(2) +
          "°C<br> 💧 Humidity: " +
          data.main.humidity +
          "%";
        // Restore the button text and enable the button when done
        document.getElementById("get-weather").innerHTML = "Get Weather";
        document.getElementById("get-weather").disabled = false;
      })
      .catch(() => {
        console.log(alert("🚫 City not found!"));
        // Restore the button text and enable the button when an error occurs
        document.getElementById("get-weather").innerHTML = "Get Weather";
        document.getElementById("get-weather").disabled = false;
      });
  }, 300); // Delay the fetch by 300ms
});