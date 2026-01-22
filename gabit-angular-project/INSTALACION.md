# 🚀 GUÍA DE INSTALACIÓN PASO A PASO

## ¿Primera vez con Angular? ¡No te preocupes!

Sigue estos pasos exactamente y tendrás el proyecto funcionando en minutos.

---

## Paso 1: Instalar Node.js

Si no tienes Node.js instalado:

1. Ve a https://nodejs.org/
2. Descarga la versión LTS (recomendada)
3. Instala siguiendo el asistente
4. Verifica la instalación abriendo una terminal y escribiendo:

```bash
node --version
npm --version
```

Deberías ver algo como:
```
v18.18.0
9.8.1
```

---

## Paso 2: Descomprimir el proyecto

1. Descomprime el archivo ZIP
2. Abre una terminal en la carpeta del proyecto

En **Windows**: 
- Shift + clic derecho en la carpeta → "Abrir ventana de PowerShell aquí"

En **Mac/Linux**:
- Clic derecho → "Abrir en Terminal"

O usa el comando `cd`:
```bash
cd ruta/a/gabit-angular-project
```

---

## Paso 3: Instalar dependencias

En la terminal, escribe:

```bash
npm install
```

⏳ Esto tardará 2-5 minutos. Es normal. Está descargando todas las librerías necesarias.

Verás muchas líneas de texto. Espera hasta que vuelva a aparecer el cursor.

---

## Paso 4: Iniciar el proyecto

Cuando termine la instalación, ejecuta:

```bash
npm start
```

O también puedes usar:

```bash
ng serve
```

Verás algo como:

```
✔ Browser application bundle generation complete.

Initial Chunk Files   | Names         |  Raw Size
polyfills.js          | polyfills     |  90.20 kB | 
main.js               | main          |  50.00 kB |
styles.css            | styles        |   5.00 kB |

** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **
```

---

## Paso 5: Abrir en el navegador

1. Abre tu navegador (Chrome, Firefox, Edge, Safari)
2. Ve a: `http://localhost:4200`

¡Listo! Deberías ver el formulario de creación de hábitos de Gabit 🎉

---

## ❓ Problemas Comunes

### El puerto 4200 ya está en uso

Si ves un error de que el puerto está ocupado:

```bash
ng serve --port 4201
```

Luego abre: `http://localhost:4201`

### Error: 'ng' no se reconoce como comando

Instala Angular CLI globalmente:

```bash
npm install -g @angular/cli
```

### Error al instalar dependencias

Borra todo e intenta de nuevo:

```bash
rm -rf node_modules package-lock.json
npm install
```

En Windows PowerShell:
```powershell
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

### Errores de permisos (Mac/Linux)

Usa `sudo`:

```bash
sudo npm install
```

---

## 🎯 ¿Cómo usar el formulario?

1. **Paso 1:** Completa la información básica
   - Nombre del hábito
   - Descripción
   - Selecciona categoría
   - Elige un color
   - Marca si será público

2. **Paso 2:** Configura niveles
   - Usa el slider para elegir cuántos niveles
   - Modifica nombres y puntos si quieres

3. **Paso 3:** Añade misiones
   - Haz clic en "+ Añadir misión"
   - Completa los campos
   - Repite para cada nivel

4. **Paso 4:** Logros (opcional)
   - Añade logros especiales
   - Define recompensas

5. **Crear:** Haz clic en "✓ Crear hábito"
   - Los datos se mostrarán en la consola del navegador
   - Presiona F12 para ver la consola

---

## 📝 Modificar el código

Los archivos principales están en:

```
src/app/components/habit-creation/
├── habit-creation.component.ts    ← Lógica del componente
├── habit-creation.component.html  ← Estructura HTML
└── habit-creation.component.scss  ← Estilos CSS
```

Cada vez que guardes cambios, el navegador se recargará automáticamente.

---

## 🛑 Detener el servidor

En la terminal, presiona:

```
Ctrl + C
```

Luego confirma con `Y` o `S` según tu sistema.

---

## 🎓 Siguientes pasos

1. **Conectar con backend:**
   - Modifica el método `onSubmit()` en `habit-creation.component.ts`
   - Añade tu URL de API
   - Implementa las peticiones HTTP

2. **Añadir más páginas:**
   - Crea nuevos componentes
   - Añádelos al routing en `app-routing.module.ts`

3. **Desplegar:**
   - Ejecuta `npm run build`
   - Sube la carpeta `dist/` a tu servidor

---

## 📞 ¿Necesitas ayuda?

- **Documentación Angular:** https://angular.io/docs
- **Tutorial Angular:** https://angular.io/tutorial
- **Stack Overflow:** Busca tu error en Google + "angular"

---

**¡Feliz desarrollo! 🚀**

Cualquier duda, revisa el README.md principal o la documentación de Angular.
