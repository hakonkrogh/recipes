const formatter = new Intl.NumberFormat("nb-NO");

export default function Amount({ servings, baseServings, amounts }) {
  const [amount] = amounts;

  return `${formatter.format(
    ((servings / baseServings) * amount.number).toFixed(1)
  )} ${amount.unit}`;
}
