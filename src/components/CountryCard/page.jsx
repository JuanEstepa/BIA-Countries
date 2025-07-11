import Link from "next/link";

export default function CountryCard({
  flag,
  altFlag,
  name,
  population,
  region,
  capital,
  cca3,
}) {
  return (
    <Link href={`/details/${cca3}`}>
      <div className="bg-white dark:bg-DarkBlue rounded-md shadow-sm flex flex-col overflow-hidden w-full h-[340px] hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer">
        <img className="h-[160px] w-full" src={flag} alt={altFlag} />
        <section className="p-6 flex flex-col gap-5">
          <h2 className="text-base font-extrabold text-VeryDarkBlueText dark:text-White">
            {name}
          </h2>
          <div className="flex flex-col gap-1">
            <p className="text-VeryDarkBlueText dark:text-White text-sm">
              <strong className="font-semibold">Population:</strong>{" "}
              {population}
            </p>
            <p className="text-VeryDarkBlueText dark:text-White text-sm">
              <strong className="font-semibold">Region:</strong> {region}
            </p>
            <p className="text-VeryDarkBlueText dark:text-White text-sm">
              <strong className="font-semibold">Capital:</strong> {capital}
            </p>
          </div>
        </section>
      </div>
    </Link>
  );
}
