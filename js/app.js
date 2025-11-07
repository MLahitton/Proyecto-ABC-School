import { homeView } from "./views/home-view.js";
import { loginView } from "./views/login-view.js";
import { dashboardview } from "./views/dashboard-view.js";
import { crearCursoView } from "./views/creacion-curso-view.js";

const routes = {
  "#/": homeView,
  "#/home": homeView,
  "#/login": loginView,
  "#/dasboard": dashboardview,
  "#/crear-curso": crearCursoView,
  // más rutas...
};

function renderView(hash) {
  const view = routes[hash] || (() => "<h2>404: Página no encontrada</h2>");
  document.getElementById("app").innerHTML = view();

  if (hash === "#/login") {
    agregarLogicaDeLogin();
  }
}

function agregarLogicaDeLogin() {
  const form = document.getElementById("login-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const usuario = form.usuario.value.trim();
      const password = form.password.value.trim();
      if (usuario === "admin" && password === "1234") {
        localStorage.setItem("adminLogin", "true"); 
        location.hash = "#/dasboard"; 
      } else {
        document.getElementById("login-error").style.display = "block";
      }
    });
  }
}

export function initApp() {
  window.addEventListener("hashchange", () => renderView(location.hash));
  if (!location.hash || location.hash === "#") {
    location.hash = "#/";
  }
  renderView(location.hash);
}