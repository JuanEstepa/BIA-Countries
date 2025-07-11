// src/app/details/[id]/Details.test.jsx
import { render, screen, waitFor } from "@testing-library/react";
import Details from "./page";
import * as api from "@/service/api";

jest.mock("@/service/api", () => ({
  getCountryByCode: jest.fn(),
  getNameCountry: jest.fn(),
}));

jest.mock("next/link", () => {
  return ({ children, href }) => (
    <a href={href} data-testid={`link-${href}`}>
      {children}
    </a>
  );
});

const mockCountryData = {
  name: {
    common: "United States",
    official: "United States of America",
    nativeName: {
      eng: { official: "United States of America", common: "United States" },
    },
  },
  flags: {
    png: "https://flagcdn.com/us.svg",
    alt: "Flag of United States",
  },
  population: 331000000,
  region: "Americas",
  subregion: "Northern America",
  capital: ["Washington, D.C."],
  tld: [".us"],
  currencies: { USD: { name: "United States dollar", symbol: "$" } },
  languages: { eng: "English" },
  borders: ["CAN", "MEX"],
};

const mockBorderCountries = [
  {
    cca3: "CAN",
    name: { common: "Canada" },
    flags: { png: "...", alt: "..." },
  },
  {
    cca3: "MEX",
    name: { common: "Mexico" },
    flags: { png: "...", alt: "..." },
  },
];

