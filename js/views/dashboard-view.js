import "../components/dashboard-course-card.js";
import { mostrarBarraNavegacion } from "../helpers/navBar.js";

function _readCourses() {
  try {
    const raw = localStorage.getItem("courses") || localStorage.getItem("cursos");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn("dashboard-view: error parseando courses/cursos desde localStorage", e);
    return [];
  }
}

export function dashboardview() {
  return `
    ${mostrarBarraNavegacion ? mostrarBarraNavegacion() : ""}
    <main style="padding:1rem;">
      <section style="max-width:1100px; margin:0 auto;">
        <h2>Cursos activos</h2>
        <div id="dashboard-courses-container" class="cursos-list" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap:1rem;"></div>
      </section>
    </main>
  `;
}

export function initDashboardLogic() {
  const container = document.getElementById("dashboard-courses-container");
  if (!container) return;

  container.innerHTML = "";

  let courses = [];
  try {
    courses = _readCourses();
  } catch (e) {
    courses = [];
  }

  if (!Array.isArray(courses) || courses.length === 0) {
    container.innerHTML = `<p class="no-courses">No hay cursos registrados en localStorage.</p>`;
    return;
  }

  courses.forEach(c => {
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.gap = "8px";

    const card = document.createElement("dashboard-course-card");
    if (c && c.id) {
      card.setAttribute("course-id", c.id);
    } else {
      card.course = {
        id: c.id || "",
        nombre: c.nombre || c.name || "",
        profesor: c.profesor || c.teacherName || c.docente || "",
        alumnos: c.alumnos || c.students || [],
        modulos: c.modulos || c.modules || [],
        lecciones:c.lecciones || c.lectures || [],
      };
    }

    wrapper.appendChild(card);
    container.appendChild(wrapper);
  });
}