const API_BASE_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * Processes the daily weather data from the API into a more usable format.
 * It groups data by day instead of by metric.
 * @param {object} dailyData - The 'daily' object from the API response.
 * @returns {Array<object>} An array of objects, where each object represents a day.
 */
function processDailyData(dailyData) {
  const { time, weather_code, temperature_2m_max, temperature_2m_min } = dailyData;

  return time.map((date, index) => ({
    time: date,
    weather_code: weather_code[index],
    temperature_2m_max: temperature_2m_max[index],
    temperature_2m_min: temperature_2m_min[index],
  }));
}

/**
 * Fetches weather data from the Open-Meteo API.
 * @param {object} params - The parameters for the API call.
 * @param {number} params.latitude - The latitude of the location.
 * @param {number} params.longitude - The longitude of the location.
 * @param {object} params.units - The units for temperature, wind, etc.
 * @returns {Promise<object>} The processed weather data.
 */
export async function fetchWeatherFromApi({ latitude, longitude, units }) {
  const { temperature_unit, wind_speed_unit, precipitation_unit } = units;

  const params = new URLSearchParams({
    latitude,
    longitude,
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    hourly: "temperature_2m,weather_code",
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,precipitation,wind_speed_10m",
    wind_speed_unit,
    temperature_unit,
    precipitation_unit,
  });

  const url = `${API_BASE_URL}?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error fetching weather! status: ${response.status}`);
  }

  const data = await response.json();

  // Return data structured for the store
  return {
    currentData: {
      current: data.current,
      units: data.current_units,
    },
    hourlyData: {
      hourly: data.hourly,
      units: data.hourly_units,
    },
    dailyData: {
      daily: processDailyData(data.daily), // Process the daily data here
      units: data.daily_units,
    },
  };
}
