const weatherRef = document.getElementById("weather");

// UPDATE DOM WITH DATA OR ERROR MESSAGE
function updateWeatherWidget(data) {
  // takes a data object returned from the openweather api and
  // formats it into a nice weather box.

  // note - if data.error exists, there's been a problem at
  // the location permission or API stage.

  if ("error" in data) {
    // an error has occurred, error key value has a message
    weatherRef.innerHTML = `
      <h1>Weather</h1>
      <div class="loc-and-time"><h2>Error</h2><p><span>${data.error}</span> ${data.errorDetails}</p></div>
      <div class="weather-data"></div>`;
    return;
  }

  const weatherDate = new Date(data.dt * 1000);
  const weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  weatherRef.innerHTML = `<h1>Weather</h1>
 
 <div class="loc-and-time">
   <h2>${data.name}</h2>
   <p>Last updated today at ${String(weatherDate.getHours()).padStart(
     2,
     0
   )}:${String(weatherDate.getMinutes()).padStart(2, 0)}</p>
 </div>

 <div class="weather-data">
   <img src="${weatherIcon}" />
   <div>
     <h3>${Math.round(data.main.temp)}&deg;C</h3>
     <h4>${Math.round(data.main.temp_min)} - ${Math.round(
    data.main.temp_max
  )}&deg;C</h4>
   </div>
   <p>${data.weather[0].description}</p>
 </div>
 
 <div class="powered-by">Powered by OpenWeatherMap</div>`;
}

// GET WEATHER DATA      //
async function getWeather({ latitude, longitude }) {
  const openWeatherAPIKey = "071a5ac51515a32204c01d5f04dcd753";
  const openWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${openWeatherAPIKey}`;
  try {
    const { data } = await axios.get(openWeatherURL);
    updateWeatherWidget(data);
  } catch (error) {
    updateWeatherWidget({ error: "Weather data error", errorDetails: error });
  }
}

// GET BROWSER LOCATION //
navigator.geolocation.getCurrentPosition(success, error, {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 2000,
});

function success({ coords }) {
  getWeather(coords);
}

function error({ message }) {
  updateWeatherWidget({
    error: "Location error",
    errorDetails: `${message}. Enable location services in your browser.`,
  });
}
