import Alpine from "alpinejs";
import getUnitSystem from "./units";

Alpine.store("app", {
  location: { city: "", country: "" },
  unitSystem: "metric",
  currentData: null,
  hourlyData: null,
  dailyData: null,
  isLoading: false,

  init() {
    console.log("App store initialized");
  },

  toggleUnitSystem() {
    this.unitSystem = this.unitSystem === "metric" ? "imperial" : "metric";
    // Si ya hay una ciudad seleccionada, volvemos a obtener los datos con las nuevas unidades
    if (this.location.city) {
      // Pasamos el objeto de ubicación completo para volver a buscar
      this.fetchWeatherData(this.location);
    }
  },

  async fetchWeatherData({ latitude: lat, longitude: lon, name, city, country }) {
    if (!lat || !lon) {
      console.error("Latitude and Longitude are required.");
      return;
    }

    this.isLoading = true;
    this.currentData = null;
    this.hourlyData = null;
    this.dailyData = null;
    // Establecemos la ubicación inmediatamente con los datos que ya tenemos
    this.location = {
      city: city || name, // Acepta 'city' o 'name' para el nombre de la ciudad
      country: country,
      latitude: lat,
      longitude: lon,
    };

    const units = getUnitSystem(this.unitSystem);
    const { tempUnit, windUnit, precipUnit } = units;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,precipitation,wind_speed_10m&wind_speed_unit=${windUnit}&temperature_unit=${tempUnit}&precipitation_unit=${precipUnit}`;

    try {
      // Ahora solo necesitamos hacer la petición de los datos del clima
      const weatherResponse = await fetch(url);

      if (!weatherResponse.ok) {
        throw new Error(`HTTP error fetching weather! status: ${weatherResponse.status}`);
      }

      const weatherData = await weatherResponse.json();

      // Separamos los datos como querías
      this.currentData = {
        current: weatherData.current,
        units: weatherData.current_units,
      };
      this.hourlyData = {
        hourly: weatherData.hourly,
        units: weatherData.hourly_units,
      };
      this.dailyData = {
        daily: weatherData.daily,
        units: weatherData.daily_units,
      };

    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("Could not fetch weather data.");
    } finally {
      this.isLoading = false;
    }
  },
});
