class TrainerCard extends HTMLElement {
  static get observedAttributes() { return ["teacher-id"]; }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._teacher = null;
  }

  connectedCallback() {
    this._render();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "teacher-id" && oldVal !== newVal) {
      this._render();
    }
  }

  _readTeachers() {
    const raw = localStorage.getItem("teachers") || localStorage.getItem("profesores");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
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

  _findTeacherById(id) {
    if (!id) return null;
    const teachers = this._readTeachers();
    return teachers.find(t => String(t.id) === String(id)) || null;
  }

  _countCoursesForTeacher(teacher) {
    if (!teacher) return 0;
    const courses = this._readCourses();
    const tid = teacher.id ? String(teacher.id) : null;
    const tname = (teacher.nombre || `${teacher.nombres || ""} ${teacher.apellidos || ""}`).toString().trim().toLowerCase();
    if (!Array.isArray(courses) || !courses.length) return 0;
    let count = 0;
    courses.forEach(c => {
      if (!c) return;
      const teacherIdMatch = c.teacherId && tid && String(c.teacherId) === tid;
      const teacherNameMatch = (c.teacherName || c.docente || c.profesor || "").toString().trim().toLowerCase() === tname;
      if (teacherIdMatch || teacherNameMatch) count++;
    });
    return count;
  }

  _escapeHtml(str) {
    if (!str && str !== 0) return "";
    return String(str).replace(/[&<>"']/g, (m) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
  }

  _render() {
    let teacher = this._teacher || null;
    const idAttr = this.getAttribute("teacher-id");
    if (!teacher && idAttr) teacher = this._findTeacherById(idAttr);

    const nombre = teacher ? (teacher.nombre || `${teacher.nombres || ""} ${teacher.apellidos || ""}`.trim()) : "";
    const especialidad = teacher ? (teacher.especialidad || "") : "";
    const bio = teacher ? (teacher.bio || "") : "";
    const documento = teacher ? (teacher.documento || "") : "";
    const email = teacher ? (teacher.email || "") : "";
    const telefono = teacher ? (teacher.telefono || "") : "";
    const coursesCount = this._countCoursesForTeacher(teacher);

    const html = `
      <style>
        :host { display:block; width:100%; max-width:360px; font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial; }
        .card {
          background: #fff;
          border: 1px solid #e6eefb;
          border-radius: 10px;
          padding: 12px;
          box-shadow: 0 6px 18px rgba(13,60,150,0.05);
        }
        .name { margin:0 0 6px 0; font-weight:700; color:#08306a; font-size:1.05rem; }
        .specialty { margin:0 0 8px 0; color:#2b6cb0; font-size:0.95rem; }
        .bio { color:#475569; font-size:0.9rem; margin-bottom:8px; min-height:36px; }
        .meta { color:#6b7280; font-size:0.85rem; display:flex; gap:8px; flex-wrap:wrap; }
        .contact { margin-top:8px; font-size:0.9rem; color:#234e7a; }
        a.contact-link { color:#1e4fd6; text-decoration:none; }
      </style>

      <article class="card" data-id="${this._escapeHtml(teacher && teacher.id ? teacher.id : (idAttr || ""))}">
        <div class="content">
          <h3 class="name">${nombre ? this._escapeHtml(nombre) : "Docente no encontrado"}</h3>
          ${especialidad ? `<div class="specialty">${this._escapeHtml(especialidad)}</div>` : ""}
          ${bio ? `<div class="bio">${this._escapeHtml(bio)}</div>` : `<div class="bio">—</div>`}
          <div class="meta">
            <div>Asignados: <strong>${coursesCount}</strong></div>
            ${documento ? `<div>Documento: <strong>${this._escapeHtml(documento)}</strong></div>` : ""}
          </div>
          <div class="contact">
            ${email ? `<div>Email: <a class="contact-link" href="mailto:${this._escapeHtml(email)}">${this._escapeHtml(email)}</a></div>` : ""}
            ${telefono ? `<div>Tel: <a class="contact-link" href="tel:${this._escapeHtml(telefono)}">${this._escapeHtml(telefono)}</a></div>` : ""}
          </div>
        </div>
      </article>
    `;
    this.shadowRoot.innerHTML = html;
  }

  set teacher(obj) {
    this._teacher = obj;
    this._render();
  }

  get teacher() {
    return this._teacher;
  }
}

if (!customElements.get("trainer-card")) {
  customElements.define("trainer-card", TrainerCard);
}