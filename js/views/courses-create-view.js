import { mostrarBarraNavegacion } from "../helpers/navBar.js";
import { addCourse } from "../helpers/courses-storage.js";

/**
 * Helpers locales para leer teachers/students desde localStorage (soporta claves en inglés/español)
 */
function readTeachersFromStorage() {
  const raw = localStorage.getItem("teachers") || localStorage.getItem("profesores");
  try {
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Error parseando teachers/profesores:", e);
    return [];
  }
}

function readStudentsFromStorage() {
  const raw = localStorage.getItem("students") || localStorage.getItem("alumnos");
  try {
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Error parseando students/alumnos:", e);
    return [];
  }
}

/**
 * Vista (template) para crear un curso
 */
export function coursesCreateView() {
  return `
    ${mostrarBarraNavegacion()}
    <main class="course-create-main">
      <section class="course-create-section">
        <h2>Crear curso</h2>

        <form id="course-form" class="course-form" autocomplete="off">
          <div>
            <label for="course-name">Nombre del curso</label><br>
            <input id="course-name" name="nombre" type="text" required placeholder="Ej: Matemáticas Avanzadas">
          </div>

          <div>
            <label for="course-teacher">Profesor (opcional)</label><br>
            <select id="course-teacher" name="teacher">
              <option value="">-- Sin profesor asignado --</option>
              <!-- opciones pobladas dinámicamente -->
            </select>
          </div>

          <div>
            <label for="course-students">Alumnos (opcional, seleccionar varios con Ctrl/Cmd)</label><br>
            <select id="course-students" name="students" multiple size="6">
              <!-- opciones pobladas dinámicamente -->
            </select>
          </div>

          <div>
            <label for="course-modules">Módulos (separados por coma)</label><br>
            <input id="course-modules" name="modules" type="text" placeholder="Ej: Álgebra, Geometría">
          </div>

          <div style="margin-top: 1rem;">
            <button type="submit" id="course-submit">Crear curso</button>
            <button type="button" id="course-cancel">Cancelar</button>
          </div>

          <div id="course-message" role="status" style="margin-top:0.75rem; display:none;"></div>
        </form>
      </section>
    </main>
  `;
}

/**
 * Inicializa la lógica del formulario de creación de curso.
 * Debe llamarse DESPUÉS de renderizar la vista (p. ej. desde renderView en app.js).
 */
export function initCoursesCreateLogic() {
  const form = document.getElementById("course-form");
  if (!form) return;

  const teacherSelect = document.getElementById("course-teacher");
  const studentsSelect = document.getElementById("course-students");
  const messageEl = document.getElementById("course-message");
  const cancelBtn = document.getElementById("course-cancel");

  // Poblar selects con datos desde localStorage
  const teachers = readTeachersFromStorage();
  teachers.forEach(t => {
    const id = t.id || (t.nombre ? t.nombre : t.name || "");
    const name = t.name || t.nombre || id;
    const opt = document.createElement("option");
    opt.value = t.id || id;
    opt.textContent = name;
    teacherSelect.appendChild(opt);
  });

  const students = readStudentsFromStorage();
  students.forEach(s => {
    const id = s.id || (s.document || s.documento || s.name || s.nombre || "");
    const name = s.name || s.nombre || id;
    const opt = document.createElement("option");
    opt.value = s.id || id;
    opt.textContent = `${name}${s.document ? " — " + s.document : ""}`;
    studentsSelect.appendChild(opt);
  });

  function showMessage(text, type = "info") {
    messageEl.style.display = "block";
    messageEl.textContent = text;
    messageEl.style.color = type === "error" ? "crimson" : (type === "success" ? "green" : "black");
  }

  cancelBtn?.addEventListener("click", () => {
    // Redirige a la lista de cursos
    location.hash = "#/courses";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = (form.nombre.value || "").trim();
    const teacherId = form.teacher.value || null;
    // students select: recoger valores seleccionados
    const selectedStudentIds = Array.from(studentsSelect.selectedOptions).map(o => o.value).filter(Boolean);
    // modules: parsear por coma y limpiar
    const modulesRaw = (form.modules.value || "").trim();
    const modules = modulesRaw ? modulesRaw.split(",").map(m => m.trim()).filter(Boolean) : [];

    // Validaciones
    if (!nombre) {
      showMessage("El nombre del curso es obligatorio.", "error");
      return;
    }

    // Preparar objeto curso
    const courseData = {
      nombre,
      teacherId: teacherId || null,
      studentIds: selectedStudentIds,
      modules
    };

    try {
      const newCourse = addCourse(courseData);
      showMessage(`Curso creado: ${newCourse.nombre} (id: ${newCourse.id})`, "success");
      form.reset();
      // Espera breve y redirige a la lista de cursos
      setTimeout(() => {
        location.hash = "#/courses";
      }, 700);
    } catch (err) {
      console.error("Error creando curso:", err);
      showMessage(`No se pudo crear el curso: ${err.message || err}`, "error");
    }
  });
}