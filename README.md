# Desafío Frontend: Explorador de Países

Este es un proyecto [Next.js] desarrollado como parte de una prueba técnica para construir un explorador de países interactivo, consumiendo datos de la API [REST Countries](https://restcountries.com/).

## Características Implementadas

- **Listado de Países:** Muestra una lista de todos los países obtenidos de la API.
- **Buscador Funcional:** Permite buscar países por su nombre común.
- **Filtro por Región:** Incluye un menú desplegable para filtrar países por continente (África, América, Asia, Europa, Oceanía y Todos).
- **Vista de Detalle del País:** Al hacer clic en la bandera de un país, se navega a una página de detalle con información más exhaustiva sobre ese país, incluyendo sus países fronterizos (si aplica).
- **Diseño Responsivo:** Adaptado para una visualización óptima en diferentes tamaños de pantalla, incluyendo dispositivos móviles y de escritorio (1440px).
- **Modo Claro/Oscuro:** Implementa un selector de tema para alternar entre el modo claro y el modo oscuro, persistiendo la preferencia del usuario.

## Arquitectura y Solución Técnica

Este proyecto está construido con:

- **Next.js (App Router):** Se eligió el App Router de Next.js para gestionar las rutas y el renderizado, aprovechando las ventajas de los Server Components (aunque la mayoría de la lógica de UI interactiva se maneja con Client Components).
- **React:** Como la biblioteca principal para la construcción de la interfaz de usuario.
- **Tailwind CSS (v4.1):** Utilizado para el estilizado rápido y responsivo, haciendo uso de las nuevas funcionalidades de `@theme` para la definición de colores personalizados y el modo oscuro.
- **Manejo de Estado:** Se usa `useState` y `useEffect` de React para gestionar el estado local de los componentes, como los países filtrados, el término de búsqueda, la región seleccionada y el estado del modo oscuro.
- **Consumo de API:** Se utiliza `fetch` nativo para realizar las peticiones HTTP a la API de REST Countries (`https://restcountries.com`). Se gestionan tanto la obtención inicial de todos los países como la obtención de detalles de un país específico por su código.
- **Lazy Loading de Componentes:** El componente `CountryCard` se carga dinámicamente (`next/dynamic`) para optimizar el rendimiento y mostrar un estado de carga mientras se renderizan.
- **Gestión del Tema:** El modo oscuro se maneja aplicando la clase `dark` al elemento `<html>` del documento. La preferencia se persiste en `localStorage` y se aplica tempranamente en el `RootLayout` mediante un script para evitar el "parpadeo" del tema.
- **Tipografía e Íconos:** Se utiliza la fuente **Nunito Sans** con los pesos especificados (300, 600, 800) y los íconos se implementan mediante **Ionicons**.

## Cómo Empezar

Primero, ejecuta el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```
