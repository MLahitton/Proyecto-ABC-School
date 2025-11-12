import "../components/home-course-card.js";


export function homeCoursesView() {
  return `
    <nav>
      <img src="assets/Logo.png" class="logo" alt="Logo">
      <div class="menu">
        <a href="#/home">Home</a>
        <a href="#/home-courses">Courses</a>
        <a href="#/home-trainers">Trainers</a>
        <a href="#/contact">Contact</a>
      </div>
    </nav>
    <main style="padding:1rem;">
      <section style="max-width:1100px; margin:0 auto;">
        <h2>Cursos</h2>
        <div id="home-courses-only" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:12px; margin-top:12px;"></div>
      </section>
    </main>
  `;
}


export function initHomeCoursesLogic() {
  const container = document.getElementById("home-courses-only");
  if (!container) return;

  container.innerHTML = "";

  let courses = [];
  try {
    const raw = localStorage.getItem("courses") || localStorage.getItem("cursos");
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) courses = parsed;
  } catch (err) {
    console.warn("initHomeCoursesLogic: error leyendo cursos desde localStorage", err);
    courses = [];
  }

  if (!courses.length) {
    container.innerHTML = `<div style="color:#6b7280; font-style:italic;">No hay cursos para mostrar.</div>`;
    return;
  }

  courses.forEach(course => {
    const el = document.createElement("home-course-card");
    try {
      el.course = course;
    } catch (e) {
      console.warn("home-courses-view: no se pudo setear la propiedad course:", e);
    }
    if (course && course.id) {
      el.setAttribute("course-id", String(course.id));
    }
    container.appendChild(el);
  });
}