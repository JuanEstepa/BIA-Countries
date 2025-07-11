export async function getAllCountries() {
  const fields = "name,flags,population,region,capital,cca3";
  const res = await fetch(`https://restcountries.com/v3.1/all?fields=${fields}`);

  if (!res.ok) {
    throw new Error("Error al obtener los países");
  }

  return res.json();
}

export async function getCountryByCode(code) {
  const res = await fetch(
    `https://restcountries.com/v3.1/alpha/${code}`
  );

  if (!res.ok) {
    throw new Error("Error al obtener el país");
  }

  return res.json();
}

export async function getNameCountry(code) {
  const res = await fetch(
    `https://restcountries.com/v3.1/alpha/${code}?fields=name,cca3`
  );

  if (!res.ok) {
    throw new Error("Error al obtener el nombre del país");
  }

  return res.json();
}
