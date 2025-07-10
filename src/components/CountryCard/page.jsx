export default function CountryCard({
  flag,
  name,
  population,
  region,
  capital,
  cca3,
}) {
  return (
    <div>
      <h2 className="text-lg font-bold">{name}</h2>
      <p className="text-sm text-gray-500">{region}</p>
    </div>
  );
}
