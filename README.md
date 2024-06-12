# AppLibrary
Aplicación de Libreta de Direcciones
 

## Descripción

Esta es una aplicación web desarrollada con Angular 17 que permite a los usuarios gestionar sus contactos con información adicional y realizar búsquedas basadas en múltiples atributos. La aplicación utiliza un backend construido con Laravel y una base de datos MySQL.

## Requisitos

- Angular CLI: 17.3.8
- Node.js: 20.11.0
- npm: 10.4.0 
- Backend en Laravel (ver [instrucciones del backend](../backend/README.md))

## Instalación

Sigue estos pasos para instalar y ejecutar la aplicación:

### 1. Clonar el Repositorio

Clona el repositorio a tu máquina local usando el siguiente comando:
 
git clone https://github.com/carlosed1995/AppLibrary.git

### 2. Navegar al Directorio del Proyecto
Ve al directorio del proyecto:

cd AppLibrary

### 3. Instalar Dependencias
Instala las dependencias del proyecto utilizando npm:

npm install

### 4. Configurar el Backend
Asegúrate de tener el backend de Laravel configurado y en ejecución. Sigue las instrucciones en el README.md del backend para configurarlo y ejecutarlo.

### 5. Configurar el Archivo environment.ts
Asegúrate de que el archivo src/environments/environment.ts contenga la URL correcta de tu API. Debería verse algo así:

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api/contacts'  // URL de tu API
};

### 6. Ejecutar la Aplicación
Inicia la aplicación Angular con el siguiente comando:
ng serve

### 7. Abrir la Aplicación en el Navegador
Abre tu navegador web y navega a la siguiente URL:

http://localhost:4200
