export function homeView() {
  // Datos simulados
  const profesores = [
    { nombre: "María López", especialidad: "Matemáticas" },
    { nombre: "Juan Pérez", especialidad: "Ciencias" },
    { nombre: "Sofía García", especialidad: "Historia" }
  ];
  const cursos = [
    { nombre: "Álgebra Básica", docente: "María López" },
    { nombre: "Química 101", docente: "Juan Pérez" },
    { nombre: "Historia Antigua", docente: "Sofía García" }
  ];

  return `
    <nav>
      <img src="assets/Logo.png" class="logo">
      <div class="menu">
        <a href="#">Poner los href</a>
        <a href="#">Courses</a>
        <a href="#">Trainers</a>
        <a href="#">Contact</a>
      </div>
      <div class="login">
        <a href="#/login">Login </a>
      </div>
    </nav>
    <div class="banner">
      <div class="text-banner">
        <h3>Nuestra historia</h3>
        <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
        <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
        <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
      </div>        
    </div>
    <section class="listados-home">
      <h2>Profesores</h2>
      <div class="grid-profesores">
        ${profesores.map(p => `
          <div class="card-profesor">
            <strong>${p.nombre}</strong>
            <p>${p.especialidad}</p>
          </div>
        `).join("")}
      </div>
      <h2>Cursos</h2>
      <div class="grid-cursos">
        ${cursos.map(c => `
          <div class="card-curso">
            <strong>${c.nombre}</strong>
            <p>Docente: ${c.docente}</p>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}