import { mostrarBarraNavegacion } from "../helpers/navBar.js";
import { getCourseById, updateCourse } from "../helpers/courses-storage.js";

/**
 * Helper para leer teachers/students desde localStorage (para poblar selects)
 */
function readTeachersFromStorage() {
  const raw = localStorage.getItem("teachers") || localStorage.getItem("profesores");
  try { return raw ? JSON.parse(raw) : []; } catch (e) { return []; }
}
function readStudentsFromStorage() {
  const raw = localStorage.getItem("students") || localStorage.getItem("alumnos");
  try { return raw ? JSON.parse(raw) : []; } catch (e) { return []; }
}

/**
 * Extrae query param 'id' de location.hash (forma: #/courses/edit?id=...)
 */
function getQueryId() {
  const hash = location.hash || "";
  const qIndex = hash.indexOf("?");
  if (qIndex === -1) return null;
  const query = new URLSearchParams(hash.slice(qIndex + 1));
  return query.get("id");
}

/**
 * Vista (template) para editar un curso. El HTML se renderiza antes de poblar los campos.
 */
export function coursesEditView() {
  return `
    ${mostrarBarraNavegacion()}
    <main class="course-edit-main">
      <section class="course-edit-section">
        <h2>Editar curso</h2>

        <form id="course-edit-form" class="course-form" autocomplete="off">
          <input type="hidden" id="course-id" name="id" value="">

          <div>
            <label for="course-name">Nombre del curso</label><br>
            <input id="course-name" name="nombre" type="text" required placeholder="Ej: Matemáticas Avanzadas">
          </div>

          <div>
            <label for="course-teacher">Profesor (opcional)</label><br>
            <select id="course-teacher" name="teacher">
              <option value="">-- Sin profesor asignado --</option>
            </select>
          </div>

          <div>
            <label for="course-students">Alumnos (opcional, seleccionar varios con Ctrl/Cmd)</label><br>
            <select id="course-students" name="students" multiple size="6"></select>
          </div>

          <div>
            <label for="course-modules">Módulos (separados por coma)</label><br>
            <input id="course-modules" name="modules" type="text" placeholder="Ej: Álgebra, Geometría">
          </div>

          <div style="margin-top: 1rem;">
            <button type="submit" id="course-update">Guardar cambios</button>
            <button type="button" id="course-cancel">Cancelar</button>
          </div>

          <div id="course-message" role="status" style="margin-top:0.75rem; display:none;"></div>
        </form>
      </section>
    </main>
  `;
}

/**
 * Inicializa la lógica del formulario de edición (poblar select, cargar datos del curso, submit).
 * Debe llamarse DESPUÉS de renderizar la vista (desde renderView en app.js).
 */
export function initCoursesEditLogic() {
  const courseId = getQueryId();
  if (!courseId) {
    console.warn("No se proporcionó id en la query para editar curso.");
    return;
  }

  const course = getCourseById(courseId);
  if (!course) {
    alert("Curso no encontrado.");
    location.hash = "#/courses";
    return;
  }

  const form = document.getElementById("course-edit-form");
  const teacherSelect = document.getElementById("course-teacher");
  const studentsSelect = document.getElementById("course-students");
  const messageEl = document.getElementById("course-message");
  const cancelBtn = document.getElementById("course-cancel");
  const idInput = document.getElementById("course-id");

  if (!form) return;

  // Poblar selects
  const teachers = readTeachersFromStorage();
  teachers.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t.id || (t.nombre || t.name || "");
    opt.textContent = t.name || t.nombre || opt.value;
    teacherSelect.appendChild(opt);
  });

  const students = readStudentsFromStorage();
  students.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.id || (s.document || s.documento || s.name || s.nombre || "");
    opt.textContent = `${s.name || s.nombre || opt.value}${s.document ? " — " + s.document : ""}`;
    studentsSelect.appendChild(opt);
  });

  // Rellenar campos con los datos del curso
  idInput.value = course.id || "";
  document.getElementById("course-name").value = course.nombre || course.name || "";
  if (course.teacherId) teacherSelect.value = course.teacherId;
  // marcar alumnos seleccionados si existen studentIds
  if (Array.isArray(course.studentIds) && course.studentIds.length) {
    Array.from(studentsSelect.options).forEach(opt => {
      if (course.studentIds.includes(opt.value)) opt.selected = true;
    });
  } else if (Array.isArray(course.alumnos) && course.alumnos.length) {
    // si el curso almacenaba nombres como 'alumnos', marcar por nombre
    Array.from(studentsSelect.options).forEach(opt => {
      if (course.alumnos.includes(opt.textContent.split(" — ")[0])) opt.selected = true;
    });
  }
  // modules -> input as comma separated
  const modulesRaw = Array.isArray(course.modules) ? course.modules.join(", ") : (Array.isArray(course.modulos) ? course.modulos.join(", ") : "");
  document.getElementById("course-modules").value = modulesRaw;

  function showMessage(text, type = "info") {
    messageEl.style.display = "block";
    messageEl.textContent = text;
    messageEl.style.color = type === "error" ? "crimson" : (type === "success" ? "green" : "black");
  }

  cancelBtn?.addEventListener("click", () => {
    location.hash = "#/courses";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = (form.nombre.value || "").trim();
    const teacherId = form.teacher.value || null;
    const selectedStudentIds = Array.from(studentsSelect.selectedOptions).map(o => o.value).filter(Boolean);
    const modules = (form.modules.value || "").split(",").map(m => m.trim()).filter(Boolean);

    if (!nombre) {
      showMessage("El nombre del curso es obligatorio.", "error");
      return;
    }

    try {
      const updated = updateCourse(courseId, {
        nombre,
        teacherId: teacherId || null,
        studentIds: selectedStudentIds,
        modules
      });
      showMessage("Curso actualizado correctamente.", "success");
      setTimeout(() => {
        location.hash = "#/courses";
      }, 600);
    } catch (err) {
      console.error("Error actualizando curso:", err);
      showMessage("No se pudo actualizar el curso.", "error");
    }
  });
}