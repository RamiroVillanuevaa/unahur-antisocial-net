# UnaHur Anti-Social Net

FrontEnd en React y TypeScript de la red social "UnaHur Anti-Social Net".
Trabajo Práctico 2  Construcción de Interfaces de Usuario (UNAHUR, 2.º cuatrimestre 2026).

Permite ver el feed de publicaciones, filtrarlas por etiqueta, entrar al detalle de cada una,
comentar, ver el perfil público de cada usuario, registrarse, iniciar sesión y crear
publicaciones propias con imágenes y etiquetas.

## Integrantes

- Castillo, Marcos
- Dirie, Nazareno
- Villanueva, Ramiro

## Tecnologías

- React 19 + TypeScript (Vite)
- React Router DOM
- React Bootstrap + Bootstrap 5
- Context API y localStorage para la sesión
- Fetch para consumir la API

## API utilizada

Usamos el BackEnd que da la cátedra: https://github.com/lucasfigarola/backend-api

Corre en `http://localhost:3001`.

## Cómo correrlo en local

Hacen falta dos terminales: una para el BackEnd y otra para el FrontEnd.

**1. BackEnd**

```bash
git clone https://github.com/lucasfigarola/backend-api.git
cd backend-api
npm install
node seed.js
npm start
```

**2. FrontEnd**

```bash
git clone https://github.com/RamiroVillanuevaa/unahur-antisocial-net.git
cd unahur-antisocial-net
npm install
npm run dev
```

Abrir http://localhost:5173

## Usuarios de prueba

El `seed.js` del BackEnd crea los usuarios `Linus` y `Torvalds`.
El login es simulado: la contraseña es `123456` para todos.

## Rutas

| Ruta | Qué muestra | Necesita sesión |
| --- | --- | --- |
| `/` | Home con el feed y el filtro por etiquetas | No |
| `/post/:id` | Detalle de la publicación y comentarios | No (para comentar, sí) |
| `/usuario/:id` | Perfil público de un usuario con sus publicaciones | No |
| `/login` | Inicio de sesión | No |
| `/registro` | Alta de usuario | No |
| `/perfil` | Datos y publicaciones del usuario logueado | Sí |
| `/nuevo-post` | Formulario de nueva publicación | Sí |
| cualquier otra | Página 404 | No |

## Extras

- Filtro por etiquetas con el contador de resultados.
- Perfil público de cada usuario, al tocar su nombre.
- La sesión se mantiene al recargar la página (localStorage).
- Mensajes de carga, de éxito y de error, también cuando el BackEnd está apagado.
- Diseño responsive: 1, 2 o 3 columnas según el ancho de la pantalla.