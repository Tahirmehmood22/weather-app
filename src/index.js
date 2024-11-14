import './styles.css';
import './fields-style.css';
import './loading-spinner.css';
import './images/partly-cloudy-day.png';
import './images/overcast.png';
import './images/clear-sky-night.png';
import './images/cloudy-windy.png';
import './images/cloudy.png';
import './images/rainy.png';
import './images/snowy.png';
import './images/stormy.png';
import './images/sunny.png';
import './images/tornado.png';
import './images/windy.png';
import './images/partly-cloudy-night.png';
import './images/foggy.png';
import './images/thunder.png';
import './images/target.png';
import './videos/rain.mp4';
import './videos/sunny.mp4';
import './videos/cloudy.mp4';
import './videos/partly-cloudy.mp4';
import './videos/snowy.mp4';
import './images/logo.png';
import './images/logo2.png';
import './images/logo3.png';

const weatherController = (() => {
	const key = '130f84548bca4dfd984102921241702';

	let weatherData;
	let locationOption;
	let chosenLocation;
	let ipData;

	const locationsList = document.querySelector('.location-options');
	const searchInput = document.querySelector('#search-bar');
	const geoBtn = document.querySelector('#geolocation-button');

	searchInput.addEventListener('keyup', async () => {
		if (searchInput.value !== '') {
			await searchForInput(searchInput.value);
			locationsList.classList.add('visible');
		} else {
			locationsList.classList.remove('visible');
		}
	});
	geoBtn.addEventListener('click', async () => {
		await getIp();
		await fetchCurrentWeatherData(ipData.ip);
	});

	async function getIp() {
		try {
			const response = await fetch(
				`https://api.weatherapi.com/v1/ip.json?key=${key}&q=auto:ip`
			);

			if (!response.ok) {
				throw new Error('Failed to fetch IP data');
			}
			ipData = await response.json();
		} catch (err) {
			console.log(err);
		}
	}
	async function searchForInput(location) {
		try {
			const resolve = await fetch(
				`https://api.weatherapi.com/v1/search.json?key=${key}&q=${location}`
			);
			locationOption = await resolve.json();
			locationsList.innerHTML = '';
			renderLocations();
		} catch (err) {
			console.log(err);
		}
	}

	const loadingSpinner = document.querySelector('.lds-roller');

	async function fetchCurrentWeatherData(parameter) {
		const fieldsContainer = document.querySelector('.fields-container');
		try {
			loadingSpinner.style.display = 'block';
			fieldsContainer.style.display = 'none';
			const startTime = Date.now();
			const resolve = await fetch(
				`https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${parameter}&days=3&aqi=yes`
			);
			weatherData = await resolve.json();
			renderWeather(weatherData);
			renderForecast(weatherData);
			const elapsedTime = Date.now() - startTime;
			const minDisplayTime = 1000;
			const remainingTime = minDisplayTime - elapsedTime;

			if (remainingTime > 0) {
				await new Promise((resolve) =>
					setTimeout(resolve, remainingTime)
				);
			}
		} catch (err) {
			console.log(err);
		} finally {
			loadingSpinner.style.display = 'none';
			fieldsContainer.style.display = 'grid';
		}
	}

	function renderLocations() {
		if (locationOption.length === 0) {
			const newLocation = document.createElement('button');
			newLocation.textContent = 'No location has been found';
			locationsList.appendChild(newLocation);
		} else {
			locationOption.forEach((option) => {
				const newLocation = document.createElement('button');
				newLocation.setAttribute('id', option.id);
				newLocation.textContent = option.name + ', ' + option.country;
				newLocation.addEventListener('click', (e) => {
					chosenLocation = 'id:' + e.target.id;
					fetchCurrentWeatherData(chosenLocation);
					searchInput.value = '';
					locationsList.classList.remove('visible');
				});
				locationsList.appendChild(newLocation);
			});
		}
	}

	function renderWeather(data) {
		const name = document.querySelector('#current-field-name');
		const country = document.querySelector('#current-field-country');
		const temp = document.querySelector('#current-field-temp');
		const text = document.querySelector('#current-field-text');
		const feelsLike = document.querySelector('#feels-like');
		const uv = document.querySelector('#uv');
		const humidity = document.querySelector('#humidity');
		const wind = document.querySelector('#wind');
		const rain = document.querySelector('#rain');
		const pressure = document.querySelector('#pressure');
		const visibility = document.querySelector('#visibility');
		const sunrise = document.querySelector('#sunrise');
		const sunset = document.querySelector('#sunset');
		const video = document.querySelector('#video');

		name.textContent = data.location.name;
		country.textContent = data.location.country;
		temp.textContent = `${Math.round(data.current.temp_c)}°C`;
		text.textContent = data.current.condition.text;
		video.src = setVideo(data.current.condition.text);
		feelsLike.textContent = `${Math.round(data.current.feelslike_c)}°C`;
		uv.textContent = Math.round(data.current.uv);
		humidity.textContent = `${Math.round(data.current.humidity)}%`;
		wind.textContent = `${Math.round(data.current.wind_kph)} km/h`;
		rain.textContent = `${Math.round(
			data.forecast.forecastday[0].day.daily_chance_of_rain
		)}%`;
		pressure.textContent = `${Math.round(data.current.pressure_mb)} hPa`;
		visibility.textContent = `${Math.round(
			data.forecast.forecastday[0].day.avgvis_km
		)} km`;
		sunrise.textContent = data.forecast.forecastday[0].astro.sunrise;
		sunset.textContent = data.forecast.forecastday[0].astro.sunset;
		video.addEventListener('canplay', () => {
			video.playbackRate = 0.6;
		});
	}
	function renderForecast(data) {
		const day1Temp = document.querySelector('#day1-temp');
		const day2Temp = document.querySelector('#day2-temp');
		const day3Temp = document.querySelector('#day3-temp');

		const day1Img = document.querySelector('#day1-img');
		const day2Img = document.querySelector('#day2-img');
		const day3Img = document.querySelector('#day3-img');

		const day1text = document.querySelector('#day1-text');
		const day2text = document.querySelector('#day2-text');
		const day3text = document.querySelector('#day3-text');

		if (data.forecast && data.forecast.forecastday) {
			day1Temp.innerHTML = `<span id='lowest'>${Math.round(
				data.forecast.forecastday[0].day.mintemp_c
			)}°C</span>   
			<span id='average'>${Math.round(
				data.forecast.forecastday[0].day.avgtemp_c
			)}°C</span>   
			<span id='highest'>${Math.round(
				data.forecast.forecastday[0].day.maxtemp_c
			)}°C</span> `;
			day2Temp.innerHTML = `<span id='lowest'>${Math.round(
				data.forecast.forecastday[1].day.mintemp_c
			)}°C</span>   
			<span id='average'>${Math.round(
				data.forecast.forecastday[1].day.avgtemp_c
			)}°C</span>   
			<span id='highest'>${Math.round(
				data.forecast.forecastday[1].day.maxtemp_c
			)}°C</span> `;
			day3Temp.innerHTML = `<span id='lowest'>${Math.round(
				data.forecast.forecastday[2].day.mintemp_c
			)}°C</span>   
			<span id='average'>${Math.round(
				data.forecast.forecastday[2].day.avgtemp_c
			)}°C</span>   
			<span id='highest'>${Math.round(
				data.forecast.forecastday[2].day.maxtemp_c
			)}°C</span> `;

			day1text.textContent =
				data.forecast.forecastday[0].day.condition.text;
			day2text.textContent =
				data.forecast.forecastday[1].day.condition.text;
			day3text.textContent =
				data.forecast.forecastday[2].day.condition.text;

			day1Img.src = setIcon(
				data.forecast.forecastday[0].day.condition.text
			);
			day2Img.src = setIcon(
				data.forecast.forecastday[1].day.condition.text
			);
			day3Img.src = setIcon(
				data.forecast.forecastday[2].day.condition.text
			);
		} else {
			console.log('Forecast data not available');
		}
	}

	function setIcon(condition) {
		let iconSrc;

		switch (condition.trim()) {
			case 'Sunny':
			case 'Clear':
				iconSrc = './images/sunny.png';
				break;
			case 'Partly Cloudy':
			case 'Partly cloudy':
				iconSrc = './images/partly-cloudy-day.png';
				break;
			case 'Cloudy':
				iconSrc = './images/cloudy.png';
				break;
			case 'Overcast':
				iconSrc = './images/overcast.png';
				break;
			case 'Mist':
			case 'Fog':
			case 'Smoke':
			case 'Freezing fog':
				iconSrc = './images/foggy.png';
				break;
			case 'Patchy rain possible':
			case 'Light rain':
			case 'Moderate rain':
			case 'Heavy rain':
			case 'Thundery outbreaks possible':
			case 'Patchy light drizzle':
			case 'Light drizzle':
			case 'Freezing drizzle':
			case 'Heavy freezing drizzle':
			case 'Patchy light rain':
			case 'Light rain shower':
			case 'Moderate or heavy rain shower':
			case 'Moderate or heavy sleet showers':
			case 'Light sleet showers':
			case 'Patchy light nearby':
			case 'Patchy rain nearby':
			case 'Light freezing rain':
				iconSrc = './images/rainy.png';
				break;
			case 'Ice pellets':
			case 'Patchy snow possible':
			case 'Light snow':
			case 'Moderate snow':
			case 'Heavy snow':
			case 'Blowing snow':
			case 'Blizzard':
			case 'Patchy light snow':
			case 'Patchy moderate snow':
			case 'Light snow showers':
			case 'Moderate or heavy snow showers':
			case 'Patchy light snow with thunder':
			case 'Moderate or heavy snow with thunder':
				iconSrc = './images/snowy.png';
				break;
			case 'Patchy light rain with thunder':
			case 'Moderate or heavy rain with thunder':
				iconSrc = './images/stormy.png';
				break;
			default:
				iconSrc = './images/wi-na.svg';
				break;
		}

		return iconSrc;
	}

	function setVideo(condition) {
		let videoSrc;

		switch (condition.trim()) {
			case 'Sunny':
			case 'Clear':
				videoSrc = './videos/sunny.mp4';
				break;
			case 'Partly Cloudy':
			case 'Partly cloudy':
				videoSrc = './videos/partly-cloudy.mp4';
				break;
			case 'Cloudy':
				videoSrc = './videos/cloudy.mp4';
				break;
			case 'Overcast':
				videoSrc = './videos/cloudy.mp4';
				break;
			case 'Mist':
			case 'Fog':
			case 'Smoke':
			case 'Freezing fog':
				videoSrc = './videos/cloudy.mp4';
				break;
			case 'Patchy rain possible':
			case 'Light rain':
			case 'Moderate rain':
			case 'Heavy rain':
			case 'Thundery outbreaks possible':
			case 'Patchy light drizzle':
			case 'Light drizzle':
			case 'Freezing drizzle':
			case 'Heavy freezing drizzle':
			case 'Patchy light rain':
			case 'Light rain shower':
			case 'Moderate or heavy rain shower':
			case 'Moderate or heavy sleet showers':
			case 'Light sleet showers':
			case 'Patchy light nearby':
			case 'Patchy rain nearby':
			case 'Light freezing rain':
				videoSrc = './videos/rain.mp4';
				break;
			case 'Ice pellets':
			case 'Patchy snow possible':
			case 'Patchy moderate snow':
			case 'Light snow':
			case 'Moderate snow':
			case 'Heavy snow':
			case 'Blowing snow':
			case 'Blizzard':
			case 'Patchy light snow':
			case 'Light snow showers':
			case 'Moderate or heavy snow showers':
			case 'Patchy light snow with thunder':
			case 'Moderate or heavy snow with thunder':
				videoSrc = './videos/snowy.mp4';
				break;
			case 'Patchy light rain with thunder':
			case 'Moderate or heavy rain with thunder':
				videoSrc = './videos/rain.mp4';
				break;
			default:
				videoSrc = 'none';
				break;
		}

		return videoSrc;
	}

	async function init() {
		await getIp();
		fetchCurrentWeatherData(ipData.ip);
	}
	init();
})();
