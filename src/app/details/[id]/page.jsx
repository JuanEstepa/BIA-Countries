"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import * as api from "@/service/api";

export default function Details({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;
  const [country, setCountry] = useState(null);
  const [borderNames, setBorderNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountryAndBorders = async () => {
      setLoading(true);
      setError(null); // Restablecer el estado de error principal

      try {
        const countryDataArray = await api.getCountryByCode(id);

        if (countryDataArray && countryDataArray.length > 0) {
          const mainCountryData = countryDataArray[0];
          setCountry(mainCountryData);

          // Manejar países fronterizos con su propio manejo de errores
          if (mainCountryData.borders && mainCountryData.borders.length > 0) {
            try {
              const borderPromises = mainCountryData.borders.map(
                (borderCode) => {
                  // Asegúrate de que api.getNameCountry devuelva una Promesa.
                  // Si por alguna razón devuelve null/undefined, crea una promesa resuelta con null.
                  const promise = api.getNameCountry(borderCode);
                  return promise instanceof Promise
                    ? promise.then((data) => data[0])
                    : Promise.resolve(null);
                }
              );

              const borderNameArrays = await Promise.all(borderPromises);

              const borders = borderNameArrays
                .filter(Boolean) // Filtrar cualquier resultado null/undefined de las búsquedas individuales de fronteras
                .map((countryItem) => ({
                  code: countryItem.cca3,
                  name: countryItem.name.common,
                }));
              setBorderNames(borders);
            } catch (borderFetchError) {
              console.error(
                "Error al obtener nombres de países fronterizos:",
                borderFetchError
              );
              // Si la obtención de nombres de fronteras falla, aún mostrar los detalles del país principal, pero sin fronteras
              setBorderNames([]);
            }
          } else {
            setBorderNames([]); // No hay fronteras para obtener
          }
        } else {
          // Si getCountryByCode devuelve un array vacío o null, significa que el país no se encontró
          setError(new Error("No se encontró el país."));
          setCountry(null); // Asegurarse de que el país sea null para el mensaje "País no encontrado"
        }
      } catch (mainFetchError) {
        // Este bloque catch maneja los errores del propio getCountryByCode
        console.error(
          "Error al obtener detalles del país principal:",
          mainFetchError
        );
        setError(
          new Error(
            "Error al cargar los detalles del país. Por favor, inténtalo de nuevo."
          )
        );
        setCountry(null); // Asegurarse de que el país sea null en caso de error de obtención principal
      } finally {
        setLoading(false);
      }
    };

    fetchCountryAndBorders();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <img
          src="https://usagif.com/wp-content/uploads/loading-13.gif"
          alt="Cargando..."
          className="w-32 h-32 mb-4"
        />
        <p className="mt-4 text-lg font-semibold text-VeryDarkBlueText dark:text-White">
          Cargando detalles del país...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg font-semibold">
          Error: {error.message}
        </p>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="p-6 text-lg font-semibold text-VeryDarkBlueText dark:text-White">
          No se encontró el país.
        </p>
      </div>
    );
  }

  const formatPopulation = (num) => {
    return num.toLocaleString("es-ES");
  };

  const getCurrencyName = (currencies) => {
    if (!currencies) return "N/A";
    const currencyNames = Object.values(currencies)
      .map((currency) => currency.name)
      .filter(Boolean);
    return currencyNames.length > 0 ? currencyNames.join(", ") : "N/A";
  };

  const getLanguageNames = (languages) => {
    if (!languages) return "N/A";
    const languageNames = Object.values(languages).filter(Boolean);
    return languageNames.length > 0 ? languageNames.join(", ") : "N/A";
  };

  const getNativeName = (name) => {
    if (!name || !name.nativeName) return name.official || name.common || "N/A";
    const nativeNameEntries = Object.values(name.nativeName);
    if (nativeNameEntries.length === 0)
      return name.official || name.common || "N/A";
    const primaryNativeName = nativeNameEntries[0];
    return (
      primaryNativeName.official ||
      primaryNativeName.common ||
      name.official ||
      name.common ||
      "N/A"
    );
  };

  return (
    <div className="p-20 max-sm:px-5 max-sm:py-10">
      <Link
        href="/"
        className="flex items-center gap-2 mb-20 max-md:mb-10 w-fit py-2 px-6 rounded-md shadow-md text-VeryDarkBlueText dark:text-White bg-White dark:bg-DarkBlue hover:scale-105 transition-transform"
      >
        <ion-icon
          name="arrow-back-outline"
          className="text-VeryDarkBlueText dark:text-White"
        ></ion-icon>
        <p className="text-VeryDarkBlueText dark:text-White">Back</p>
      </Link>
      <section className="flex items-center w-full gap-30 max-lg:flex-col max-md:gap-10">
        <Image
          src={country.flags.png}
          alt={country.flags.alt || `Flag of ${country.name.common}`}
          width={560}
          height={400}
          className="w-[560px] h-[400px] max-lg:w-full max-sm:h-[240px] object-cover"
          priority
        />
        <div className="w-[600px] max-lg:w-full">
          <h1 className="text-2xl font-extrabold mb-9 text-VeryDarkBlueText dark:text-White">
            {country.name.common}
          </h1>
          <div className="w-full flex max-sm:flex-col gap-10 mb-20 max-lg:mb-10">
            <div className="flex flex-col">
              <p className="text-VeryDarkBlueText dark:text-White">
                <strong className="font-semibold ">Native Name: </strong>
                {getNativeName(country.name)}
              </p>
              <p className="text-VeryDarkBlueText dark:text-White">
                <strong className="font-semibold text-VeryDarkBlueText dark:text-White">
                  Population:{" "}
                </strong>
                {formatPopulation(country.population)}
              </p>
              <p className="text-VeryDarkBlueText dark:text-White">
                <strong className="font-semibold text-VeryDarkBlueText dark:text-White">
                  Region:{" "}
                </strong>
                {country.region}
              </p>
              <p className="text-VeryDarkBlueText dark:text-White">
                <strong className="font-semibold text-VeryDarkBlueText dark:text-White">
                  Sub Region:{" "}
                </strong>
                {country.subregion || "N/A"}
              </p>
              <p className="text-VeryDarkBlueText dark:text-White">
                <strong className="font-semibold text-VeryDarkBlueText dark:text-White">
                  Capital:{" "}
                </strong>
                {country.capital && country.capital.length > 0
                  ? country.capital[0]
                  : "N/A"}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-VeryDarkBlueText dark:text-White">
                <strong className="font-semibold text-VeryDarkBlueText dark:text-White">
                  Top Level Domain:{" "}
                </strong>
                {country.tld && country.tld.length > 0 ? country.tld[0] : "N/A"}
              </p>
              <p className="text-VeryDarkBlueText dark:text-White">
                <strong className="font-semibold text-VeryDarkBlueText dark:text-White">
                  Currencies:{" "}
                </strong>
                {getCurrencyName(country.currencies)}
              </p>
              <p className="text-VeryDarkBlueText dark:text-White">
                <strong className="font-semibold text-VeryDarkBlueText dark:text-White">
                  Languages:{" "}
                </strong>
                {getLanguageNames(country.languages)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap max-sm:flex-col max-sm:items-start max-sm:gap-">
            <strong className="font-semibold text-VeryDarkBlueText dark:text-White mr-2">
              Border Countries:{" "}
            </strong>
            <div className="flex flex-wrap gap-2">
              {borderNames.length > 0 ? (
                borderNames.map((border) => (
                  <Link
                    key={border.code}
                    href={`/details/${border.code}`}
                    className="py-1 px-6 rounded-md shadow-md text-VeryDarkBlueText dark:text-White bg-White dark:bg-DarkBlue hover:scale-105 transition-transform text-sm"
                  >
                    {border.name}
                  </Link>
                ))
              ) : (
                <span className="text-gray-500 dark:text-White ml-2">N/A</span>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
