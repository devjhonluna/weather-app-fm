/**
 * Map of WMO weather codes to their corresponding image paths.
 * @see https://open-meteo.com/en/docs#weathervariables
 */
import Sunny from '../assets/images/icon-sunny.webp'
import PartlyCloudy from '../assets/images/icon-partly-cloudy.webp'
import Overcast from '../assets/images/icon-overcast.webp'
import Fog from '../assets/images/icon-fog.webp'
import Drizzle from '../assets/images/icon-drizzle.webp'
import Rain from '../assets/images/icon-rain.webp'
import Snow from '../assets/images/icon-snow.webp'
import Storm from '../assets/images/icon-storm.webp'

export const WEATHER_CODE_TO_IMAGE_MAP = {
  0: Sunny.src,
  1: PartlyCloudy.src, // Mainly clear
  2: PartlyCloudy.src, // Partly cloudy
  3: Overcast.src, // Overcast
  45: Fog.src,
  48: Fog.src,
  51: Drizzle.src,
  53: Drizzle.src,
  55: Drizzle.src, // Drizzle: dense intensity
  56: Drizzle.src,
  57: Drizzle.src,
  61: Rain.src,
  63: Rain.src,
  65: Rain.src,
  66: Rain.src,
  67: Rain.src,
  71: Snow.src,
  73: Snow.src,
  75: Snow.src,
  77: Snow.src,
  80: Rain.src,
  81: Rain.src,
  82: Rain.src,
  85: Snow.src,
  86: Snow.src,
  95: Storm.src,
  96: Storm.src,
  99: Storm.src,
};

/**
 * Returns the image path for a given WMO weather code.
 * @param {number} code - The WMO weather code.
 * @returns {string} The path to the corresponding weather image. Returns a sunny icon by default.
 */
const getWeatherImg = (code) => {
  return WEATHER_CODE_TO_IMAGE_MAP[code] || WEATHER_CODE_TO_IMAGE_MAP[0];
};

export default getWeatherImg;
