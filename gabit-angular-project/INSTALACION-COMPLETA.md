# 🎯 GABIT - Sistema Completo Frontend + Backend

Proyecto completo de Gabit con Angular 16 y Node.js para la creación y gestión de hábitos gamificados.

---

## 📦 CONTENIDO DEL PROYECTO

### Frontend (Angular 16)
- ✅ Componente de creación de hábitos (4 pasos)
- ✅ Servicio HTTP para conectar con la API
- ✅ Formularios reactivos con validación
- ✅ Animaciones suaves
- ✅ Diseño responsive

### Backend (Node.js + Express)
- ✅ API REST completa
- ✅ Conexión a MySQL
- ✅ Endpoints para hábitos, categorías y públicos
- ✅ Manejo de transacciones

### Base de Datos (MySQL)
- ✅ 10 tablas relacionadas
- ✅ Datos de ejemplo
- ✅ Vistas y procedimientos almacenados

---

## 🚀 INSTALACIÓN PASO A PASO

### 1️⃣ BASE DE DATOS

#### Importar la base de datos:

```bash
mysql -u root -p < gabit-database.sql
```

O desde **phpMyAdmin**:
1. Importar → Seleccionar `gabit-database.sql`
2. Click en "Continuar"

#### Verificar:
```sql
USE gabit;
SHOW TABLES;
```

Deberías ver 10 tablas.

---

### 2️⃣ BACKEND NODE.JS

El backend ya está en tu contenedor Docker de Node.js. Solo necesitas:

#### A. Actualizar `routes/config/db.config.js`

Añade la configuración de Gabit:

```javascript
gabit: {
    host: "mysql-db",
    user: "root",
    password: "dejame",
    database: "gabit",
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000,
}
```

#### B. Copiar la carpeta `gabit` en `routes/`

Descomprime `gabit-routes.zip` y copia la carpeta completa en:
```
nodejs-app/routes/gabit/
```

#### C. Actualizar `server.js`

Añade estas líneas antes de `// INICIO SERVIDOR`:

```javascript
// ============================
// RUTAS GABIT
// ============================
// 🎯 Hábitos
const gabitHabitsRoutes = require("./routes/gabit/habits/mysql");
app.use("/gabit/habits", gabitHabitsRoutes);

// 📚 Categorías
const gabitCategoriesRoutes = require("./routes/gabit/categories/mysql");
app.use("/gabit/categories", gabitCategoriesRoutes);

// 🌍 Hábitos Públicos
const gabitPublicRoutes = require("./routes/gabit/public/mysql");
app.use("/gabit/public", gabitPublicRoutes);
```

Y actualiza la lista de endpoints:

```javascript
console.log("📁 Endpoints disponibles:");
console.log("  • /superheroDB");
console.log("  • /dbzDB/personajes");
console.log("  • /dbzDB/planetas");
console.log("  • /dbzDB/transformaciones");
console.log("  • /dbzDB/mispersonajes");
console.log("  • /accesoDB");
console.log("  • /gabit/habits");
console.log("  • /gabit/categories");
console.log("  • /gabit/public");
```

#### D. Reiniciar el contenedor Docker

```bash
docker restart nodejs-container
```

O si estás en desarrollo:
```bash
docker-compose restart nodejs
```

#### E. Verificar que funciona

Abre en el navegador:
```
http://localhost:3000/gabit/categories/leer
```

Deberías ver las 8 categorías en JSON.

---

### 3️⃣ FRONTEND ANGULAR

#### A. Instalar dependencias:

```bash
cd gabit-angular-project
npm install
```

#### B. Iniciar el servidor:

```bash
ng serve --port 4216
```

O si no tienes Angular CLI:
```bash
npm start
```

#### C. Abrir en el navegador:

```
http://localhost:4216
```

---

## 🧪 PROBAR QUE TODO FUNCIONA

### 1. Verificar que el backend está corriendo:
```bash
curl http://localhost:3000/gabit/categories/leer
```

