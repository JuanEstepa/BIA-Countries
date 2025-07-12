const BASE_URL = "https://restcountries.com/v3.1"

export async function getAllCountries() {
  const fields = "name,flags,population,region,capital,cca3";
  const res = await fetch(`${BASE_URL}/all?fields=${fields}`);

  if (!res.ok) {
    throw new Error("Error al obtener los países");
  }

  return res.json();
}

export async function getCountryByCode(code) {
  const res = await fetch(
    `${BASE_URL}/alpha/${code}`
  );

  if (!res.ok) {
    throw new Error("Error al obtener el país");
  }

  return res.json();
}

export async function getNameCountry(code) {
  const res = await fetch(
    `${BASE_URL}/alpha/${code}?fields=name,cca3`
  );

  if (!res.ok) {
    throw new Error("Error al obtener el nombre del país");
  }

  return res.json();
}
