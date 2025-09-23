/**
 * Processes the daily weather data from the API into a more usable format.
 * It groups data by day instead of by metric.
 * @param {object} dailyData - The 'daily' object from the API response.
 * @returns {Array<object>} An array of objects, where each object represents a day.
 */
export const processDailyData=(dailyData)=> {
  const { time, weather_code, temperature_2m_max, temperature_2m_min } = dailyData;

  return time.map((date, index) => ({
    time: date,
    weather_code: weather_code[index],
    temperature_2m_max: temperature_2m_max[index],
    temperature_2m_min: temperature_2m_min[index],
  }));
}

