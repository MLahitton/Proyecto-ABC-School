import { crearCurso } from "../helpers/cursos.js";

export function crearCursoView() {
  setTimeout(() => {
    const form = document.getElementById("crear-curso-form");
    if (!form) return;
    form.addEventListener("submit", e => {
      e.preventDefault();
      const data = {
        codigo: form.codigo.value.trim(),
        nombre: form.nombre.value.trim(),
        descripcion: form.descripcion.value.trim(),
        docente: form.docente.value.trim(),
      };
      const nuevo = crearCurso(data);
      alert("Curso creado: " + nuevo.nombre);
      form.reset();
    });
  }, 0);

  return `
    <h2>Crear nuevo curso</h2>
    <form id="crear-curso-form" autocomplete="off">
      <div>
        <label>Código:</label>
        <input name="codigo" required>
      </div>
      <div>
        <label>Nombre:</label>
        <input name="nombre" required>
      </div>
      <div>
        <label>Descripción:</label>
        <textarea name="descripcion"></textarea>
      </div>
      <div>
        <label>Docente:</label>
        <input name="docente" required>
      </div>
      <button type="submit">Crear</button>
    </form>
  `;
}