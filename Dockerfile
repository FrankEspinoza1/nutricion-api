# Imagen base ligera con Node.js 20
FROM node:20-alpine

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Se copian primero los archivos de dependencias.
# Docker cachea esta capa: si el codigo cambia pero las dependencias no,
# no se vuelve a ejecutar npm install y la construccion es mucho mas rapida.
COPY package*.json ./
RUN npm install --omit=dev

# Ahora si, el codigo de la aplicacion
COPY src ./src

# Puerto que expone el contenedor
EXPOSE 3000

# Ejecutar como usuario sin privilegios, no como root
USER node

# Comando que arranca el servicio
CMD ["node", "src/server.js"]
