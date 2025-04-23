# 💳 Sistema Login Retiro

Este es un sistema básico de autenticación y retiro de dinero, hecho con Node.js, Express y MySQL. Ideal como base para proyectos bancarios o académicos donde se necesite un login seguro y operaciones básicas.

---

## 📚 Descripción

El sistema permite:

- Registro e inicio de sesión de usuarios.
- Validación de credenciales con sesiones.
- Simulación de un retiro de dinero.
- Visualización de errores con `SweetAlert2`.
- Almacenamiento de usuarios y saldos en una base de datos MySQL.

---

## ⚙️ Tecnologías y Dependencias

| Herramienta       | Versión recomendada | Descripción                        |
|-------------------|---------------------|------------------------------------|
| Node.js           | ^18.x               | Entorno de ejecución de JavaScript |
| Express           | ^4.x                | Framework para backend en Node     |
| EJS               | ^3.x                | Motor de plantillas HTML           |
| MySQL             | ^8.x                | Base de datos relacional           |
| SweetAlert2       | CDN                 | Para alertas interactivas          |
| Express-session   | ^1.x                | Manejo de sesiones en Express      |
| Body-parser       | ^1.x                | Parsear datos del formulario       |
| dotenv            | ^16.x               | Manejo de variables de entorno     |

Instalación:
```bash
npm install express ejs mysql express-session body-parser dotenv