describe("Details Page", () => {
  beforeEach(() => {
    api.getCountryByCode.mockClear();
    api.getNameCountry.mockClear();
  });

  it("renders loading state initially", () => {
    api.getCountryByCode.mockReturnValue(new Promise(() => {}));
    render(<Details params={{ id: "USA" }} />);

    expect(screen.getByAltText("Cargando...")).toBeInTheDocument();
    expect(
      screen.getByText("Cargando detalles del país...")
    ).toBeInTheDocument();
  });

  it("renders country details without borders if none exist", async () => {
    const countryDataNoBorders = { ...mockCountryData, borders: [] };
    api.getCountryByCode.mockResolvedValueOnce([countryDataNoBorders]);

    render(<Details params={{ id: "JPN" }} />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /United States/i })
      ).toBeInTheDocument();
      expect(screen.getByText("Currencies:")).toBeInTheDocument();
      expect(screen.getByText(/United States dollar/i)).toBeInTheDocument();
      expect(
        screen.queryByText("Cargando detalles del país...")
      ).not.toBeInTheDocument();
      expect(screen.queryByAltText("Cargando...")).not.toBeInTheDocument();
    });

    expect(api.getCountryByCode).toHaveBeenCalledWith("JPN");
    expect(api.getNameCountry).not.toHaveBeenCalled();

    expect(screen.getByText("Population:")).toBeInTheDocument();
    expect(screen.getByText(/331.000.000/i)).toBeInTheDocument();
    expect(screen.getByText("Region:")).toBeInTheDocument();
    expect(screen.getByText(/Americas/i)).toBeInTheDocument();
    expect(screen.getByText("Capital:")).toBeInTheDocument();
    expect(screen.getByText(/Washington, D.C./i)).toBeInTheDocument();
    expect(screen.getByText("Native Name:")).toBeInTheDocument();
    expect(screen.getByText(/United States of America/i)).toBeInTheDocument();
    expect(screen.getByText("Sub Region:")).toBeInTheDocument();
    expect(screen.getByText(/Northern America/i)).toBeInTheDocument();
    expect(screen.getByText("Top Level Domain:")).toBeInTheDocument();
    expect(screen.getByText(/.us/i)).toBeInTheDocument();
    expect(screen.getByText("Languages:")).toBeInTheDocument();
    expect(screen.getByText(/English/i)).toBeInTheDocument();
    expect(
      screen.getByText("N/A", { selector: "span.text-gray-500" })
    ).toBeInTheDocument();
  });

  it("renders country details with border countries", async () => {
    api.getCountryByCode.mockResolvedValueOnce([mockCountryData]);
    api.getNameCountry
      .mockResolvedValueOnce([mockBorderCountries[0]])
      .mockResolvedValueOnce([mockBorderCountries[1]]);

    render(<Details params={{ id: "USA" }} />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /United States/i })
      ).toBeInTheDocument();
      expect(
        screen.queryByText("Cargando detalles del país...")
      ).not.toBeInTheDocument();
      expect(screen.queryByAltText("Cargando...")).not.toBeInTheDocument();
    });

    expect(api.getCountryByCode).toHaveBeenCalledWith("USA");
    expect(api.getNameCountry).toHaveBeenCalledTimes(2);
    expect(api.getNameCountry).toHaveBeenCalledWith("CAN");
    expect(api.getNameCountry).toHaveBeenCalledWith("MEX");

    await waitFor(() => {
      expect(screen.getByText("Canada")).toBeInTheDocument();
      expect(screen.getByText("Mexico")).toBeInTheDocument();
    });
  });

  it("handles error when fetching main country data", async () => {
    api.getCountryByCode.mockRejectedValueOnce(
      new Error("Failed to fetch country")
    );
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<Details params={{ id: "NONEXISTENT" }} />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Error: Failed to load country details. Please try again."
        )
      ).toBeInTheDocument();
      expect(screen.queryByAltText("Cargando...")).not.toBeInTheDocument();
      expect(
        screen.queryByText("Cargando detalles del país...")
      ).not.toBeInTheDocument();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching main country details:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it("handles error when fetching border country names", async () => {
    api.getCountryByCode.mockResolvedValueOnce([mockCountryData]);
    api.getNameCountry
      .mockRejectedValueOnce(new Error("Failed to fetch border country CAN"))
      .mockResolvedValueOnce([mockBorderCountries[1]]);

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<Details params={{ id: "USA" }} />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /United States/i })
      ).toBeInTheDocument();
      expect(
        screen.getByText("N/A", { selector: "span.text-gray-500" })
      ).toBeInTheDocument();

      expect(
        screen.queryByText("Cargando detalles del país...")
      ).not.toBeInTheDocument();
      expect(screen.queryByAltText("Cargando...")).not.toBeInTheDocument();
    });

    expect(api.getCountryByCode).toHaveBeenCalledWith("USA");
    expect(api.getNameCountry).toHaveBeenCalledWith("CAN");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching border country names:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it('navigates back to home page when "Back" button is clicked', async () => {
    api.getCountryByCode.mockResolvedValueOnce([mockCountryData]);
    api.getNameCountry.mockResolvedValueOnce([mockBorderCountries[0]]);

    render(<Details params={{ id: "USA" }} />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /United States/i })
      ).toBeInTheDocument();
      expect(
        screen.queryByText("Cargando detalles del país...")
      ).not.toBeInTheDocument();
      expect(screen.queryByAltText("Cargando...")).not.toBeInTheDocument();
    });

    const backLink = screen.getByRole("link", { name: /Back/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/");
  });

  it("navigates to border country details when a border country link is clicked", async () => {
    api.getCountryByCode.mockResolvedValueOnce([mockCountryData]);
    api.getNameCountry
      .mockResolvedValueOnce([mockBorderCountries[0]])
      .mockResolvedValueOnce([mockBorderCountries[1]]);

    render(<Details params={{ id: "USA" }} />);

    await waitFor(() => {
      expect(screen.getByText("Canada")).toBeInTheDocument();
      expect(
        screen.queryByText("Cargando detalles del país...")
      ).not.toBeInTheDocument();
      expect(screen.queryByAltText("Cargando...")).not.toBeInTheDocument();
    });

    const canadaLink = screen.getByRole("link", { name: "Canada" });
    expect(canadaLink).toBeInTheDocument();
    expect(canadaLink).toHaveAttribute("href", "/details/CAN");
  });
});
