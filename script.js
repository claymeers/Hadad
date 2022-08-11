// Get all necessary elements from DOM
const app = document.querySelector('.wrapper')
const temp = document.querySelector('.temp')
const dateOutput = document.querySelector('.date')
const timeOutput = document.querySelector('.time')
const conditionOutput = document.querySelector('.condition')
const nameOutput = document.querySelector('.name')
const icon = document.querySelector('.icon')
const cloudOutput = document.querySelector('.cloud')
const humidityOutput = document.querySelector('.humidity')
const windOutput = document.querySelector('.wind')
const form = document.getElementById('locationInput')
const search = document.querySelector('.search')
const btn = document.querySelector('.submit')
const cities = document.querySelectorAll('.city')

// Default city when the page load
let cityInput = 'Paris'

// Add click event to each city in the panel
cities.forEach((city) => {
    city.addEventListener('click', (e) => {
        // Change from default city to the clicked one
        cityInput = e.target.innerHTML;
        /*Funtion that fetches and displays all the data 
        for the Weather API */
        fetchWeatherData()
        // Fade out the app (simple animation)
        app.style.opacity = '0'
    })
})

// Add submit event to the form
form.addEventListener('submit', (e) => {
    // If the input field (search bar is empty) throw an alert
    if(search.value.length == 0) {
        alert('Please type in a city name')
    } else {
        /*Change from default city to the one 
        written in the input field*/
        cityInput = search.value
        /*Funtion that fetches and displays all the data 
        for the Weather API */
        fetchWeatherData()
        // Remove all text from the input field
        search.value = ""
        // Fade out the app (simple animation)
        app.style.opacity = '0'
    }

    // Prevents the default behavior of the form
    e.preventDefault();
})

/*Funtion that returns a day of the week 
(Monday, Tuesday, Friday...) from a date (12 03 2022) */
function dayOfTheWeek(day, month, year) {
    const weekDay = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ]
    return weekDay[new Date (`${day}/${month}/${year}`).getDay()]
}

/*Funtion that fetches and displays all the data 
    for the Weather API */
function fetchWeatherData() {
    // Fetch the data and dynamically add the city name
    const url = `http://api.weatherapi.com/v1/current.json?key=c1cff108b8734dfabdc130339221108&q=${cityInput}`
    fetch(url)
        .then(response => response.json()) // Convert data from JSON format to a regular JS object
        .then(data => {
            // console.log(data)
            // get the temperature and the weather
            temp.innerHTML = data.current.temp_c + '&#176;'
            conditionOutput.innerHTML = data.current.condition.text
            // Date and time
            const date = data.location.localtime;
            const y = parseInt(date.substr(0, 4))
            const m = parseInt(date.substr(5, 2))
            const d = parseInt(date.substr(8, 2))
            const time = date.substr(11)
            // reformat datte into sth more appealing and show it
            // Original format: 2021-10-09 17:53
            // New format: 17:53 - Friday 9, 10, 2021
            dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m} ${y}`
            timeOutput.innerHTML = time
            // Add the name of the city
            nameOutput.innerHTML = data.location.name
            // Get the corresponding icon url
            const iconId = data.current.condition.icon.substr(
                '//cdn.weatherapi.com/weather/64x64'.length)
            // reformat the icon url to the local folder path
            icon.src = './Img/Icons' + iconId
            // add weather details
            cloudOutput.innerHTML = data.current.cloud + '%'
            humidityOutput.innerHTML = data.current.humidity + '%'
            windOutput.innerHTML = data.current.wind_kph + 'km/h'
            // Set default time of day
            let timeOfDay = 'day'
            // get unique id for each weather condition
            const code = data.current.condition.code
            // Change to night if it is the night time in the city
            if(!data.current.is_day) {
                timeOfDay = 'night'
            }
            if (code == 1000) {
                // set the background img to clear if the weather is clear
                app.style.backgroundImage = `url(./Img/Pictures/${timeOfDay}/clear.jpg)`
                // change the button bg color depending on if its day or night
                btn.style.background = '#e5ba92'
                if (timeOfDay == 'night') {
                    btn.style.background = '#181e27'
                }
            } 
            // same thing for cloudy weather
            else if (
                code == 1003 ||
                code == 1006 ||
                code == 1009 ||
                code == 1030 ||
                code == 1069 ||
                code == 1087 ||
                code == 1135 ||
                code == 1273 ||
                code == 1276 ||
                code == 1279 ||
                code == 1282
            ) {
                app.style.backgroundImage = `url(./Img/Pictures/${timeOfDay}/cloudy.jpg)`
                btn.style.background = '#fa6d1b'
                if (timeOfDay == 'night') {
                    btn.style.background = '#181e27'
                }
            }
            // and rain
            else if (
                code == 1063 ||
                code == 1069 ||
                code == 1072 ||
                code == 1150 ||
                code == 1153 ||
                code == 1180 ||
                code == 1183 ||
                code == 1186 ||
                code == 1189 ||
                code == 1192 ||
                code == 1195 ||
                code == 1204 ||
                code == 1207 ||
                code == 1240 ||
                code == 1243 ||
                code == 1246 ||
                code == 1249 ||
                code == 1252
            ) {
                app.style.backgroundImage = `url(./Img/Pictures/${timeOfDay}/rainy.jpg)`
                btn.style.background = '#647d75'
                if (timeOfDay == 'night') {
                    btn.style.background = '#325c80'
                }
            }
            // and finally snow
            else {
                app.style.backgroundImage = `url(./Img/Pictures/${timeOfDay}/snowy.jpg)`
                btn.style.background = '#4d72aa'
                if (timeOfDay == 'night') {
                    btn.style.background = '#1b1b1b'
                }
            }
            // Fade in the page once all is done
            app.style.opacity = '1'
        }) 
        // If user type a city that doesn't exist, throw an alert
        .catch(() => {
            alert('City not found, please try again')
            app.style.opacity = '1'
        })
}

// Call the function on the page load
fetchWeatherData()

// Fade in the page
app.style.opacity = '1'