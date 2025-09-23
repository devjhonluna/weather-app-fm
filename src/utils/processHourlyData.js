/**
 * Processes the hourly weather data from the API into a more usable format.
 * It groups data by hour instead of by metric.
 * @param {object} rawHourlyData - The 'hourly' object from the API response.
 * @returns {object} An object with dates as keys and arrays of hourly forecasts as values.
 */
export const processHourlyData=(rawHourlyData)=>{
  const { time, temperature_2m, weather_code } = rawHourlyData;
  const groupedByDay = {};

  time.forEach((dateTime, index) => {
    const date = dateTime.split("T")[0]; // Extrae la parte de la fecha (YYYY-MM-DD)
    if (!groupedByDay[date]) {
      groupedByDay[date] = [];
    }
    groupedByDay[date].push({
      time: dateTime,
      temperature_2m: temperature_2m[index],
      weather_code: weather_code[index],
    });
  });
  return groupedByDay;
}