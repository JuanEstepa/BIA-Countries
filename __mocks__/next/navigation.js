// __mocks__/next/navigation.js
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  // Añade otros métodos si los utilizas en tus componentes (e.g., events, route)
};

module.exports = {
  useRouter: jest.fn(() => mockRouter),
  usePathname: jest.fn(() => '/details/USA'), // Un valor por defecto
  useSearchParams: jest.fn(() => new URLSearchParams()), // Un valor por defecto
};