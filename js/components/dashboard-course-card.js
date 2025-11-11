class DashboardCourseCard extends HTMLElement {
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
    try {
      const raw = localStorage.getItem("courses") || localStorage.getItem("cursos");
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  _readTeachers() {
    try {
      const raw = localStorage.getItem("teachers") || localStorage.getItem("profesores");
      if (!raw) return [];
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

  _findTeacherNameForCourse(course) {
    if (!course) return "";
    const teachers = this._readTeachers();
    const teacherId = course.teacherId || null;
    if (teacherId) {
      const t = teachers.find(x => String(x.id) === String(teacherId));
      if (t) return t.nombre || `${t.nombres || ""} ${t.apellidos || ""}`.trim() || t.name || "";
    }
    // fallback: look for teacherName/docente/profesor in course
    const candidate = course.teacherName || course.docente || course.profesor || course.profesorName || "";
    if (candidate) return candidate;
    return "";
  }

  _normalizeStudents(arr) {
    if (!Array.isArray(arr)) return [];
    return arr.map(a => {
      if (!a) return "";
      if (typeof a === "string") return a;
      if (typeof a === "object") return a.nombre || a.name || a.id || JSON.stringify(a);
      return String(a);
    }).filter(Boolean);
  }

  _normalizeModules(arr) {
    if (!Array.isArray(arr)) return [];
    return arr.map(m => (m || "").toString()).filter(Boolean);
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

    const nombre = course ? (course.nombre || course.name || "") : "";
    const profesor = this._findTeacherNameForCourse(course) || "";
    const alumnosArr = course ? (Array.isArray(course.alumnos) ? course.alumnos.slice() : (Array.isArray(course.students) ? course.students.slice() : [])) : [];
    const alumnos = this._normalizeStudents(alumnosArr);
    const modulosArr = course ? (Array.isArray(course.modulos) ? course.modulos.slice() : (Array.isArray(course.modules) ? course.modules.slice() : [])) : [];
    const modulos = this._normalizeModules(modulosArr);

    const html = `
      <style>
        :host { display:block; width:100%; font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial; }
        .card {
          background: var(--card-bg, #fff);
          border: 1px solid var(--border, #e6eefb);
          border-radius: 10px;
          padding: 12px;
          box-shadow: 0 6px 18px rgba(16,24,40,0.04);
        }
        .title { margin:0 0 6px 0; font-weight:700; color:var(--text, #0b2545); font-size:1.05rem; }
        .meta { color:var(--muted, #6b7a99); font-size:0.9rem; margin-bottom:8px; }
        .modules { margin:6px 0 0 0; font-size:0.9rem; color:var(--muted, #6b7a99); }
        .modules li { margin-left:1rem; margin-bottom:4px; }
        .students-count { font-weight:700; color:var(--primary, #2563eb); }
      </style>

      <article class="card" data-id="${this._escapeHtml(course && course.id ? course.id : (idAttr || ""))}">
        <h3 class="title">${nombre ? this._escapeHtml(nombre) : "Curso"}</h3>
        <div class="meta">${profesor ? `<div><strong>Profesor:</strong> ${this._escapeHtml(profesor)}</div>` : `<div><strong>Profesor:</strong> —</div>`}
          <div><strong>Alumnos inscritos:</strong> <span class="students-count">${alumnos.length}</span></div>
        </div>
        ${modulos && modulos.length ? `
          <div class="modules">
            <strong>Módulos:</strong>
            <ul>${modulos.map(m => `<li>${this._escapeHtml(m)}</li>`).join("")}</ul>
          </div>
        ` : `<div class="modules"><strong>Módulos:</strong> —</div>`}
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

if (!customElements.get("dashboard-course-card")) {
  customElements.define("dashboard-course-card", DashboardCourseCard);
}