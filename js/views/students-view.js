import { mostrarBarraNavegacion } from "../helpers/navBar.js";
import { removeStudent } from "../helpers/students-storage.js";

function getStudentsFromStorage() {
  const rawStudents = localStorage.getItem("students") || localStorage.getItem("alumnos");
  if (rawStudents) {
    try {
      const parsed = JSON.parse(rawStudents);
      if (Array.isArray(parsed)) {
        const rawCourses = localStorage.getItem("courses") || localStorage.getItem("cursos");
        const courses = rawCourses ? (JSON.parse(rawCourses) || []) : [];

        const courseIdToName = {};
        if (Array.isArray(courses)) {
          courses.forEach(c => {
            if (c.id) courseIdToName[c.id] = c.nombre || c.name || "Curso desconocido";
          });
        }

        return parsed.map(s => {
          const name = s.name || "";
          let cursos = [];
          if (Array.isArray(s.cursos) && s.cursos.length) {
            cursos = s.cursos.slice();
          } else if (Array.isArray(s.courseNames) && s.courseNames.length) {
            cursos = s.courseNames.slice();
          } else if (Array.isArray(s.courseIds) && s.courseIds.length) {
            cursos = s.courseIds.map(id => courseIdToName[id] || id);
          }
          return {
            id: s.id || null,
            name,
            document: s.document || s.documento || null,
            dob: s.dob || s.fechaNacimiento || null,
            cursos
          };
        });
      }
    } catch (e) {
      console.warn("Error parseando 'students' desde localStorage:", e);
    }
  }

  const raw = localStorage.getItem("cursos") || localStorage.getItem("courses");
  if (raw) {
    try {
      const cursosArr = JSON.parse(raw);
      const studentsMap = {};

      if (Array.isArray(cursosArr)) {
        cursosArr.forEach(c => {
          const nombreCurso = c.nombre || c.name || "Curso desconocido";
          const alumnosArr = Array.isArray(c.alumnos) ? c.alumnos : (Array.isArray(c.students) ? c.students : []);
          alumnosArr.forEach(a => {
            const nombreAlumno = (typeof a === "string") ? a : (a.nombre || a.name || JSON.stringify(a));
            if (!studentsMap[nombreAlumno]) {
              studentsMap[nombreAlumno] = { id: null, name: nombreAlumno, document: null, dob: null, cursos: [] };
            }
            studentsMap[nombreAlumno].cursos.push(nombreCurso);
          });
        });
      }
      return Object.values(studentsMap);
    } catch (e) {
      console.warn("Error parseando 'cursos' desde localStorage:", e);
    }
  }

  return [];
}

function _escapeHtml(str) {
  if (!str && str !== 0) return "";
  return String(str).replace(/[&<>"']/g, (m) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
}

export function studentsView() {
  const students = getStudentsFromStorage();

  return `
    ${mostrarBarraNavegacion()}
    <main class="students-main">
      <section class="students-header">
        <h2>Alumnos</h2>
        <input id="students-search" type="search" placeholder="Buscar alumno..." aria-label="Buscar alumno">
        <a href="#/students/new" class="students-create-link">Crear alumno</a>
      </section>

      <section class="students-list">
        ${students.length === 0 ? `<p class="no-students">No hay alumnos registrados.</p>` : students.map((student, index) => `
          <article class="student-item" data-index="${index}" data-id="${student.id || ""}" data-name="${_escapeHtml(student.name || "")}">
            <h3 class="student-name">${_escapeHtml(student.name)}</h3>
            ${student.document ? `<p class="student-document"><strong>Documento:</strong> ${_escapeHtml(student.document)}</p>` : ''}
            ${student.dob ? `<p class="student-dob"><strong>Fecha Nac.:</strong> ${_escapeHtml(student.dob)}</p>` : ''}
            <p class="student-courses"><strong>Cursos:</strong> ${student.cursos && student.cursos.length ? _escapeHtml(student.cursos.join(', ')) : '—'}</p>
            <div class="item-actions" style="margin-top:0.5rem;">
              <button class="btn btn-delete-student" data-id="${_escapeHtml(student.id || "")}" data-name="${_escapeHtml(student.name || "")}">Eliminar</button>
            </div>
          </article>
        `).join('')}
      </section>
    </main>
  `;
}

export function initStudentsListLogic() {
  document.querySelectorAll(".btn-delete-student").forEach(btn => {
    btn.removeEventListener && btn.removeEventListener("click", () => {});
    btn.addEventListener("click", (e) => {
      const id = btn.getAttribute("data-id");
      const name = btn.getAttribute("data-name");
      const identifier = id && id.trim() ? id.trim() : (name && name.trim() ? name.trim() : null);
      if (!identifier) return;
      const confirmed = confirm("¿Estás seguro que deseas eliminar este alumno?");
      if (!confirmed) return;
      try {
        const ok = removeStudent(identifier);
        if (ok) {
          window.dispatchEvent(new Event("hashchange"));
        } else {
          alert("No se encontró el alumno para eliminar.");
        }
      } catch (err) {
        console.error("Error eliminando alumno:", err);
        alert("Ocurrió un error al eliminar el alumno.");
      }
    });
  });

  const input = document.getElementById("students-search");
  if (input) {
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      document.querySelectorAll(".student-item").forEach(item => {
        const nombreEl = item.querySelector(".student-name");
        const nombre = nombreEl ? nombreEl.textContent.toLowerCase() : "";
        item.style.display = nombre.includes(q) ? "" : "none";
      });
    });
  }
}