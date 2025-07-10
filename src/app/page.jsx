"use client";
import { useEffect, useState } from "react";
import { getAllCountries } from "@/service/api";

import CountryCard from "@/components/CountryCard/page";

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Filter by Region");

  const regions = ["Africa", "America", "Asia", "Europe", "Oceania"];

  useEffect(() => {
    getAllCountries().then(setCountries).catch(console.error);
  }, []);

  const handleSelect = (region) => {
    setSelected(region);
    setIsOpen(false);
  };

  return (
    <>
      <nav className="w-full h-[80px] bg-white shadow-md px-20 flex items-center justify-between">
        <h1 className="font-extrabold text-VeryDarkBlueText text-xl">
          Where in the world?
        </h1>
        <button className="flex items-center justify-center gap-2 text-VeryDarkBlueText font-semibold">
          <ion-icon
            name="moon-outline"
            className="text-VeryDarkBlueText text-xl"
          />
          Dark Mode
        </button>
      </nav>
      <main className="px-20 py-10">
        <div className="flex items-center justify-between mb-10">
          <label
            htmlFor="countryName"
            className="bg-White rounded-md shadow-sm flex items-center gap-6 px-8 py-4 w-[480px]  hover:shadow-md duration-300 cursor-pointer"
          >
            <ion-icon
              name="search-outline"
              className="text-VeryDarkBlueText text-xl "
            />
            <input
              type="text"
              id="countryName"
              placeholder="Search for a country..."
              className="w-full bg-White text-base outline-none font-semibold text-VeryDarkBlueText "
            />
          </label>
          <div className="relative w-[200px]">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-White rounded-md shadow-sm hover:shadow-md cursor-pointer transition-shadow group"
            >
              <span className="text-base font-semibold text-VeryDarkBlueText">
                {selected}
              </span>
              <ion-icon
                name={isOpen ? "chevron-up-outline" : "chevron-down-outline"}
                className="text-VeryDarkBlueText"
              />
            </button>

            {isOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-White rounded-md shadow-lg border border-gray-100 z-10">
                {regions.map((region) => (
                  <button
                    key={region}
                    onClick={() => handleSelect(region)}
                    className="w-full text-left px-4 py-2 text-sm text-VeryDarkBlueText hover:bg-gray-100 transition-colors first:rounded-t-md last:rounded-b-md cursor-pointer"
                  >
                    {region}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-18">
          {countries.map((country) => (
            <CountryCard
              key={country.cca3}
              flag={country.name.common}
              name={country.name.common}
              population={country.population.toLocaleString()}
              region={country.region}
              capital={country.capital ? country.capital[0] : "N/A"}
              cca3={country.cca3}
            />
          ))}
        </div>
      </main>
    </>
  );
}
