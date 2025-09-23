import Alpine from "alpinejs";
import getUnitSystem from "../utils/units";
import { fetchWeatherFromApi } from "./api";

Alpine.store("app", {
  location: { city: "", admin:"",country: "" },
  unitSystem: "metric", // 'metric' o 'imperial'
  units: {
    temperature_unit: "celsius",
    wind_speed_unit: "kmh",
    precipitation_unit: "mm",
  },
  currentData: { current: {}, units: {} },
  hourlyData: { hourly: {}, units: {} }, // 'hourly' ahora es un objeto
  selectedHourlyDay: "", // Almacena la fecha del día seleccionado
  dailyData: {
    // Inicializamos con la estructura esperada: un objeto con una propiedad 'daily' que es un array.
    daily: [],
    units: {},
  },
  isLoading: false,

  init() {
    console.log("App store initialized");
  },

  toggleUnitSystem() {
    this.unitSystem = this.unitSystem === "metric" ? "imperial" : "metric";

    const newUnits = getUnitSystem(this.unitSystem);
    this.units.temperature_unit = newUnits.tempUnit;
    this.units.wind_speed_unit = newUnits.windUnit;
    this.units.precipitation_unit = newUnits.precipUnit;

    if (this.location.city) {
      this.fetchWeatherData(this.location);
    }
  },

  updateUnit(unitType, value) {
    if (this.units[unitType] !== value) {
      this.units[unitType] = value;
      // Si hay una ciudad seleccionada, volvemos a obtener los datos con las nuevas unidades
      if (this.location.city) {
        this.fetchWeatherData(this.location);
      }

      // Sincroniza el unitSystem general si las unidades coinciden con un sistema
      const metricUnits = getUnitSystem("metric");
      const imperialUnits = getUnitSystem("imperial");

      if (this.units.temperature_unit === metricUnits.tempUnit && this.units.wind_speed_unit === metricUnits.windUnit && this.units.precipitation_unit === metricUnits.precipUnit) {
        this.unitSystem = "metric";
      } else if (this.units.temperature_unit === imperialUnits.tempUnit && this.units.wind_speed_unit === imperialUnits.windUnit && this.units.precipitation_unit === imperialUnits.precipUnit) {
        this.unitSystem = "imperial";
      }
    }
  },

  async fetchWeatherData({ latitude: lat, longitude: lon, name, city, country,admin }) {
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
      this.currentData = this.hourlyData = this.dailyData = null;
    } finally {
      this.isLoading = false;
    }
  },
});
