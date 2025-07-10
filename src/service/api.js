export async function getAllCountries() {
  const fields = "name,flags,population,region,capital,cca3";
  const res = await fetch(`https://restcountries.com/v3.1/all?fields=${fields}`);

  if (!res.ok) {
    throw new Error("Error al obtener los países");
  }

  return res.json();
}