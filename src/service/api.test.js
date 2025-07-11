import { getAllCountries, getCountryByCode, getNameCountry } from './api';


global.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('getAllCountries', () => {
    it('fetches all countries successfully', async () => {
      const mockCountries = [{ name: { common: 'Country1' } }, { name: { common: 'Country2' } }];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCountries,
      });

      const countries = await getAllCountries();
      expect(countries).toEqual(mockCountries);
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,cca3');
    });

    it('throws an error if the network response is not ok', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(getAllCountries()).rejects.toThrow('Error al obtener los países');
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCountryByCode', () => {
    it('fetches a country by its code successfully', async () => {
      const mockCountry = [{ name: { common: 'France' } }];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCountry,
      });

      const country = await getCountryByCode('FRA');
      expect(country).toEqual(mockCountry);
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('https://restcountries.com/v3.1/alpha/FRA');
    });
  });

  describe('getNameCountry', () => {
    it('fetches a country name by its code successfully', async () => {
      const mockName = { name: { common: 'Germany' } };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockName,
      });

      const name = await getNameCountry('DEU');
      expect(name).toEqual(mockName);
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('https://restcountries.com/v3.1/alpha/DEU?fields=name,cca3');
    });
  });
});