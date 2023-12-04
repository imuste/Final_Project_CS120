var usa = "https://www.themealdb.com/api/json/v1/1/filter.php?a=American"; //temperature < 40
var france = "https://www.themealdb.com/api/json/v1/1/filter.php?a=French"; // 40 <= temperature < 50
var china = "https://www.themealdb.com/api/json/v1/1/filter.php?a=Chinese"; // 50 <= temperature < 60
var india = "https://www.themealdb.com/api/json/v1/1/filter.php?a=Indian"; // 60 <= temperature < 70
var mexico = "https://www.themealdb.com/api/json/v1/1/filter.php?a=Mexican"; // 70 <= temperature < 80
var tunisia = "https://www.themealdb.com/api/json/v1/1/filter.php?a=Tunisian"; // temperature >= 80

var FINALCOUNTRY_URL = "";

var weather_api = "https://api.openweathermap.org/data/2.5/weather?q=";
var weather_api_key = "&appid=94d6a2d3f3e438aebb7261a027b92d1d&units=imperial";

//return from API variables
var city_name = "";
var city_temperature = "";
var humidity = "";
var pressure = "";
var wind_speed = "";
var weather_description = "";

var user_firstname = "";
var user_lastname = "";
var user_email = "";


//we could possible change the background color of the page based on the weather returned from the api
function changeWeatherAnimation(weather) {

    const animationDiv = document.getElementById('animation');

    if (weather.includes('rain')) {
        animationDiv.style.background = "url('image/rain2.gif') no-repeat top center";
        animationDiv.style.backgroundSize = "cover";
        animationDiv.style.animation = "rainFall 3s linear forwards";
    }else if(weather.includes('cloud')){
        animationDiv.style.background = "url('image/cloud.gif') no-repeat top center";
        animationDiv.style.backgroundSize = "cover";
        animationDiv.style.animation = "cloud 3s linear forwards";
    }else if(weather.includes('snow')){
        animationDiv.style.background = "url('image/snow.gif') no-repeat top center";
        animationDiv.style.backgroundSize = "cover";
        animationDiv.style.animation = "Snow 3s linear forwards";
    }else if(weather.includes('clear sky')){
        animationDiv.style.background = "url('image/clear_sky.gif') no-repeat top center";
        animationDiv.style.backgroundSize = "cover";
        animationDiv.style.animation = "clear_sky 3s linear forwards";
    }else if(weather.includes('haze')){
        animationDiv.style.background = "url('image/cloud.gif') no-repeat top center";
        animationDiv.style.backgroundSize = "cover";
        animationDiv.style.animation = "cloud 3s linear forwards";
    }
}

function changeWeatherIcon(weather) {

    const IconDiv = document.getElementById('display_icon');

    const img = document.createElement('img');

    if (weather.includes('rain')) {
        img.src = 'image/rain.svg';
    }else if(weather.includes('cloud')){
        img.src = 'image/cloud.svg';
    }else if(weather.includes('snow')){
        img.src = 'image/snow.svg';
    }else if(weather.includes('clear sky')){
        img.src = 'image/sun.svg';
    }else if(weather.includes('haze')){
        img.src = 'image/cloud.svg';
    }

    IconDiv.appendChild(img);
}

//get the entered location and store it in the location_entry variable
document.getElementById("location_entry").addEventListener("change", function() {
    var location_entry = document.getElementById("location_entry").value;
    api_entry = location_entry;
    use_weather_api(api_entry);
});


//get the user information entered in the form 
document.getElementById('information_form').addEventListener('submit', function(preventing) {
    preventing.preventDefault();

    user_firstname = document.getElementById('fname').value;
    user_lastname = document.getElementById('lname').value;
    user_email = document.getElementById('emailaddress').value;

    save_user_data_to_session(); 
    save_userinfo_to_db();
    //redirect(FINALCOUNTRY_URL)
    // redirect to next page: recipe.html
});


//query the weather based on entered location
function use_weather_api(location) {
    var api_query = weather_api + location + weather_api_key;

    fetch(api_query)
        .then(response => response.json())
        .then(data => {
            process_data(data);
            use_data();
        })
        .catch(error => {
            alert("please enter a valid city name");
            console.log(error);
        });
}


