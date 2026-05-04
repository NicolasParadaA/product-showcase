# Product Showcase

Una aplicación web moderna para mostrar productos con autenticación de usuarios y administración de productos. Desarrollada con Vue 3, Vuetify y Firebase.

## 🚀 Características

- ✅ **Autenticación de usuarios** con Firebase Auth
- ✅ **Roles de usuario** (admin y usuario normal)
- ✅ **CRUD de productos** (solo para administradores)
- ✅ **Filtrado de productos** por categoría y búsqueda
- ✅ **Diseño responsivo** con Vuetify
- ✅ **UI moderna** con componentes de Vuetify

## 🛠️ Tecnologías

### Frontend
- **Vue 3** - Framework JavaScript progresivo
- **Vite** - Herramienta de build rápida
- **Vuetify** - Framework UI para Vue 3
- **Vue Router** - Enrutamiento oficial de Vue
- **Pinia** - Manejo de estado para Vue

### Backend
- **Firebase Auth** - Autenticación de usuarios
- **Firebase Firestore** - Base de datos NoSQL

### Testing
- **Vitest** - Testing unitario
- **Cypress** - Testing end-to-end

### Otras herramientas
- **SweetAlert2** - Alertas bonitas
- **Google Fonts (Roboto)** - Tipografía

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/NicolasParada/product-showcase.git

# Ir al directorio del proyecto
cd product-showcase

# Instalar dependencias
npm install
```

## 🏃 Ejecutar el proyecto

```bash
# Modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar producción
npm run preview
```

## 🧪 Testing

```bash
# Testing unitario
npm run test:unit

# Testing end-to-end (desarrollo)
npm run test:e2e:dev

# Testing end-to-end (producción)
npm run build
npm run test:e2e
```

## 📁 Estructura del proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── layouts/        # Componentes de layout
│   ├── ProductCard.vue # Tarjeta de producto
│   └── ListProducts.vue # Lista de productos
├── views/              # Vistas de la aplicación
│   ├── HomeView.vue    # Página principal
│   ├── LoginView.vue   # Login
│   ├── RegisterView.vue # Registro
│   ├── ProductsView.vue # Lista de productos
│   └── admin/          # Vistas de administrador
│       └── ProductsCrudView.vue # CRUD de productos
├── stores/             # Stores de Pinia
│   ├── user.store.js   # Estado del usuario
│   └── products.store.js # Estado de productos
├── services/           # Servicios de Firebase
│   └── auth.js         # Servicios de autenticación
├── router/             # Configuración de rutas
│   └── index.js
├── App.vue             # Componente principal
└── main.js             # Entry point
```

## 🔐 Configuración de Firebase

El proyecto usa Firebase para autenticación y base de datos. Para configurar tu propio proyecto:

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita **Authentication** con Email/Password
3. Crea una base de datos **Firestore**
4. Copia tu configuración de Firebase en `src/firebaseConfig.js`

## 📝 Funcionalidades

### Autenticación
- Registro de usuarios con email y contraseña
- Login de usuarios
- Recuperación de contraseña
- Logout
- Roles de usuario (admin y usuario normal)

### Productos
- Listado de productos por categoría
- Filtrado por categoría
- Búsqueda de productos por nombre
- CRUD de productos (solo administradores)

### Categorías
- Cocina
- Hogar
- Jardín

## 🎨 Diseño

El proyecto usa **Vuetify** como framework UI, proporcionando:
- Componentes pre-estilizados
- Diseño responsivo
- Tema claro por defecto
- Iconos de Material Design

## 🚀 Deploy

El proyecto está desplegado en Firebase Hosting:

- **URL de producción**: https://product-showcase-5a774.web.app

Para hacer deploy a Firebase:

```bash
firebase deploy
```

## 📄 Licencia

Este proyecto es parte del bootcamp de desarrollo web frontend trainee.

## 👨‍💻 Autor

Desarrollado como parte del bootcamp de desarrollo web frontend trainee.

## 🤝 Contribuciones

Este es un proyecto educativo, pero las contribuciones son bienvenidas.

## 📞 Contacto

Para cualquier pregunta o sugerencia, abre un issue en el repositorio.
