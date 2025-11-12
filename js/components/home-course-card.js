class HomeCourseCard extends HTMLElement {
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

  _loadCourseFromStorage(id) {
    if (!id) return null;
    const raw = localStorage.getItem("courses") || localStorage.getItem("cursos");
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return null;
      return parsed.find(c => String(c.id) === String(id)) || null;
    } catch {
      return null;
    }
  }

  _escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str).replace(/[&<>"']/g, (m) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
  }

  _getName(course) {
    if (!course) return "";
    return course.nombre || course.name || course.title || "";
  }

  _getDescription(course) {
    if (!course) return "";
    return course.descripcion || course.description || course.desc || "";
  }

  _getModules(course) {
    if (!course) return [];
    const candidates = course.modules || course.modulos || course.modulosList || course.lecciones || [];
    if (!Array.isArray(candidates)) return [];
    return candidates.map(m => {
      if (!m) return "";
      if (typeof m === "string") return m;
      return m.nombre || m.name || m.titulo || m.title || "";
    }).filter(Boolean);
  }

  _render() {
    let course = this._course || null;
    const idAttr = this.getAttribute("course-id");
    if (!course && idAttr) {
      course = this._loadCourseFromStorage(idAttr);
    }

    const name = this._getName(course);
    const desc = this._getDescription(course);
    const modules = this._getModules(course);

    const html = `
      <style>
        :host { display:block; font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial; }
        .card {
          background: #fff; border:1px solid #e6e6e6; border-radius:8px; padding:12px;
          box-shadow: 0 6px 18px rgba(16,24,40,0.04);
        }
        .title { margin:0 0 6px 0; font-size:1rem; font-weight:700; color:#0f172a; }
        .desc { margin:0; color:#475569; font-size:0.92rem; min-height:20px; margin-bottom:8px; }
        .modules { margin-top:8px; display:flex; flex-wrap:wrap; gap:6px; }
        .module { background:#f1f5f9; padding:6px 8px; border-radius:999px; font-size:0.82rem; color:#0f172a; }
        .no-data { color:#6b7280; font-style:italic; margin-top:8px; }
      </style>

      <article class="card" data-id="${this._escapeHtml(course && course.id ? course.id : (idAttr || ""))}">
        <h3 class="title">${name ? this._escapeHtml(name) : "Curso sin información"}</h3>
        <p class="desc">${this._escapeHtml(desc)}</p>

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

if (!customElements.get("home-course-card")) {
  customElements.define("home-course-card", HomeCourseCard);
}