//process the data and update the global weather variables with the retrieved data
function process_data(the_data) {
    city_name = the_data.name;
    city_temperature = the_data.main.temp;
    humidity = the_data.main.humidity;
    pressure = the_data.main.pressure;
    wind_speed = the_data.wind.speed;
    weather_description = the_data.weather[0].description;

    save_weather_data_to_session();
    find_country_for_query();
}

//populate the FINALCOUNTRY_URL variable with the proper MealDB query string based
// on temperature from the location entered
function find_country_for_query() {
    if (parseInt(city_temperature) < 40) {
        FINALCOUNTRY_URL = usa;
    }
    
    else if (parseInt(city_temperature) < 50) {
        FINALCOUNTRY_URL = france;
    }

    else if (parseInt(city_temperature) < 60) {
        FINALCOUNTRY_URL = china;
    }

    else if (parseInt(city_temperature) < 70) {
        FINALCOUNTRY_URL = india;
    }

    else if (parseInt(city_temperature) < 80) {
        FINALCOUNTRY_URL = mexico;
    }

    else {
        FINALCOUNTRY_URL = tunisia;
    }
}



// function to change the page display so the weather data can be showed to the 
// user
function use_data() {
    var change_page_display = document.querySelector('.query_field');
    change_page_display.style.display = 'none';

    var change_page_display = document.querySelector('.weather_display');
    change_page_display.style.display = 'flex';

    weather_variables_string = 
    "Temperature: " + city_temperature + " fahrenheit <br>" +
    "Humidity: " + humidity + "% <br>" +
    "Wind Speed: " + wind_speed + " mph <br>" +
    "Other: " + weather_description + " <br>";


    document.getElementById('display_weather_header').innerHTML = "The Weather In " + city_name;
    document.getElementById('weather_variables').innerHTML = weather_variables_string;
}



//function to possibly save the weather data to the session if necessary
function save_weather_data_to_session() {
    localStorage.setItem('city_name', JSON.stringify(city_name));
    localStorage.setItem('temperature', JSON.stringify(city_temperature));
    localStorage.setItem('humidity', JSON.stringify(humidity));
    localStorage.setItem('pressure', JSON.stringify(pressure));
    localStorage.setItem('wind_speed', JSON.stringify(wind_speed));
    localStorage.setItem('description', JSON.stringify(weather_description));
}


//function to possibly save the user information to the session if necessary
function save_user_data_to_session() {
    localStorage.setItem('user_firstname', JSON.stringify(user_firstname));
    localStorage.setItem('user_lastname', JSON.stringify(user_lastname));
    localStorage.setItem('user_email', JSON.stringify(user_email));
}


//function to get the weather data from the session
function get_data_from_session() {
    city_name = localStorage.getItem('city_name');
    city_temperature = localStorage.getItem('temperature');
    humidity = localStorage.getItem('humidity');
    pressure = localStorage.getItem('pressure');
    wind_speed = localStorage.getItem('wind_speed');
    weather_description = localStorage.getItem('description');
}
//variable to check if a person has any attempts left
//If not, is set to zero in save_userinfo_to_db()
var attempts;

//saving the user information to the database
function save_userinfo_to_db() {
    $.ajax({
        type: "POST",
        url: "database_conn.php",
        data: {
            firstname: user_firstname,
            lastname: user_lastname,
            email: user_email
        },
        success: function(response) {
            localStorage.setItem("user_id", response);
            console.log(response);
            attempts = parseInt(response);
            redirect(FINALCOUNTRY_URL)
            // Redirect only after the AJAX request is successful
        },
        error: function(error) {
            // Handle errors here
            console.log("Error:", error);
        }
    });
}

// redirect to recipe page of app that will display the recipes, along with buttons to take the user to 
// the different youtube videos of each recipe
function redirect(url) {
    if (attempts == 0) {
        alert("Usage limit exceeded. Please pay for more usages.");
        throw "Usage limit exceeded. Please pay for more usages.";
    } else {
        localStorage.setItem("country_url", FINALCOUNTRY_URL);
        window.location.href = "recipe.html";
        
    }
}
