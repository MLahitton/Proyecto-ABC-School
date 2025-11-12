import "../components/admin-card.js";
import { mostrarBarraNavegacion } from "../helpers/navBar.js";
import { readAdmins, addAdmin, removeAdmin } from "../helpers/admin-storage.js";

export function adminView() {
  return `
    ${mostrarBarraNavegacion ? mostrarBarraNavegacion() : ""}
    <main style="padding:1rem;">
      <section style="max-width:900px; margin:0 auto;">
        <h2>Administradores</h2>

        <form id="admin-create-form" style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-bottom:1rem;">
          <input id="admin-nombres" placeholder="Nombres" required>
          <input id="admin-apellidos" placeholder="Apellidos" required>
          <input id="admin-email" type="email" placeholder="Correo electrónico" required>
          <input id="admin-password" type="password" placeholder="Contraseña" required>
          <div style="grid-column:1 / -1; display:flex; justify-content:flex-end;">
            <button type="submit" class="btn">Crear administrador</button>
          </div>
        </form>

        <div id="admins-list" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap:12px;"></div>
      </section>
    </main>
  `;
}

export function initAdminsLogic() {
  const container = document.getElementById("admins-list");
  if (!container) return;

  function renderList() {
    const admins = Array.isArray(readAdmins()) ? readAdmins() : [];
    if (!admins.length) {
      container.innerHTML = `<p>No hay administradores registrados.</p>`;
      return;
    }
    container.innerHTML = admins.map(a => `
      <div class="admin-wrapper" data-id="${a.id}">
        <admin-card admin-id="${a.id}"></admin-card>
        <div style="display:flex; justify-content:flex-end; margin-top:6px;">
          <button class="btn btn-danger btn-delete-admin" data-id="${a.id}" data-email="${a.email}">Eliminar</button>
        </div>
      </div>
    `).join("");
    container.querySelectorAll(".btn-delete-admin").forEach(btn => {
      btn.removeEventListener && btn.removeEventListener("click", () => {});
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const email = btn.getAttribute("data-email");
        const identifier = id || email;
        if (!identifier) return;
        if (!confirm("¿Eliminar este administrador?")) return;
        const ok = removeAdmin(identifier);
        if (ok) renderList();
        else alert("No se encontró el administrador.");
      });
    });
  }

  renderList();

  const form = document.getElementById("admin-create-form");
  if (form) {
    form.removeEventListener && form.removeEventListener("submit", () => {});
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const nombres = document.getElementById("admin-nombres").value.trim();
      const apellidos = document.getElementById("admin-apellidos").value.trim();
      const email = document.getElementById("admin-email").value.trim();
      const password = document.getElementById("admin-password").value;
      try {
        addAdmin({ nombres, apellidos, email, password });
        document.getElementById("admin-nombres").value = "";
        document.getElementById("admin-apellidos").value = "";
        document.getElementById("admin-email").value = "";
        document.getElementById("admin-password").value = "";
        renderList();
      } catch (err) {
        alert(err.message || "Error creando administrador.");
      }
    });
  }
}