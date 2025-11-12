class HomeTrainerCard extends HTMLElement {
  static get observedAttributes() { return ["trainer-id"]; }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._trainer = null;
  }

  connectedCallback() {
    this._render();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "trainer-id" && oldVal !== newVal) {
      this._render();
    }
  }

  _readTrainersFromStorage(id) {
    const keys = ["trainers", "teachers", "docentes"];
    for (const k of keys) {
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) continue;
        if (!id) return parsed;
        const found = parsed.find(t => String(t.id) === String(id) || String(t.codigo) === String(id));
        if (found) return found;
      } catch {
        continue;
      }
    }
    return id ? null : [];
  }

  _escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str).replace(/[&<>"']/g, (m) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
  }

  _getFullName(tr) {
    if (!tr) return "";
    return tr.nombre || tr.nombreCompleto || `${tr.nombres || ""} ${tr.apellidos || ""}`.trim() || tr.name || "";
  }

  _getSpecialty(tr) {
    if (!tr) return "";
    return tr.area || tr.especialidad || tr.areaAcademica || tr.specialty || "";
  }

  _getEmail(tr) {
    if (!tr) return "";
    return tr.email || tr.correo || tr.mail || "";
  }

  _render() {
    let trainer = this._trainer || null;
    const idAttr = this.getAttribute("trainer-id");
    if (!trainer && idAttr) {
      trainer = this._readTrainersFromStorage(idAttr);
    }

    if (Array.isArray(trainer)) trainer = null;

    const name = this._getFullName(trainer);
    const specialty = this._getSpecialty(trainer);
    const email = this._getEmail(trainer);

    const html = `
      <style>
        :host { display:block; font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial; }
        .card {
          background:#fff; border:1px solid #e6e6e6; border-radius:8px; padding:12px;
          box-shadow: 0 6px 18px rgba(16,24,40,0.04);
        }
        .name { margin:0 0 6px 0; font-size:1rem; font-weight:700; color:#0f172a; }
        .meta { color:#475569; font-size:0.92rem; margin:0; min-height:18px; }
        .email { color:#0369a1; font-size:0.9rem; word-break:break-all; margin-top:8px; }
      </style>

      <article class="card" data-id="${this._escapeHtml(trainer && trainer.id ? trainer.id : (idAttr || ""))}">
        <div class="name">${name ? this._escapeHtml(name) : "Profesor sin nombre"}</div>
        <div class="meta">${specialty ? this._escapeHtml(specialty) : "Especialidad no definida"}</div>
        <div class="email">${email ? this._escapeHtml(email) : ""}</div>
      </article>
    `;
    this.shadowRoot.innerHTML = html;
  }

  set trainer(obj) {
    this._trainer = obj;
    this._render();
  }

  get trainer() {
    return this._trainer;
  }
}

if (!customElements.get("home-trainer-card")) {
  customElements.define("home-trainer-card", HomeTrainerCard);
}