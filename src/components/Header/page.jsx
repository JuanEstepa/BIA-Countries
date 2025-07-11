"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
  };

  return (
    <nav className="w-full h-[80px] bg-white dark:bg-DarkBlue shadow-md px-20 flex items-center justify-between sticky top-0 z-50 max-sm:px-5">
      <Link
        href="/"
        className="font-extrabold text-VeryDarkBlueText text-xl max-sm:text-lg dark:text-White"
      >
        Where in the world?
      </Link>
      <button
        onClick={toggleDarkMode}
        className="flex items-center justify-center gap-2 text-VeryDarkBlueText dark:text-White font-semibold max-sm:text-md cursor-pointer hover:scale-105 transition-transform duration-300"
      >
        <ion-icon
          name="moon-outline"
          className="text-VeryDarkBlueText dark:text-White text-xl max-sm:text-lg"
        />
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </nav>
  );
}
