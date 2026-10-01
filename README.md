# nutricion-api

Componente **backend** del proyecto Nutricion Sin Enredos.
Instituto Certus - Grupo 2 - Evidencia 3 (AA3).

## Responsabilidad del componente

Expone una API REST que atiende las peticiones del componente frontend
y se comunica con el servidor de base de datos. No sirve paginas HTML:
su unica responsabilidad es la logica de negocio y el acceso a datos.

## Organizacion del codigo

```
nutricion-api/
├── src/
│   ├── config/
│   │   └── db.js            Conexion con MongoDB Atlas
│   ├── models/
│   │   └── Servicio.js      Estructura del documento servicio
│   ├── routes/
│   │   └── servicios.js     Operaciones del CRUD
│   └── server.js            Punto de entrada y configuracion del servidor
├── Dockerfile               Definicion del contenedor
├── .env.example             Variables de entorno requeridas
└── package.json             Dependencias y comandos
```

La separacion sigue el patron por capas: `models` define la estructura de
los datos, `routes` la logica de cada operacion, `config` la conexion con
servicios externos, y `server.js` unicamente orquesta y arranca.

## Endpoints

| Metodo | Ruta | Accion |
|---|---|---|
| GET | /api/estado | Estado del servicio (usado en el monitoreo) |
| GET | /api/servicios | Listar todos |
| GET | /api/servicios/buscar/:texto | Buscar por nombre |
| GET | /api/servicios/:id | Obtener uno |
| POST | /api/servicios | Crear |
| PUT | /api/servicios/:id | Actualizar |
| DELETE | /api/servicios/:id | Eliminar |

## Tecnologias

Node.js 20, Express 4, Mongoose 8. Contenedor basado en `node:20-alpine`.

## Despliegue

Desplegado en **Render** a partir del Dockerfile de este repositorio.
La cadena de conexion se configura como variable de entorno `MONGODB_URI`
y nunca se incluye en el codigo.

## Ejecucion local

```
npm install
cp .env.example .env     # completar con la cadena real
npm start
```

Con Docker:

```
docker build -t nutricion-api .
docker run -p 3000:3000 --env-file .env nutricion-api
```
