
export function mostrarBarraNavegacion() {
    return  `
      <nav class="navbar-dashboard">
        <img src="../../Assets/Logo.png" alt="Logo" class="logo-navbar">
        <div class="navbar-links">
          <a href="#/alumnos">Alumnos</a>
          <a href="#/docentes">Docentes</a>
          <a href="#/cursos">Cursos</a>
          <a href="#/login">Cerrar sesión</a>
        </div>
      </nav>
    `;
};