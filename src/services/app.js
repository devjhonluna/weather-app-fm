import Alpine from "alpinejs";
import getUnitSystem from "@utils/units";
import { fetchWeatherFromApi } from "./api";
import { setupDarkMode } from "@utils/darkmodeSwitcher";
import getSelectedCity from "./getSelectedCity";

Alpine.data("selectedCity", getSelectedCity);
// Registra el store del modo oscuro
setupDarkMode();

/**
 * @typedef {'metric' | 'imperial'} UnitSystem
 *
 * @typedef {object} ApiUnits
 * @property {string} temperature_unit
 * @property {string} wind_speed_unit
 * @property {string} precipitation_unit
 *
 * @typedef {object} CityLocation
 * @property {string} city - The name of the city.
 * @property {string} admin - The administrative region (e.g., state, province).
 * @property {string} country - The country name.
 * @property {number} [latitude] - The latitude of the city.
 * @property {number} [longitude] - The longitude of the city.
 *
 * @typedef {object} CityData
 * @property {number} latitude
 * @property {number} longitude
 * @property {string} [name]
 * @property {string} [city]
 * @property {string} [country]
 * @property {string} [admin]
 */

Alpine.store("app", {
  /** @type {CityLocation} */
  location: { city: "", admin: "", country: "" },
  /** @type {UnitSystem} */
  unitSystem: "metric",
  /** @type {ApiUnits} */
  units: {
    temperature_unit: "celsius",
    wind_speed_unit: "kmh",
    precipitation_unit: "mm",
  },
  /** @type {object|null} */
  currentData: { current: {}, units: {} },
  /** @type {{ hourly: Record<string, object[]>, units: object }|null} */
  hourlyData: { hourly: {}, units: {} },
  /** @type {string} */
  selectedHourlyDay: "",
  /** @type {{ daily: object[], units: object }|null} */
  dailyData: {
    daily: [],
    units: {},
  },
  /** @type {boolean} */
  isLoading: false,

  /**
   * Initializes the Alpine store.
   */
  init() {
    console.log("App store initialized");
  },

  /**
   * Toggles the unit system between 'metric' and 'imperial' and refetches weather data.
   */
  toggleUnitSystem() {
    this.unitSystem = this.unitSystem === "metric" ? "imperial" : "metric";

    const newUnits = getUnitSystem(this.unitSystem);
    // @ts-ignore
    this.units.temperature_unit = newUnits.tempUnit;
    // @ts-ignore
    this.units.wind_speed_unit = newUnits.windUnit;
    // @ts-ignore
    this.units.precipitation_unit = newUnits.precipUnit;

    if (this.location.city) {
      // @ts-ignore
      this.fetchWeatherData(this.location);
    }
  },

  /**
   * Updates a specific unit and refetches weather data.
   * Also synchronizes the main `unitSystem` property if all units match a system.
   * @param {'temperature_unit' | 'wind_speed_unit' | 'precipitation_unit'} unitType - The type of unit to update.
   * @param {string} value - The new value for the unit.
   */
  updateUnit(unitType, value) {
    if (this.units[unitType] !== value) {
      this.units[unitType] = value;
      // Si hay una ciudad seleccionada, volvemos a obtener los datos con las nuevas unidades
      if (this.location.city) {
        // @ts-ignore
        this.fetchWeatherData(this.location);
      }

      // Sincroniza el unitSystem general si las unidades coinciden con un sistema
      const metricUnits = getUnitSystem("metric");
      const imperialUnits = getUnitSystem("imperial");

      if (
        this.units.temperature_unit === metricUnits.tempUnit &&
        this.units.wind_speed_unit === metricUnits.windUnit &&
        this.units.precipitation_unit === metricUnits.precipUnit
      ) {
        this.unitSystem = "metric";
      } else if (
        this.units.temperature_unit === imperialUnits.tempUnit &&
        this.units.wind_speed_unit === imperialUnits.windUnit &&
        this.units.precipitation_unit === imperialUnits.precipUnit
      ) {
        this.unitSystem = "imperial";
      }
    }
  },

  /**
   * Fetches weather data for a given location and updates the store state.
   * @param {CityData} cityData - The location data including latitude and longitude.
   */
  async fetchWeatherData({ latitude: lat, longitude: lon, name, city, country, admin }) {
    if (!lat || !lon) {
      console.error("Latitude and Longitude are required.");
      return;
    }

    this.isLoading = true;
    this.location = {
      city: city || name,
      admin: admin,
      country: country,
      latitude: lat,
      longitude: lon,
    };

    try {
      const weatherData = await fetchWeatherFromApi({
        latitude: lat,
        longitude: lon,
        units: this.units,
      });

      this.currentData = weatherData.currentData;
      this.hourlyData = weatherData.hourlyData;
      this.dailyData = weatherData.dailyData;

      // Seleccionar automáticamente el primer día disponible en el pronóstico por hora
      const firstDay = Object.keys(this.hourlyData.hourly)[0];
      this.selectedHourlyDay = firstDay || "";
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("Could not fetch weather data.");
      this.currentData = null;
      this.hourlyData = null;
      this.dailyData = null;
    } finally {
      this.isLoading = false;
    }
  },
});
