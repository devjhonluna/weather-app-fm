/**
 * Returns an object with the unit names for a given system (metric or imperial).
 * Defaults to metric if the type is invalid.
 * @param {'metric' | 'imperial'} type - The desired unit system.
 * @returns {{tempUnit: string, windUnit: string, precipUnit: string}} An object containing the unit names for the API.
 */
const getUnitSystem = (type) => {
  const system = {
    metric: {
      tempUnit: "celsius",
      windUnit: "kmh",
      precipUnit: "mm",
    },
    imperial: {
      tempUnit: "fahrenheit",
      windUnit: "mph",
      precipUnit: "inch",
    },
  };
  return system[type] || system["metric"];
};

export default getUnitSystem