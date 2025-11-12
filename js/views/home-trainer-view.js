import "../components/home-trainer-card.js";

export function homeTrainerView() {
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
        <h2>Docentes</h2>
        <div id="home-trainers-only" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap:12px; margin-top:12px;"></div>
      </section>
    </main>
  `;
}


export function initHomeTrainerLogic() {
  const container = document.getElementById("home-trainers-only");
  if (!container) return;

  const ejemploProfesores = [
    { id: "t_sim_1", nombre: "María López", especialidad: "Matemáticas", email: "maria.lopez@example.com" },
    { id: "t_sim_2", nombre: "Juan Pérez", especialidad: "Ciencias", email: "juan.perez@example.com" },
    { id: "t_sim_3", nombre: "Sofía García", especialidad: "Historia", email: "sofia.garcia@example.com" }
  ];

  let trainers = [];
  try {
    const raw = localStorage.getItem("trainers") || localStorage.getItem("teachers") || localStorage.getItem("docentes");
    trainers = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(trainers)) trainers = [];
  } catch (err) {
    console.warn("initHomeTrainerLogic: error parsing trainers from localStorage", err);
    trainers = [];
  }

  const listToRender = Array.isArray(trainers) && trainers.length ? trainers : ejemploProfesores;

  container.innerHTML = "";

  if (!listToRender.length) {
    container.innerHTML = `<div style="color:#6b7280; font-style:italic;">No hay docentes para mostrar.</div>`;
    return;
  }

  listToRender.forEach(tr => {
    const el = document.createElement("home-trainer-card");
    try {
      el.trainer = {
        id: tr.id || tr.codigo || "",
        nombre: tr.nombre || tr.nombreCompleto || `${tr.nombres || ""} ${tr.apellidos || ""}`.trim() || tr.name || "",
        especialidad: tr.especialidad || tr.area || tr.areaAcademica || tr.specialty || "",
        email: tr.email || tr.correo || ""
      };
    } catch (e) {
      console.warn("initHomeTrainerLogic: could not set trainer prop", e);
    }
    if (tr.id) el.setAttribute("trainer-id", String(tr.id));
    else if (tr.codigo) el.setAttribute("trainer-id", String(tr.codigo));
    container.appendChild(el);
  });
}