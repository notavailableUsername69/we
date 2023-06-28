window.addEventListener('DOMContentLoaded', function() {
  var submitBtn = document.getElementById('submit-btn');
  var cityInput = document.getElementById('city-input');
  var weatherInfo = document.getElementById('weather-info');
  var weatherImage = document.getElementById('weather-image');
  var audio = new Audio(); // Create a new Audio object
  var currentAudioSource = ''; // Variable to track the currently playing sound effect

  submitBtn.addEventListener('click', function() {
    var cityName = cityInput.value;

    // Stop the currently playing sound effect
    stopSoundEffect();

    // Make an API request to fetch weather data
    fetchWeather(cityName);
    animateImage();
  });

  function fetchWeather(city) {
    var apiKey = 'e9e64a76e3af4133a76115906230606'; // Replace with your own API key
    var apiUrl = 'https://api.weatherapi.com/v1/forecast.json?key=' + apiKey + '&q=' + city + '&days=3';

    fetch(apiUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        if (data.error) {
          displayError(data.error.message);
          stopSoundEffect(); // Stop the sound effect on error
        } else {
          displayWeather(data);
          playSoundEffect(data.current.condition.code); // Play sound effect based on weather condition code
        }
      })
      .catch(function(error) {
        console.log(error);
        stopSoundEffect(); // Stop the sound effect on error
      });
  }

  function displayWeather(data) {
    var currentWeather = data.current;
    var forecastWeather = data.forecast.forecastday;
  
    var locationName = data.location.name;
    var locationCountry = data.location.country;
  
    var currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  
    var currentTime = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  
    var currentCondition = currentWeather.condition.text;
  
    var html = '<h2>' + locationName + ', ' + locationCountry + '</h2>';
    html += '<p>Date: ' + currentDate + '</p>';
    html += '<p>Time: ' + currentTime + '</p>';
    html += '<p>Current Weather:</p>';
    html += '<p>Condition: ' + currentCondition + '</p>';
    html += '<p>Temperature: ' + currentWeather.temp_c + '°C</p>';
    html += '<p>Feels Like: ' + currentWeather.feelslike_c + '°C</p>';
    html += '<p>Humidity: ' + currentWeather.humidity + '%</p>';
    html += '<p>Wind Speed: ' + currentWeather.wind_kph + ' km/h</p>';
    html += '<p>Pressure: ' + currentWeather.pressure_mb + ' mb</p>';
  
    html += '<p>Upcoming Weather:</p>';
    for (var i = 1; i < forecastWeather.length; i++) {
      var date = forecastWeather[i].date;
      var forecast = forecastWeather[i].day;
      html += '<p>' + date + ': ' + forecast.condition.text + '</p>';
    }
  
    weatherInfo.innerHTML = html;
  
    var imageSrc = getWeatherImageSrc(currentWeather.condition.code);
    weatherImage.src = imageSrc;
  }
  

  function displayError(message) {
    weatherInfo.innerHTML = '<p>Error: ' + message + '</p>';
  }

  function animateImage() {
    weatherImage.style.animation = 'moveImage 20s linear infinite';
  }

  function getWeatherImageSrc(conditionCode) {
    if (conditionCode === 1000) {
      return 'sunnyg.gif';
    } else if (conditionCode >= 1003 && conditionCode <= 1030) {
      return 'cloudg.gif';
    } else if (conditionCode >= 1063 && conditionCode <= 1249 || conditionCode >= 1273) {
      return 'grainny.gif';
    } else {
      return 'default.png';
    }
  }

  function playSoundEffect(conditionCode) {
    if (conditionCode === 1000) {
      audio.src = 'sunnysnd.mp3'; // Path to the sunny weather sound effect
    } else if (conditionCode >= 1003 && conditionCode <= 1030) {
      audio.src = 'heaven.mp3'; // Path to the cloudy weather sound effect
    } else if (conditionCode >= 1063 && conditionCode <= 1249 || conditionCode >= 1273) {
      audio.src = 'rainnsnd.mp3'; // Path to the rainy weather sound effect
    } else {
      audio.src = ''; // No sound effect for other conditions
    }

    if (audio.src !== '') {
      audio.loop = true; // Enable looping
      audio.play(); // Play the sound effect
      currentAudioSource = audio.src; // Update the current audio source
    }
  }

  function stopSoundEffect() {
    audio.pause(); // Pause the audio playback
    audio.currentTime = 0; // Reset the audio playback position
    audio.loop = false; // Disable looping
    currentAudioSource = ''; // Reset the current audio source
  }
});
