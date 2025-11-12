
export function mostrarBarraNavegacion() {
    return  `
      <nav class="navbar-dashboard">
        <a href="#/home" class="home">home<a>
        <div class="navbar-links">
          <a href="#/dashboard">Informacion general</a>
          <a href="#/students">Alumnos</a>
          <a href="#/trainers">Docentes</a>
          <a href="#/cursos">Cursos</a>
          <a href="#/administrativos">Administrativos</a>
          <a href="#/login">Cerrar sesión</a>
        </div>
      </nav>
    `;
};