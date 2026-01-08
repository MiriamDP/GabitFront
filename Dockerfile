# Usamos Node.js 20 como base (Angular 16 requiere Node >= 18)
FROM node:20

# Configuramos el directorio de trabajo
WORKDIR /app

# Instalamos Angular CLI 16 globalmente
RUN npm install -g @angular/cli@16

# Copiamos package.json y package-lock.json si es necesario
# COPY package*.json ./

# Exponemos el puerto por defecto de Angular
EXPOSE 4200

# Comando por defecto al iniciar el contenedor
#CMD ["ng", "version"]
