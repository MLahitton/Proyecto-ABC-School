# 🎓 ABC School LMS – Sistema de Gestión Educativa

Un sistema de gestión de aprendizaje (LMS) moderno y completo desarrollado como Single Page Application (SPA) en JavaScript vanilla. Permite administrar cursos, estudiantes, docentes y personal administrativo de manera eficiente e intuitiva.
Link de acceso: abcschoolml.netlify.app
---

## ✨ Características principales

- **🏠 Página de inicio pública** con presentación institucional y catálogo de cursos
- **👨‍🎓 Gestión completa de estudiantes** (crear, listar, buscar y eliminar)
- **👨‍🏫 Administración de docentes** con perfiles detallados y especialidades
- **📚 Sistema de cursos** con módulos, asignación de profesores y alumnos
- **🔐 Autenticación segura** para administradores
- **🎨 Interfaz responsiva** con diseño profesional en tonos azules
- **🔍 Búsqueda en tiempo real** de estudiantes y cursos
- **📊 Dashboard administrativo** con vista general de cursos activos
- **🧩 Web Components** personalizados para mejor reutilización
- **💾 Persistencia con LocalStorage** sin necesidad de backend

---

## 🚀 Instalación

### Prerrequisitos

- Navegador web moderno (Chrome, Firefox, Edge o Safari)
- Servidor web local (opcional pero recomendado)


### Credenciales de acceso

Para acceder al panel administrativo(Al iniciar, cuando no se cuenta con ningun administrativo registrado, a partir de ahi se permite el uso del correo y password que asigna el admin principal):
- **Usuario:** `admin`
- **Contraseña:** `1234`

---

## 📖 Uso

### Navegación pública

- **`#/home`** - Página de inicio con historia institucional
- **`#/home-courses`** - Catálogo público de cursos disponibles
- **`#/home-trainers`** - Directorio de docentes
- **`#/contact`** - Formulario de contacto
- **`#/login`** - Acceso al panel administrativo

### Panel administrativo (requiere login)

- **`#/dashboard`** - Vista general de cursos activos
- **`#/students`** - Gestión de estudiantes
- **`#/courses`** - Administración de cursos
- **`#/trainers`** - Gestión de docentes
- **`#/admins`** - Control de usuarios administrativos

### Ejemplo: Crear un nuevo curso

1. Inicia sesión como administrador
2. Navega a `#/courses`
3. Haz clic en **"Crear curso"**
4. Completa el formulario:
   ```
   Nombre: Matemáticas Avanzadas
   Profesor: Selecciona de la lista
   Alumnos: Ctrl+Click para seleccionar múltiples
   Módulos: Álgebra, Geometría, Cálculo (separados por coma)
   ```
5. Haz clic en **"Crear curso"**

---

## 📁 Estructura del proyecto

```
Proyecto JavaScript/
│
├── index.html              # Punto de entrada de la aplicación
├── README.md               # Este archivo
│
├── assets/                 # Recursos multimedia
│   ├── Logo.png
│   └── banner.jpg
│
├── CSS/                    # Estilos
│   ├── cursos.css         # Sistema de diseño principal
│   └── home.css           # Estilos de la página home
│
├── js/                     # Lógica de la aplicación
│   ├── app.js             # Router y orquestador principal
│   ├── main.js            # Punto de entrada JS
│   │
│   ├── components/        # Web Components
│   │   ├── admin-card.js
│   │   ├── course-card.js
│   │   ├── dashboard-course-card.js
│   │   ├── home-course-card.js
│   │   ├── home-trainer-card.js
│   │   └── trainer-card.js
│   │
│   ├── helpers/           # Funciones auxiliares y gestión de datos
│   │   ├── admin-storage.js
│   │   ├── courses-storage.js
│   │   ├── cursos.js
│   │   ├── navBar.js
│   │   ├── storage.js
│   │   ├── students-storage.js
│   │   └── trainer-storage.js
│   │
│   └── views/             # Vistas de la SPA
│       ├── admin-view.js
│       ├── contact-view.js
│       ├── courses-create-view.js
│       ├── courses-edit-view.js
│       ├── courses-view.js
│       ├── dashboard-view.js
│       ├── home-courses-view.js
│       ├── home-trainer-view.js
│       ├── home-view.js
│       ├── login-view.js
│       ├── students-create-view.js
│       ├── students-view.js
│       └── trainer-view.js
│
└── previews/              # Prototipos HTML
    └── home.html
```

---

## 🛠️ Tecnologías utilizadas

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos con variables CSS, Flexbox y Grid
- **JavaScript ES6+** - Lógica de la aplicación
  - Módulos ES6 (import/export)
  - Web Components (Custom Elements + Shadow DOM)
  - Template literals
  - Arrow functions
  - Async/Await

### Persistencia
- **LocalStorage** - Almacenamiento de datos del lado del cliente

### Arquitectura
- **SPA (Single Page Application)** - Navegación basada en hash routing
- **Component-Based Design** - Web Components reutilizables
- **Separation of Concerns** - Helpers, Views y Components separados

---

## 💾 Modelo de datos

### Curso
```javascript
{
  id: "c_matematicas-avanzadas",
  nombre: "Matemáticas Avanzadas",
  teacherId: "T12345",
  studentIds: ["S001", "S002"],
  modules: ["Álgebra", "Geometría", "Cálculo"],
  createdAt: "2025-11-07T12:00:00.000Z"
}
```

### Estudiante
```javascript
{
  id: "A12345678",
  name: "Ana García",
  document: "12345678",
  dob: "2005-03-15",
  createdAt: "2025-11-07T12:00:00.000Z"
}
```

### Docente
```javascript
{
  id: "M98765",
  nombre: "María López",
  documento: "98765432",
  email: "maria.lopez@abc.edu",
  telefono: "+57 300 1234567",
  especialidad: "Matemáticas",
  bio: "Docente con 10 años de experiencia"
}
```

---

## 👨‍💻 Autores

- **Manuel Lahitton** - Desarrollador principal
- **Edwin Salas** - Trainer

---



## 📞 Contacto

Para preguntas, sugerencias o reportar problemas:

- **Email:** mlahitton16@gmail.com
- **GitHub Issues:** [https://github.com/MLahitton/Proyecto-ABC-School/issues](https://github.com/MLahitton/Proyecto-ABC-School/issues)

---


**⚠️ Nota importante:** Este proyecto utiliza LocalStorage para persistencia de datos. Para un entorno de producción real, se recomienda implementar un backend con base de datos y medidas de seguridad apropiadas.

---

Desarrollado con ❤️ por Manuel Lahitton
