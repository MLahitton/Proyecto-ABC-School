import {mostrarBarraNavegacion} from "../helpers/navBar.js"

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
      const studentsMap = {}; // 

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
          <article class="student-item" data-index="${index}">
            <h3 class="student-name">${student.name}</h3>
            ${student.document ? `<p class="student-document"><strong>Documento:</strong> ${student.document}</p>` : ''}
            ${student.dob ? `<p class="student-dob"><strong>Fecha Nac.:</strong> ${student.dob}</p>` : ''}
            <p class="student-courses"><strong>Cursos:</strong> ${student.cursos && student.cursos.length ? student.cursos.join(', ') : '—'}</p>
          </article>
        `).join('')}
      </section>
    </main>
  `;
}