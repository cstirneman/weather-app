//api endpoint
const apiKey = "2d20371615438566af971f5fc52a8ac0";

//DOM elements
const weatherInfoDiv = document.getElementById("weather-info-div");
const searchInput = document.getElementById("city-search-bar");
const searchBtn = document.getElementById("search-btn");
const resultsDiv = document.getElementById("search-results-div");
const cityNameElement = document.getElementById("city-name");
const tempElement = document.getElementById("temperature");
const weatherConditionElement = document.getElementById("weather-condition");
const windElement = document.getElementById("wind");
const feelLikeTempElement = document.getElementById("feel-like-temp");
const weatherIconElement = document.getElementById("weather-icon");
const humidityElement = document.getElementById("humidity");
const fiveDayForecastDiv = document.getElementById("five-day-div");


searchBtn.addEventListener("click", () => {
    weatherInfoDiv.setAttribute("style", "display: none;");
    resultsDiv.removeAttribute("style");
    let cityName = searchInput.value;
    fetchCityNames(cityName, apiKey);
});

//other
let currentCities = [];



async function fetchCityNames(cityName, apiKey) {
    const apiURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apiKey}`;

    try {
        const response = await fetch(apiURL);
        const results = await response.json();
        console.log(results);
        displayResults(results);
      
    } catch (error) {
        console.error("Error fetching data:", error); 
    }
}

async function fetchCityWeather(lat, lon, apiKey) {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    try {
        const response = await fetch(apiURL);
        const results = await response.json();
        console.log(results);
        displayWeather(results);
      
    } catch (error) {
        console.error("Error fetching data:", error); 
    }
}

async function fetch5DayWeather(lat, lon, apiKey) {
    const apiURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    try {
        const response = await fetch(apiURL);
        const results = await response.json();
        console.log(results);
        display5Day(results);
      
    } catch (error) {
        console.error("Error fetching data:", error); 
    }
}


function displayResults(results){
    resultsDiv.innerHTML = "";
    
    results.forEach(element => {
        let city = element.name;
        let state = element.state;
        let latitude = element.lat;
        let longitude = element.lon;
        let cityButton = document.createElement("button");

        cityButton.innerHTML = `${city}, ${state}`;
        cityButton.classList.add("city-btn");
        cityButton.addEventListener("click", () =>{
            weatherInfoDiv.removeAttribute("style");
            resultsDiv.setAttribute("style", "display: none;");
            fetchCityWeather(latitude, longitude, apiKey);
            fetch5DayWeather(latitude, longitude, apiKey)
        })

        resultsDiv.appendChild(cityButton);
    });
}

function displayWeather(cityData){
    let tempRounded = Math.floor(cityData.main.temp);
    let feelLikeTempRounded = Math.floor(cityData.main.feels_like);
    let windSpeedRounded = Math.floor(cityData.wind.speed);
    let weatherCondition = cityData.weather[0].description;
    
    cityNameElement.innerHTML = cityData.name;

    const iconCode = cityData.weather[0].icon;
    const iconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIconElement.src = iconURL;
    weatherConditionElement.innerHTML = cityData.weather[0].description;

    tempElement.innerHTML = `Temperature<br>${tempRounded}°F`;
    feelLikeTempElement.innerHTML = `Feels Like<br>${feelLikeTempRounded}°F`;
    humidityElement.innerHTML = `Humidity<br>${cityData.main.humidity} %`
    windElement.innerHTML = `Wind Speed<br>${windSpeedRounded} mph`;
}

function display5Day(cityData) {
    fiveDayForecastDiv.innerHTML = '';
    const forecastList = cityData.list;

    let daysDisplayed = [];

    for (let i = 0; i < forecastList.length; i++) {
        // Extract the date from the forecast item
        let forecastDate = new Date(forecastList[i].dt_txt).getDate();

        // If this date is not already displayed, then display it
        if (!daysDisplayed.includes(forecastDate)) {
            daysDisplayed.push(forecastDate);

            // elements for forecast data
            let forecastDiv = document.createElement("div");
            forecastDiv.classList.add("five-day");
            forecastDiv.setAttribute("id", `day-${daysDisplayed.length}`);  // Assign a unique ID like "day-1"

            let dayName = new Date(forecastList[i].dt_txt).toLocaleDateString('en-US', { weekday: 'long' });
            let dayElement = document.createElement("h4");
            dayElement.setAttribute("id", `day-name-${daysDisplayed.length}`);  // Assign a unique ID for day name
            dayElement.innerHTML = dayName;

            // High/Low temperature
            let tempHighLow = document.createElement("h5");
            tempHighLow.setAttribute("id", `high-low-temps-${daysDisplayed.length}`);  // Assign a unique ID for temps
            tempHighLow.innerHTML = `${Math.round(forecastList[i].main.temp_max)}°F / ${Math.round(forecastList[i].main.temp_min)}°F`;

            // Weather Icon
            const iconCode = forecastList[i].weather[0].icon;
            const iconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            let image = document.createElement("img");
            image.setAttribute("id", `weather-icon-${daysDisplayed.length}`);  // Assign a unique ID for the icon
            image.src = iconURL;

            // Append the created elements to the forecast div
            forecastDiv.appendChild(dayElement);
            forecastDiv.appendChild(tempHighLow);
            forecastDiv.appendChild(image);

            // Append the forecast div to the main 5-day forecast container
            fiveDayForecastDiv.appendChild(forecastDiv);

            if (daysDisplayed.length === 5) break;
        }
    }
}
