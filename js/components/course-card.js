class CourseCard extends HTMLElement {
  static get observedAttributes() { return ["course-id"]; }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._course = null;
  }

  connectedCallback() {
    this._render();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "course-id" && oldVal !== newVal) {
      this._render();
    }
  }

  _readCourses() {
    const raw = localStorage.getItem("courses") || localStorage.getItem("cursos");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  _findCourseById(id) {
    if (!id) return null;
    const courses = this._readCourses();
    return courses.find(c => String(c.id) === String(id)) || null;
  }

  _getCourseName(course) {
    if (!course) return "";
    return course.nombre || course.name || "";
  }

  _getModules(course) {
    if (!course) return [];
    if (Array.isArray(course.modules) && course.modules.length) return course.modules.slice();
    if (Array.isArray(course.modulos) && course.modulos.length) return course.modulos.slice();
    return [];
  }

  _escapeHtml(str) {
    if (!str && str !== 0) return "";
    return String(str).replace(/[&<>"']/g, (m) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
  }

  _render() {
    let course = this._course || null;
    const idAttr = this.getAttribute("course-id");
    if (!course && idAttr) {
      course = this._findCourseById(idAttr);
    }

    const name = this._getCourseName(course);
    const modules = this._getModules(course);

    const html = `
      <style>
        :host { display:block; max-width:360px; font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial; width:100%; }
        .card { background: #fff; border: 1px solid #e6e6e6; border-radius: 8px; padding: 12px; box-shadow: 0 6px 16px rgba(16,24,40,0.04); }
        .title { margin:0 0 6px 0; font-size:1rem; font-weight:700; color:#0f172a; }
        .modules { margin-top:8px; display:flex; flex-wrap:wrap; gap:6px; }
        .module { background:#f1f5f9; padding:6px 8px; border-radius:999px; font-size:0.85rem; color:#0f172a; }
        .no-data { color:#6b7280; font-style:italic; }
      </style>

      <article class="card" data-id="${this._escapeHtml(course && course.id ? course.id : (idAttr || ""))}">
        <h3 class="title">${name ? this._escapeHtml(name) : "Curso no encontrado"}</h3>

        ${modules && modules.length ? `
          <div class="modules">
            ${modules.map(m => `<span class="module">${this._escapeHtml(m)}</span>`).join('')}
          </div>
        ` : `<div class="no-data">No hay módulos registrados</div>`}
      </article>
    `;
    this.shadowRoot.innerHTML = html;
  }

  set course(obj) {
    this._course = obj;
    this._render();
  }

  get course() {
    return this._course;
  }
}

if (!customElements.get("course-card")) {
  customElements.define("course-card", CourseCard);
}