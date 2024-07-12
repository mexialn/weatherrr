document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "VfnHdLDcWwV6SUiWulg8sdT1M9caJZKf"; // Replace with your actual API key
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");
    const hourlyForecastDiv = document.getElementById("hourly-forecast");
    const dailyForecastDiv = document.getElementById("daily-forecast");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const locationUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(locationUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                    fetchHourlyForecast(locationKey);
                    fetchFiveDayForecast(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    function fetchWeatherData(locationKey) {
        const weatherUrl = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(weatherUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching weather data.</p>`;
            });
    }

    function fetchHourlyForecast(locationKey) {
        const hourlyUrl = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}`;

        fetch(hourlyUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayHourlyForecast(data);
                } else {
                    hourlyForecastDiv.innerHTML = `<p>No hourly forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching hourly forecast data:", error);
                hourlyForecastDiv.innerHTML = `<p>Error fetching hourly forecast data.</p>`;
            });
    }

    function fetchFiveDayForecast(locationKey) {
        const dailyUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}`;

        fetch(dailyUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts && data.DailyForecasts.length > 0) {
                    displayFiveDayForecast(data.DailyForecasts);
                } else {
                    dailyForecastDiv.innerHTML = `<p>No 5-day forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching 5-day forecast data:", error);
                dailyForecastDiv.innerHTML = `<p>Error fetching 5-day forecast data.</p>`;
            });
    }

    function displayWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const iconNumber = data.WeatherIcon;
        const iconUrl = `https://developer.accuweather.com/sites/default/files/${iconNumber < 10 ? '0' : ''}${iconNumber}-s.png`;

        const weatherContent = `
            <h2>Weather</h2>
            <p><img src="${iconUrl}" alt="Weather Icon"></p>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
        `;
        weatherDiv.innerHTML = weatherContent;
    }

    function displayHourlyForecast(data) {
        let forecastContent = '';
        data.forEach(hour => {
            const time = new Date(hour.DateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            const temperature = hour.Temperature.Value;
            const iconNumber = hour.WeatherIcon;
            const iconUrl = `https://developer.accuweather.com/sites/default/files/${iconNumber < 10 ? '0' : ''}${iconNumber}-s.png`;
            const weather = hour.IconPhrase;

            forecastContent += `
                <div class="hourly-forecast">
                    <p><img src="${iconUrl}" alt="Weather Icon"></p>
                    <p>${time}</p>
                    <p>Temperature: ${temperature}°C</p>
                    <p>${weather}</p>
                </div>
            `;
        });
        hourlyForecastDiv.innerHTML = forecastContent;
    }

    function displayFiveDayForecast(data) {
        let forecastContent = '';
        data.forEach(day => {
            const date = new Date(day.Date).toLocaleDateString();
            const temperatureMin = day.Temperature.Minimum.Value;
            const temperatureMax = day.Temperature.Maximum.Value;
            const iconNumber = day.Day.Icon;
            const iconUrl = `https://developer.accuweather.com/sites/default/files/${iconNumber < 10 ? '0' : ''}${iconNumber}-s.png`;
            const weather = day.Day.IconPhrase;

            forecastContent += `
                <div class="daily-forecast">
                    <p><img src="${iconUrl}" alt="Weather Icon"></p>
                    <p>${date}</p>
                    <p>Min: ${temperatureMin}°C</p>
                    <p>Max: ${temperatureMax}°C</p>
                    <p>${weather}</p>
                </div>
            `;
        });
        dailyForecastDiv.innerHTML = forecastContent;
    }
});
