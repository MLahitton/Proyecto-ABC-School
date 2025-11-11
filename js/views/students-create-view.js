import { addStudent, readStudents, generateStudentId } from "../helpers/students-storage.js";

export function studentsCreateView() {
  return `
    <main class="student-create-main">
      <section class="student-create-section">
        <h2>Crear alumno</h2>

        <form id="student-form" class="student-form" autocomplete="off">
          <div>
            <label for="student-name">Nombre</label><br>
            <input id="student-name" name="name" type="text" required placeholder="Ej: Ana">
          </div>

          <div>
            <label for="student-document">Documento de identidad</label><br>
            <input id="student-document" name="document" type="text" required placeholder="Ej: 12345678">
          </div>

          <div>
            <label for="student-dob">Fecha de nacimiento</label><br>
            <input id="student-dob" name="dob" type="date" required>
          </div>

          <div style="margin-top: 1rem;">
            <button type="submit" id="student-submit">Crear alumno</button>
            <a type="button" id="student-cancel" href="#/dasboard">Cancelar</a>
          </div>

          <div id="student-message" role="status" style="margin-top:0.75rem; display:none;"></div>
        </form>
      </section>
    </main>
  `;
}


export function initStudentsCreateLogic() {
  const form = document.getElementById("student-form");
  const messageEl = document.getElementById("student-message");
  const cancelBtn = document.getElementById("student-cancel");

  if (!form) return;

  function showMessage(text, type = "info") {
    messageEl.style.display = "block";
    messageEl.textContent = text;
    messageEl.style.color = type === "error" ? "crimson" : (type === "success" ? "green" : "black");
  }

  cancelBtn?.addEventListener("click", () => {
    location.hash = "#/students";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const document = form.document.value.trim();
    const dob = form.dob.value; 

    if (!name) {
      showMessage("El nombre es obligatorio.", "error");
      return;
    }
    if (!document) {
      showMessage("El documento es obligatorio.", "error");
      return;
    }
    if (!/^\d+$/.test(document)) {
      showMessage("El documento debe contener solo números.", "error");
      return;
    }


    const id = generateStudentId(name, document);

    const existing = readStudents().some(s => s.id === id);
    if (existing) {
      showMessage(`Ya existe un alumno con id "${id}". Verifica los datos.`, "error");
      return;
    }

    try {
      const newStudent = addStudent({ id, name, document, dob });
      showMessage(`Alumno creado: ${newStudent.name} (id: ${newStudent.id})`, "success");

      form.reset();

      setTimeout(() => {
        location.hash = "#/students";
      }, 700);

    } catch (err) {
      console.error(err);
      showMessage("No se pudo crear el alumno: " + (err.message || err), "error");
    }
  });
}