import { render, screen } from "@testing-library/react";
import CountryCard from "./page";

describe("CountryCard", () => {
  const defaultProps = {
    flag: "https://flagcdn.com/es.svg",
    altFlag: "Flag of Spain",
    name: "Spain",
    population: "47,500,000",
    region: "Europe",
    capital: "Madrid",
    cca3: "ESP",
  };

  it("renders country details correctly", () => {
    render(<CountryCard {...defaultProps} />);
    expect(screen.getByRole("heading", { name: /Spain/i })).toBeInTheDocument();
    const flagImage = screen.getByAltText(/Flag of Spain/i);
    expect(flagImage).toBeInTheDocument();
    expect(flagImage).toHaveAttribute("src", "https://flagcdn.com/es.svg");
    expect(screen.getByText(/Population:/i)).toBeInTheDocument();
    expect(screen.getByText(/47,500,000/i)).toBeInTheDocument();
    expect(screen.getByText(/Region:/i)).toBeInTheDocument();
    expect(screen.getByText(/Europe/i)).toBeInTheDocument();
    expect(screen.getByText(/Capital:/i)).toBeInTheDocument();
    expect(screen.getByText(/Madrid/i)).toBeInTheDocument();
  });

  it("links to the correct details page", () => {
    render(<CountryCard {...defaultProps} />);

    const linkElement = screen.getByRole("link", { name: /Spain/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/details/ESP");
  });

  it('renders "N/A" for capital if not provided', () => {
    const propsWithoutCapital = {
      ...defaultProps,
      capital: "N/A",
    };
    render(<CountryCard {...propsWithoutCapital} />);
    expect(screen.getByText(/Capital:/i)).toBeInTheDocument();
    expect(screen.getByText(/N\/A/i)).toBeInTheDocument();
  });
});
