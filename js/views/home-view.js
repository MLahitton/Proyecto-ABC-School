import "../components/course-card.js";

const profesores = [
  { nombre: "María López", especialidad: "Matemáticas" },
  { nombre: "Juan Pérez", especialidad: "Ciencias" },
  { nombre: "Sofía García", especialidad: "Historia" }
];

const cursosSimulados = [
  { id: "c_sim_1", nombre: "Álgebra Básica", docente: "María López", modules: ["Álgebra I", "Ecuaciones"] },
  { id: "c_sim_2", nombre: "Química 101", docente: "Juan Pérez", modules: ["Materia", "Reacciones"] },
  { id: "c_sim_3", nombre: "Historia Antigua", docente: "Sofía García", modules: ["Antiguo Oriente", "Grecia"] }
];

export function homeView() {
  return `
    <nav>
      <img src="assets/Logo.png" class="logo" alt="Logo">
      <div class="menu">
        <a href="#">Poner los href</a>
        <a href="#/courses">Courses</a>
        <a href="#/teachers">Trainers</a>
        <a href="#/contact">Contact</a>
      </div>
      <div class="login">
        <a href="#/login">Login </a>
      </div>
    </nav>

    <div class="banner">
      <div class="text-banner">
        <h3>Nuestra historia</h3>
        <p>En la Institución Educativa ABC creemos que cada estudiante guarda en su interior un potencial infinito.
Un sueño, una idea o una chispa capaz de transformar su vida y el mundo que lo rodea.

Aquí, la educación no se trata solo de aprender contenidos, sino de descubrir propósitos.
De mirar más allá del aula y entender que el conocimiento tiene poder cuando se comparte, se vive y se aplica con pasión.

Cada día acompañamos a nuestros estudiantes en un camino de crecimiento, curiosidad y superación.
Les enseñamos a pensar, pero también a sentir.
A liderar con empatía, a construir con creatividad y a avanzar con confianza hacia el futuro que elijan.

Porque educar no es llenar la mente: es encender el alma.
Y en la Institución Educativa ABC lo hacemos juntos — paso a paso, logro a logro — formando seres humanos que inspiran, transforman y dejan huella."</p>
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
      <div id="home-courses-container" class="grid-cursos"></div>
    </section>
  `;
}

export function initHomeLogic() {
  const container = document.getElementById("home-courses-container");
  if (!container) return;

  container.innerHTML = "";

  let stored = null;
  try {
    const raw = localStorage.getItem("courses") || localStorage.getItem("cursos");
    stored = raw ? JSON.parse(raw) : null;
  } catch (e) {
    stored = null;
  }

  const isStoredArray = Array.isArray(stored) && stored.length > 0;
  const coursesToRender = isStoredArray ? stored : cursosSimulados;

  coursesToRender.forEach(c => {
    const card = document.createElement("course-card");

    if (isStoredArray) {
      if (c && c.id) {
        card.setAttribute("course-id", c.id);
      } else {
        card.course = {
          id: c.id || "",
          nombre: c.nombre || c.name || "",
          modules: c.modules || c.modulos || []
        };
      }
    } else {
      card.course = {
        id: c.id || "",
        nombre: c.nombre || c.name || "",
        modules: c.modules || c.modulos || []
      };
    }

    const wrapper = document.createElement("div");
    wrapper.className = "course-wrapper";
    wrapper.appendChild(card);
    container.appendChild(wrapper);
  });
}