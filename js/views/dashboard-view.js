import {mostrarBarraNavegacion} from "../helpers/navBar.js"

const cursos = [
  {
    nombre: "Matemáticas",
    profesor: "Prof. Juan Pérez",
    alumnos: ["Ana", "Luis", "Pedro","camilo","tomas","ximena"],
    modulos: ["Álgebra", "Geometría"]
  },
  {
    nombre: "Lengua y Literatura",
    profesor: "Prof. Marta Gómez",
    alumnos: ["Carlos", "Sofía"],
    modulos: ["Gramática", "Lectura"]
  }
];
export  function dashboardview(){
    return `
    ${mostrarBarraNavegacion()}
    <main>
      <section>
        <h2>Cursos activos</h2>
        <div class="cursos-list">
          ${cursos.map(curso => `
            <div class="curso-item">
              <h3>${curso.nombre}</h3>
              <p><strong>Profesor:</strong> ${curso.profesor}</p>
              <p><strong>Alumnos inscritos:</strong> ${curso.alumnos.length}</p>
              <ul>${curso.alumnos.map(alumno => `<li>${alumno}</li>`).join("")}</ul>
              <p><strong>Módulos:</strong></p>
              <ul>${curso.modulos.map(mod => `<li>${mod}</li>`).join("")}</ul>
            </div>
          `).join("")}
        </div>
      </section>
    </main>
  `;
}