Deberías ver:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Salud",
      "icono": "🏃",
      ...
    }
  ]
}
```

### 2. Crear un hábito desde Angular:

1. Ve a `http://localhost:4216`
2. Completa el formulario:
   - **Paso 1:** Nombre, descripción, categoría, color
   - **Paso 2:** Configura niveles (1-10)
   - **Paso 3:** Añade misiones para cada nivel
   - **Paso 4:** (Opcional) Añade logros
3. Click en "✓ Crear hábito"
4. Deberías ver un alert de éxito con el ID del hábito

### 3. Verificar en la base de datos:

```sql
USE gabit;
SELECT * FROM habitos ORDER BY id DESC LIMIT 1;
SELECT * FROM niveles WHERE habito_id = [ID_DEL_HABITO];
SELECT * FROM misiones WHERE nivel_id = [ID_DEL_NIVEL];
```

---

## 📡 ENDPOINTS DISPONIBLES

### Hábitos
```
POST   /gabit/habits/crear           - Crear hábito
GET    /gabit/habits/leer            - Obtener hábitos del usuario
GET    /gabit/habits/leer/:id        - Obtener hábito por ID
PUT    /gabit/habits/actualizar/:id  - Actualizar hábito
DELETE /gabit/habits/borrar/:id      - Eliminar hábito
```

### Categorías
```
GET    /gabit/categories/leer        - Obtener categorías
```

### Públicos
```
GET    /gabit/public/leer            - Obtener hábitos públicos
```

---

## 🔧 CONFIGURACIÓN

### Cambiar puerto de Angular:

En `package.json` de Angular, modifica:
```json
"start": "ng serve --port 4216"
```

### Cambiar URL del backend:

En `src/app/services/habit.service.ts`, modifica:
```typescript
private apiUrl = 'http://localhost:3000/gabit';
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### ❌ Error: Cannot connect to MySQL

**Solución:**
1. Verifica que MySQL está corriendo
2. Verifica las credenciales en `db.config.js`
3. Verifica que la base de datos `gabit` existe

### ❌ Error: CORS policy

**Solución:**
El backend ya tiene CORS habilitado. Si el problema persiste, añade en `server.js`:

```javascript
app.use(cors({
  origin: 'http://localhost:4216',
  credentials: true
}));
```

### ❌ Error 404 en /gabit/habits/crear

**Solución:**
1. Verifica que copiaste la carpeta `gabit` en `routes/`
2. Verifica que actualizaste `server.js`
3. Reinicia el servidor Node.js

### ❌ Categorías no se cargan

**Solución:**
1. Verifica que importaste `gabit-database.sql`
2. Verifica que hay datos en la tabla `categorias`:
```sql
SELECT * FROM gabit.categorias;
```

---

## 📊 ESTRUCTURA DE DATOS

### Crear un hábito (ejemplo JSON):

```json
{
  "name": "Leer 30 minutos al día",
  "description": "Desarrollar el hábito de lectura constante",
  "category": 4,
  "color": "#A855F7",
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
      "name": "Primera Semana",
      "description": "Has leído 7 días consecutivos",
      "icon": "🎯",
      "pointsReward": 50,
      "requirement": "Racha de 7 días"
    }
  ]
}
```

---

## 📝 PRÓXIMOS PASOS

- [ ] Implementar autenticación de usuarios
- [ ] Crear página de listado de hábitos
- [ ] Crear sistema de seguimiento de progreso
- [ ] Implementar sistema de logros
- [ ] Añadir gráficas de progreso
- [ ] Sistema de notificaciones

---

## 👤 AUTOR

**Carmen Castillo Gaitán**  
TFG 2DAW - IES Málaga  
Gabit - Sistema de gamificación de hábitos

---

## 📞 SOPORTE

Si tienes problemas:
1. Revisa los logs del backend Node.js
2. Revisa la consola del navegador (F12)
3. Verifica que todos los servicios están corriendo
4. Revisa las credenciales de MySQL

---

**¡Listo para crear hábitos! 🎉**
