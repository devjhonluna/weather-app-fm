export default () => ({
  selectedCity: null,
  getCityData() {
    if (!this.selectedCity || !this.selectedCity.latitude) {
      alert("Please select a city first");
      return;
    }
    // Usamos 'this.$store' para acceder al store de Alpine
    this.$store.app.fetchWeatherData(this.selectedCity);
    this.$dispatch("clear-search-input");
  },
});