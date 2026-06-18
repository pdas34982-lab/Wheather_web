const API_KEY = "YOUR_API_KEY_HERE";

async function getWeather() {

    const city =
    document.getElementById("cityInput").value.trim();

    if(!city){
        alert("Please enter a city name");
        return;
    }

    fetchWeather(city);
}

async function fetchWeather(location){

    const loader =
    document.getElementById("loader");

    loader.style.display = "block";

    try{

        const url =
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=7&aqi=yes`;

        const response =
        await fetch(url);

        const data =
        await response.json();

        if(data.error){
            alert(data.error.message);
            loader.style.display="none";
            return;
        }

        displayWeather(data);
        displayForecast(data);

    }
    catch(error){

        console.error(error);

        alert("Failed to fetch weather.");

    }

    loader.style.display = "none";
}

function displayWeather(data){

    document.getElementById("city").textContent =
    `${data.location.name}, ${data.location.country}`;

    document.getElementById("temp").textContent =
    `🌡 Temperature: ${data.current.temp_c}°C`;

    document.getElementById("feelsLike").textContent =
    `🥵 Feels Like: ${data.current.feelslike_c}°C`;

    document.getElementById("condition").textContent =
    `☁ Condition: ${data.current.condition.text}`;

    document.getElementById("humidity").textContent =
    `💧 Humidity: ${data.current.humidity}%`;

    document.getElementById("wind").textContent =
    `🌬 Wind: ${data.current.wind_kph} km/h`;

    document.getElementById("aqi").textContent =
    `🏭 AQI: ${data.current.air_quality["us-epa-index"]}`;

    document.getElementById("sunrise").textContent =
    `🌅 Sunrise: ${data.forecast.forecastday[0].astro.sunrise}`;

    document.getElementById("sunset").textContent =
    `🌇 Sunset: ${data.forecast.forecastday[0].astro.sunset}`;

    document.getElementById("weatherIcon").src =
    "https:" + data.current.condition.icon;

    document.getElementById("weatherCard").style.display =
    "block";

    changeBackground(
        data.current.condition.text
    );
}

function displayForecast(data){

    const forecastDiv =
    document.getElementById("forecast");

    forecastDiv.innerHTML = "";

    data.forecast.forecastday.forEach(day => {

        forecastDiv.innerHTML += `

        <div class="forecast-day">

            <h4>${day.date}</h4>

            <img
            src="https:${day.day.condition.icon}"
            >

            <p>${day.day.avgtemp_c}°C</p>

            <p>${day.day.condition.text}</p>

        </div>

        `;
    });
}

function changeBackground(condition){

    condition =
    condition.toLowerCase();

    document.body.classList.remove(
        "sunny",
        "cloudy",
        "rainy",
        "snowy"
    );

    if(condition.includes("sun")){

        document.body.classList.add("sunny");

    }
    else if(condition.includes("cloud")){

        document.body.classList.add("cloudy");

    }
    else if(
        condition.includes("rain") ||
        condition.includes("storm") ||
        condition.includes("drizzle")
    ){

        document.body.classList.add("rainy");

    }
    else if(
        condition.includes("snow")
    ){

        document.body.classList.add("snowy");

    }
}

function getCurrentLocationWeather(){

    if(!navigator.geolocation){

        alert(
        "Geolocation not supported"
        );

        return;
    }

    navigator.geolocation.getCurrentPosition(

        async(position)=>{

            const lat =
            position.coords.latitude;

            const lon =
            position.coords.longitude;

            fetchWeather(`${lat},${lon}`);
        },

        ()=>{

            alert(
            "Unable to get location"
            );
        }
    );
}

document
.getElementById("cityInput")
.addEventListener("keypress",

function(e){

    if(e.key === "Enter"){

        getWeather();
    }
});