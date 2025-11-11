import { homeView, initHomeLogic } from "./views/home-view.js";
import { loginView } from "./views/login-view.js";
import { dashboardview, initDashboardLogic } from "./views/dashboard-view.js";
import { studentsView, initStudentsListLogic } from "./views/students-view.js";
import { studentsCreateView, initStudentsCreateLogic } from "./views/students-create-view.js";
import { coursesView, initCoursesListLogic } from "./views/courses-view.js";
import { coursesCreateView, initCoursesCreateLogic } from "./views/courses-create-view.js";
import { coursesEditView, initCoursesEditLogic } from "./views/courses-edit-view.js";
import { trainerView, initTrainersLogic } from "./views/trainer-view.js";
import { adminView, initAdminsLogic } from "./views/admin-view.js";
import "./components/course-card.js";

const routes = {
  "#/": homeView,
  "#/home": homeView,
  "#/login": loginView,
  "#/dashboard": dashboardview,
  // students
  "#/students": studentsView,
  "#/alumnos": studentsView,
  "#/students/new": studentsCreateView,
  "#/alumnos/new": studentsCreateView,
  // courses
  "#/courses": coursesView,
  "#/cursos": coursesView,
  "#/courses/new": coursesCreateView,
  "#/crear-curso": coursesCreateView,
  "#/courses/edit": coursesEditView,
  // trainers 
  "#/trainers": trainerView,
  "#/teachers": trainerView,
  "#/admins": adminView,
  "#/administrativos": adminView
};

function baseHash(hash) {
  if (!hash) return hash;
  const q = hash.indexOf("?");
  return q === -1 ? hash : hash.slice(0, q);
}

function renderView(hash) {
  const bHash = baseHash(hash); 
  const view = routes[bHash] || (() => "<h2>404: Página no encontrada</h2>");
  document.getElementById("app").innerHTML = view();

  if (bHash === "#/" || bHash === "#/home") {
    try { initHomeLogic(); } catch (err) { console.error("initHomeLogic error:", err); }
  }

  if (bHash === "#/dashboard") {
    try { initDashboardLogic(); } catch (err) { console.error("initDashboardLogic error:", err); }
  }

  if (bHash === "#/login") {
    agregarLogicaDeLogin();
  }

  if (bHash === "#/students" || bHash === "#/alumnos") {
    const input = document.getElementById("students-search") || document.getElementById("alumnos-search");
    if (input) {
      input.addEventListener("input", () => {
        const q = input.value.trim().toLowerCase();
        document.querySelectorAll(".student-item, .alumno-item").forEach(item => {
          const nombreEl = item.querySelector(".student-name, .alumno-nombre");
          const nombre = nombreEl ? nombreEl.textContent.toLowerCase() : "";
          item.style.display = nombre.includes(q) ? "" : "none";
        });
      });
    }
    try { initStudentsListLogic(); } catch (err) { console.error("initStudentsListLogic error:", err); }
  }

  if (bHash === "#/students/new" || bHash === "#/alumnos/new") {
    try { initStudentsCreateLogic(); } catch (err) { console.error("initStudentsCreateLogic error:", err); }
  }

  if (bHash === "#/courses" || bHash === "#/cursos") {
    const input = document.getElementById("courses-search");
    if (input) {
      input.addEventListener("input", () => {
        const q = input.value.trim().toLowerCase();
        document.querySelectorAll(".course-item").forEach(item => {
          const nombre = item.querySelector(".course-name")?.textContent.toLowerCase() || "";
          item.style.display = nombre.includes(q) ? "" : "none";
        });
      });
    }
    try { initCoursesListLogic(); } catch (err) { console.error("initCoursesListLogic error:", err); }
  }

  if (bHash === "#/courses/new" || bHash === "#/crear-curso") {
    try { initCoursesCreateLogic(); } catch (err) { console.error("initCoursesCreateLogic error:", err); }
  }

  if (bHash === "#/courses/edit") {
    try { initCoursesEditLogic(); } catch (err) { console.error("initCoursesEditLogic error:", err); }
  }

  if (bHash === "#/trainers" || bHash === "#/teachers") {
    try { initTrainersLogic(); } catch (err) { console.error("initTrainersLogic error:", err); }
  }

  if (bHash === "#/admins" || bHash === "#/administrativos") {
    try { initAdminsLogic(); } catch (err) { console.error("initAdminsLogic error:", err); }
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
        location.hash = "#/dashboard";
      } else {
        const errEl = document.getElementById("login-error");
        if (errEl) errEl.style.display = "block";
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