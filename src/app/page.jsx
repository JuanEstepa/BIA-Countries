"use client";
import { useEffect, useState } from "react";
import { getAllCountries } from "@/service/api";
import dynamic from "next/dynamic";

const DynamicCountryCard = dynamic(
  () => import("@/components/CountryCard/page"),
  {
    loading: () => (
      <div className="bg-[--color-White] dark:bg-[--color-DarkBlue] rounded-md shadow-md w-full h-[340px] flex flex-col animate-pulse overflow-hidden">
        <div className="h-[160px] w-full bg-gray-200 dark:bg-gray-700"></div>{" "}
        <div className="p-6 flex flex-col gap-5 w-full">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>{" "}
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-3"></div>{" "}
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mt-2"></div>{" "}
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mt-2"></div>{" "}
        </div>
      </div>
    ),
  }
);

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("Filter by Region");

  const regions = ["All", "Africa", "Americas", "Asia", "Europe", "Oceania"];

  useEffect(() => {
    getAllCountries()
      .then((data) => {
        setCountries(data);
        setFilteredCountries(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    let currentCountries = [...countries];

    if (selectedRegion !== "Filter by Region" && selectedRegion !== "All") {
      currentCountries = currentCountries.filter(
        (country) => country.region === selectedRegion
      );
    }

    if (searchTerm) {
      currentCountries = currentCountries.filter((country) =>
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCountries(currentCountries);
  }, [searchTerm, selectedRegion, countries]);

  const handleSelect = (region) => {
    setSelectedRegion(region);
    setIsOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <main className="px-20 py-10 max-sm:px-5">
      <div className="flex items-center justify-between mb-10 max-sm:flex-col max-sm:gap-6 max-sm:items-start">
        <label
          htmlFor="countryName"
          className="bg-White dark:bg-DarkBlue rounded-md shadow-sm flex items-center gap-6 px-8 py-4 w-[480px] hover:shadow-md duration-300 cursor-pointer max-sm:w-full max-lg:w-[350px]"
        >
          <ion-icon
            name="search-outline"
            className="text-VeryDarkBlueText dark:text-White text-xl "
          />
          <input
            type="text"
            id="countryName"
            placeholder="Search for a country..."
            className="w-full bg-White dark:bg-DarkBlue text-base outline-none font-semibold text-VeryDarkBlueText dark:text-White"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </label>
        <div className="relative w-[200px]">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-4 py-3 h-[56px] bg-White dark:bg-DarkBlue rounded-md shadow-sm hover:shadow-md cursor-pointer transition-shadow group"
          >
            <span className="text-base font-semibold text-VeryDarkBlueText dark:text-White">
              {selectedRegion}
            </span>
            <ion-icon
              name={isOpen ? "chevron-up-outline" : "chevron-down-outline"}
              className="text-VeryDarkBlueText dark:text-White"
            />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-White dark:bg-DarkBlue rounded-md shadow-lg border border-gray-100 dark:border-VeryDarkBlueBg/80 z-10">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => handleSelect(region)}
                  className="w-full text-left px-4 py-2 text-sm text-VeryDarkBlueText dark:text-White hover:bg-gray-100 hover:dark:bg-VeryDarkBlueBg/70 transition-colors first:rounded-t-md last:rounded-b-md cursor-pointer"
                >
                  {region}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 max-sm:grid-cols-1 max-lg:grid-cols-2 max-sm:gap-11 gap-18 max-sm:px-10">
        {filteredCountries.length > 0 ? (
          filteredCountries.map((country) => (
            <DynamicCountryCard
              key={country.cca3}
              flag={country.flags.png}
              altFlag={country.flags.alt}
              name={country.name.common}
              population={country.population.toLocaleString("en-US")}
              region={country.region}
              capital={country.capital ? country.capital[0] : "N/A"}
              cca3={country.cca3}
            />
          ))
        ) : (
          <p className="text-xl font-semibold text-VeryDarkBlueText dark:text-white col-span-full text-center">
            No se encontraron países que coincidan con la búsqueda.
          </p>
        )}
      </div>
    </main>
  );
}
