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