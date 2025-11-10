import { mostrarBarraNavegacion } from "../helpers/navBar.js";
import { removeCourse } from "../helpers/courses-storage.js";


function readCoursesRaw() {
  const raw = localStorage.getItem("courses") || localStorage.getItem("cursos");
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn("Error parseando 'courses'/'cursos' desde localStorage:", e);
    return [];
  }
}


function readTeachersRaw() {
  const raw = localStorage.getItem("teachers") || localStorage.getItem("profesores");
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn("Error parseando 'teachers'/'profesores' desde localStorage:", e);
    return [];
  }
}


function getCoursesFromStorage() {
  const rawCourses = readCoursesRaw();
  const teachers = readTeachersRaw();

  const teacherIdToName = {};
  teachers.forEach(t => {
    if (t && t.id) teacherIdToName[t.id] = t.name || t.nombre || String(t.id);
  });

  return rawCourses.map(c => {
    const id = c.id || (c.nombre ? c.nombre.trim().replace(/\s+/g, "_").toLowerCase() : null);
    const nombre = c.nombre || c.name || "Curso sin nombre";
    let teacherName = null;
    if (c.teacherName || c.profesor) {
      teacherName = c.teacherName || c.profesor;
    } else if (c.teacherId) {
      teacherName = teacherIdToName[c.teacherId] || c.teacherId;
    }

    const studentIds = Array.isArray(c.studentIds) ? c.studentIds.slice() : [];
    const studentsArr = Array.isArray(c.students) ? c.students.slice() : (Array.isArray(c.alumnos) ? c.alumnos.slice() : []);
    const studentCount = studentIds.length || studentsArr.length || 0;

    const modules = Array.isArray(c.modules) ? c.modules.slice() : (Array.isArray(c.modulos) ? c.modulos.slice() : []);

    return {
      id,
      nombre,
      teacherName,
      studentCount,
      studentIds,
      studentsPreview: studentsArr.slice(0, 5),
      modules
    };
  });
}


export function coursesView() {
  const courses = getCoursesFromStorage();

  return `
    ${mostrarBarraNavegacion()}
    <main class="courses-main">
      <section class="courses-header">
        <h2>Cursos</h2>
        <input id="courses-search" type="search" placeholder="Buscar curso..." aria-label="Buscar curso">
        <a href="#/courses/new" class="courses-create-link">Crear curso</a>
      </section>

      <section class="courses-list">
        ${courses.length === 0 ? `<p class="no-courses">No hay cursos registrados.</p>` : courses.map((course, index) => `
          <article class="course-item" data-index="${index}" data-id="${course.id || ""}">
            <h3 class="course-name">${course.nombre}</h3>
            ${course.teacherName ? `<p class="course-teacher"><strong>Profesor:</strong> ${course.teacherName}</p>` : ''}
            <p class="course-students"><strong>Alumnos inscritos:</strong> ${course.studentCount}</p>
            ${course.studentsPreview && course.studentsPreview.length ? `<p class="course-students-preview"><strong>Ejemplos:</strong> ${course.studentsPreview.join(', ')}</p>` : ''}
            ${course.modules && course.modules.length ? `<p class="course-modules"><strong>Módulos:</strong> ${course.modules.join(', ')}</p>` : ''}
            <div class="course-actions" style="margin-top:0.5rem;">
              <a href="#/courses/edit?id=${encodeURIComponent(course.id || "")}" class="btn btn-edit" data-id="${course.id || ""}">Editar</a>
              <button class="btn btn-delete" data-id="${course.id || ""}">Eliminar</button>
            </div>
          </article>
        `).join('')}
      </section>
    </main>
  `;
}


export function initCoursesListLogic() {
  document.querySelectorAll(".btn-delete").forEach(btn => {
    btn.removeEventListener && btn.removeEventListener("click", () => {});
    btn.addEventListener("click", (e) => {
      const id = btn.getAttribute("data-id");
      if (!id) return;
      const confirmed = confirm("¿Estás seguro que deseas eliminar este curso?");
      if (!confirmed) return;
      try {
        const ok = removeCourse(id);
        if (ok) {
          window.dispatchEvent(new Event("hashchange"));
        } else {
          alert("No se encontró el curso para eliminar.");
        }
      } catch (err) {
        console.error("Error eliminando curso:", err);
        alert("Ocurrió un error al eliminar el curso.");
      }
    });
  });

}