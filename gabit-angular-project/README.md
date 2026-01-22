# Gabit - Componente de Creación de Hábitos

Proyecto Angular 16 completo con el componente de creación de hábitos personalizados para Gabit.

## 🚀 Inicio Rápido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Ejecutar el proyecto

```bash
npm start
```

o 

```bash
ng serve
```

El proyecto se abrirá automáticamente en `http://localhost:4200`

### 3. Ver el componente

Una vez iniciado el servidor, abre tu navegador en `http://localhost:4200` y verás directamente el formulario de creación de hábitos.

## 📦 Requisitos

- Node.js 18+ 
- npm 9+
- Angular CLI 16 (opcional, ya está en devDependencies)

## 🎨 Características

✅ **Formulario en 4 pasos:**
1. Información básica del hábito
2. Configuración de niveles (1-10)
3. Creación de misiones por nivel
4. Logros especiales (opcional)

✅ **Validación completa** con formularios reactivos  
✅ **Animaciones suaves** entre pasos  
✅ **Indicador de progreso** visual  
✅ **Selector de colores** personalizado  
✅ **Grid de categorías** con iconos  
✅ **Diseño 100% responsive**  
✅ **Sigue la guía de estilos de Gabit**

## 📁 Estructura del Proyecto

```
gabit-angular-project/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── habit-creation/
│   │   │       ├── habit-creation.component.ts
│   │   │       ├── habit-creation.component.html
│   │   │       └── habit-creation.component.scss
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   └── app-routing.module.ts
│   ├── assets/
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

## 🎯 Uso del Formulario

1. **Paso 1 - Información básica:**
   - Completa nombre y descripción del hábito
   - Selecciona una categoría
   - Elige un color
   - Marca si será público

2. **Paso 2 - Niveles:**
   - Usa el slider para elegir cuántos niveles (1-10)
   - Define nombre y puntos para cada nivel

3. **Paso 3 - Misiones:**
   - Añade misiones para cada nivel
   - Define descripción, puntos, tipo y requisitos

4. **Paso 4 - Logros:**
   - Añade logros especiales (opcional)
   - Define nombre, descripción, icono y recompensa

5. **Crear:** Haz clic en "Crear hábito" y revisa la consola del navegador para ver los datos generados

## 🔧 Personalización

### Modificar categorías

Edita el array en `src/app/components/habit-creation/habit-creation.component.ts`:

```typescript
categories: Category[] = [
  { id: 'tu-categoria', name: 'Tu Categoría', icon: '🎯' },
  // ... más categorías
];
```

### Modificar colores disponibles

```typescript
availableColors = [
  '#TuColor1', '#TuColor2', // ... más colores
];
```

### Conectar con backend

Modifica el método `onSubmit()` en el componente para enviar los datos a tu API:

```typescript
onSubmit(): void {
  if (this.habitForm.valid) {
    const habitData = this.prepareHabitData();
    
    // Aquí puedes hacer tu petición HTTP
    this.http.post('tu-api-url/habits', habitData).subscribe({
      next: (response) => {
        console.log('Hábito creado:', response);
        // Redirigir o mostrar mensaje de éxito
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }
}
```

## 🎨 Guía de Estilos Gabit

El proyecto utiliza la paleta de colores oficial de Gabit:

- **Primary:** `#05576B` (Midnight green)
- **Primary Dark:** `#0E3B47`
- **Primary Light:** `#3C9CB4`
- **Neutros:** `#F0F6F6`, `#D4E6F2`
- **Acentos:** 
  - Rojo: `#9B1426`
  - Verde: `#056B3B`
  - Amarillo: `#F2D639`
  - Naranja: `#FA914F`

**Tipografías:**
- Títulos: Fraunces (serif)
- Cuerpo: Epilogue (sans-serif)

## 📱 Responsive

El componente es completamente responsive:
- ✅ Desktop (>768px)
- ✅ Tablet (768px - 480px)
- ✅ Mobile (<480px)

## 🛠 Scripts Disponibles

```bash
npm start       # Inicia el servidor de desarrollo
npm run build   # Compila el proyecto para producción
npm run watch   # Compila y observa cambios
```

## 🐛 Solución de Problemas

### Error: Cannot find module '@angular/...'
```bash
rm -rf node_modules package-lock.json
npm install
```

### El puerto 4200 ya está en uso
```bash
ng serve --port 4201
```

### Los estilos no se cargan
Verifica que las fuentes Fraunces y Epilogue estén cargando en `src/index.html`

## 📄 Estructura de Datos

El formulario genera esta estructura JSON:

```json
{
  "name": "Leer 30 minutos",
  "description": "...",
  "category": "lectura",
  "color": "#3B82F6",
  "isPublic": false,
  "levels": [
    {
      "name": "Principiante",
      "pointsRequired": 100,
      "missions": [
        {
          "description": "Leer 10 páginas",
          "points": 10,
          "type": "diaria",
          "requirement": 1
        }
      ]
    }
  ],
  "achievements": [
    {
      "name": "Racha de 30 días",
      "description": "...",
      "icon": "🏆",
      "pointsReward": 50,
      "requirement": "30 días consecutivos"
    }
  ]
}
```

## 👥 Autor

**Carmen Castillo Gaitán**  
Proyecto: Gabit - TFG 2DAW  
IES Málaga - 2025

## 📞 Soporte

Si tienes problemas:
1. Verifica que Node.js esté actualizado: `node --version`
2. Borra node_modules y reinstala: `rm -rf node_modules && npm install`
3. Revisa la consola del navegador para errores

---

**¡Listo para crear hábitos! 🎉**
