const formatter = new Intl.NumberFormat("nb-NO");

function localiseAmount(amount) {
  let localised = amount;

  const conversion = {
    ounces: (ounce) => ({ number: ounce * 28.35, unit: "gram" }),
    cups: (cups) => ({ number: cups * 237, unit: "ml" }),
  }[amount.unit];

  if (conversion) {
    localised = conversion(amount.number);
  }

  return localised;
}

function trUnit(unit) {
  return (
    {
      cloves: "båter",
      tsp: "ts",
      tbsp: "ss",
      units: "stk",
    }[unit] || unit
  );
}

export default function Amount({ servings, baseServings, amounts }) {
  const [amount] = amounts;

  const localised = localiseAmount(amount);

  return `${formatter.format(
    ((servings / baseServings) * localised.number).toFixed(1)
  )} ${trUnit(localised.unit)}`;
}
