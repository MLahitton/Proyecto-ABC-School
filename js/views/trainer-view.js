import "../components/trainer-card.js";
import { mostrarBarraNavegacion } from "../helpers/navBar.js";
import { readTeachers, addTeacher, removeTeacher } from "../helpers/trainer-storage.js";

function _escapeHtml(str) {
  if (!str && str !== 0) return "";
  return String(str).replace(/[&<>"']/g, (m) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
}

export function trainerView() {
  const trainers = Array.isArray(readTeachers()) ? readTeachers() : [];
  return `
    ${mostrarBarraNavegacion ? mostrarBarraNavegacion() : ''}
    <main class="trainers-main" style="padding:1rem;">
      <section style="max-width:1000px; margin:0 auto;">
        <h2>Docentes</h2>

        <form id="trainer-create-form" class="trainer-form" style="display:grid; grid-template-columns: 1fr 1fr; gap:0.5rem; margin-bottom:1rem;">
          <input id="trainer-nombres" name="nombres" placeholder="Nombres" required style="padding:0.5rem; border-radius:6px; border:1px solid #e6eefb;">
          <input id="trainer-apellidos" name="apellidos" placeholder="Apellidos" required style="padding:0.5rem; border-radius:6px; border:1px solid #e6eefb;">
          <input id="trainer-documento" name="documento" placeholder="Documento de identidad" required style="padding:0.5rem; border-radius:6px; border:1px solid #e6eefb;">
          <input id="trainer-email" name="email" placeholder="Correo electrónico" type="email" style="padding:0.5rem; border-radius:6px; border:1px solid #e6eefb;">
          <input id="trainer-telefono" name="telefono" placeholder="Número telefónico" style="padding:0.5rem; border-radius:6px; border:1px solid #e6eefb;">
          <input id="trainer-specialty" name="specialty" placeholder="Especialidad" style="padding:0.5rem; border-radius:6px; border:1px solid #e6eefb;">
          <textarea id="trainer-bio" name="bio" placeholder="Breve descripción" style="grid-column:1 / -1; padding:0.5rem; border-radius:6px; border:1px solid #e6eefb;"></textarea>
          <div style="grid-column:1 / -1; display:flex; justify-content:flex-end; gap:8px;">
            <button type="submit" class="btn btn-primary" style="padding:0.5rem 0.9rem; border-radius:6px;">Crear docente</button>
          </div>
        </form>

        <section class="trainers-list">
          ${trainers.length === 0 ? `<p class="no-trainers">No hay docentes registrados.</p>` : trainers.map((t, i) => `
            <article class="trainer-item" data-index="${i}" data-id="${_escapeHtml(t.id || "")}">
              <trainer-card teacher-id="${_escapeHtml(t.id || "")}"></trainer-card>
              <div style="margin-top:6px; display:flex; justify-content:flex-end; gap:8px;">
                <button class="btn btn-danger btn-delete-trainer" data-id="${_escapeHtml(t.id || "")}" data-documento="${_escapeHtml(t.documento || "")}">Eliminar</button>
              </div>
            </article>
          `).join('')}
        </section>
      </section>
    </main>
  `;
}

export function initTrainersLogic() {
  // delete buttons
  document.querySelectorAll(".btn-delete-trainer").forEach(btn => {
    btn.removeEventListener && btn.removeEventListener("click", () => {});
    btn.addEventListener("click", (e) => {
      const id = btn.getAttribute("data-id");
      const documento = btn.getAttribute("data-documento");
      const identifier = id && id.trim() ? id.trim() : (documento && documento.trim() ? documento.trim() : null);
      if (!identifier) return;
      const confirmed = confirm("¿Estás seguro que deseas eliminar este docente?");
      if (!confirmed) return;
      try {
        const ok = removeTeacher(identifier);
        if (ok) {
          window.dispatchEvent(new Event("hashchange"));
        } else {
          alert("No se encontró el docente para eliminar.");
        }
      } catch (err) {
        console.error("Error eliminando docente:", err);
        alert("Ocurrió un error al eliminar el docente.");
      }
    });
  });

  const form = document.getElementById("trainer-create-form");
  if (form) {
    form.removeEventListener && form.removeEventListener("submit", () => {});
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const nombresEl = document.getElementById("trainer-nombres");
      const apellidosEl = document.getElementById("trainer-apellidos");
      const documentoEl = document.getElementById("trainer-documento");
      const emailEl = document.getElementById("trainer-email");
      const telefonoEl = document.getElementById("trainer-telefono");
      const specialtyEl = document.getElementById("trainer-specialty");
      const bioEl = document.getElementById("trainer-bio");

      const nombres = nombresEl ? nombresEl.value.trim() : "";
      const apellidos = apellidosEl ? apellidosEl.value.trim() : "";
      const documento = documentoEl ? documentoEl.value.trim() : "";
      const email = emailEl ? emailEl.value.trim() : "";
      const telefono = telefonoEl ? telefonoEl.value.trim() : "";
      const especialidad = specialtyEl ? specialtyEl.value.trim() : "";
      const bio = bioEl ? bioEl.value.trim() : "";

      if (!nombres || !apellidos || !documento) {
        alert("Nombres, Apellidos y Documento son obligatorios.");
        return;
      }

      try {
        addTeacher({
          nombres,
          apellidos,
          documento,
          email,
          telefono,
          especialidad,
          bio
        });
        window.dispatchEvent(new Event("hashchange"));
      } catch (err) {
        console.error("Error creando docente:", err);
        alert(err.message || "No se pudo crear el docente.");
      }
    });
  }

  const input = document.getElementById("trainers-search");
  if (input) {
    input.removeEventListener && input.removeEventListener("input", () => {});
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      document.querySelectorAll(".trainer-item").forEach(item => {
        const nameEl = item.querySelector(".trainer-card") || item.querySelector("trainer-card");
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(q) ? "" : "none";
      });
    });
  }
}