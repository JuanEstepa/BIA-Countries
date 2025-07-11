"use client";

import { use, useEffect, useState } from "react";
import { getCountryByCode, getNameCountry } from "@/service/api";
import Link from "next/link";

export default function Details({ params }) {
  const { id } = use(params);
  const [country, setCountry] = useState(null);
  const [borderNames, setBorderNames] = useState([]);

  useEffect(() => {
    getCountryByCode(id)
      .then((data) => {
        const countryData = data[0];
        setCountry(countryData);

        if (countryData.borders?.length > 0) {
          Promise.all(
            countryData.borders.map((border) => getNameCountry(border))
          )
            .then((names) => {
              const borders = names.map((name) => ({
                code: name.cca3,
                name: name.name.common,
              }));
              console.log(borders);
              setBorderNames(borders);
            })
            .catch((error) => {
              console.error("Error fetching border country names:", error);
            });
        } else {
          setBorderNames([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching country details:", error);
      });
  }, [id]);

  if (!country) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <img
            src="https://usagif.com/wp-content/uploads/loading-13.gif"
            alt="Cargando..."
            className="w-32 h-32 mb-4"
          />
          <div className="p-6 text-lg font-semibold text-VeryDarkBlueText dark:text-White">
            Cargando detalles del país...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-20 max-sm:px-5 max-sm:py-10">
      <Link
        href="/"
        className="w-[136px] flex items-center justify-center gap-2 mb-20 max-md:mb-15 px-8 py-3 bg-White dark:bg-DarkBlue rounded-md shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <ion-icon
          name="arrow-back-outline"
          className="text-VeryDarkBlueText dark:text-White"
        />
        <p className="text-VeryDarkBlueText dark:text-White hover:scale-105">
          Back
        </p>
      </Link>
      <section className="flex items-center w-full gap-30 max-lg:flex-col max-md:gap-10">
        <img
          className="w-[560px] h-[400px] max-lg:w-full max-sm:h-[240px] object-cover"
          src={country.flags.png}
          alt={country.flags.alt}
        />
        <div className="w-[600px] max-lg:w-full">
          <h1 className="text-2xl font-extrabold mb-9 text-VeryDarkBlueText dark:text-White">
            {country.name.common ?? "N/A"}
          </h1>
          <div className="w-full flex max-sm:flex-col gap-10 mb-20 max-lg:mb-10">
            <div className="flex flex-col">
              <p className="text-VeryDarkBlueText dark:text-White">
                <strong className="font-semibold ">Native Name: </strong>{" "}
                {country.name.official ?? "N/A"}
              </p>
              <p className="text-VeryDarkBlueText dark:text-White">
                <strong className="font-semibold text-VeryDarkBlueText dark:text-White">
                  Population:{" "}
                </strong>{" "}
                {country.population.toLocaleString() ?? "N/A"}
              </p>
              <p className="text-VeryDarkBlueText dark:text-White">
                <strong className="font-semibold text-VeryDarkBlueText dark:text-White">
                  Region:
                </strong>{" "}
                {country.region ?? "N/A"}
              </p>
              <p className="text-VeryDarkBlueText dark:text-White">
                <strong className="font-semibold text-VeryDarkBlueText dark:text-White">
                  Sub Region:
                </strong>{" "}
                {country.subregion ?? "N/A"}
              </p>
              <p className="text-VeryDarkBlueText dark:text-White">
                <strong className="font-semibold text-VeryDarkBlueText dark:text-White">
                  Capital:
                </strong>{" "}
                {country.capital?.[0] ?? "N/A"}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-VeryDarkBlueText dark:text-White">
                <strong className="font-semibold text-VeryDarkBlueText dark:text-White">
                  Top Level Domain:{" "}
                </strong>{" "}
                {country.tld?.[0] ?? "N/A"}
              </p>
              <p className="text-VeryDarkBlueText dark:text-White">
                <strong className="font-semibold text-VeryDarkBlueText dark:text-White">
                  Currencies:
                </strong>{" "}
                {country.currencies?.EUR?.name ?? "N/A"}
              </p>
              <p className="text-VeryDarkBlueText dark:text-White">
                <strong className="font-semibold text-VeryDarkBlueText dark:text-White">
                  Languages:
                </strong>{" "}
                {country.languages
                  ? Object.values(country.languages).join(", ")
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap max-sm:flex-col max-sm:items-start max-sm:gap-">
            <strong className="font-semibold text-VeryDarkBlueText dark:text-White mr-2">
              Border Countries:
            </strong>
            <div className="flex flex-wrap gap-2">
              {borderNames.length > 0 ? (
                borderNames.map((border) => (
                  <Link
                    key={border.code}
                    href={`/details/${border.code}`}
                    className="px-3 py-1 w-24 flex justify-center items-center bg-White dark:bg-DarkBlue rounded shadow text-sm mr-2 mb-2 hover:bg-gray-100 text-VeryDarkBlueText dark:text-White hover:dark:bg-VeryDarkBlueBg/80 transition"
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
