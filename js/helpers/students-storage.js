
export function readStudents() {
  try {
    const raw = localStorage.getItem("students");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Error leyendo students desde localStorage:", e);
    return [];
  }
}

export function saveStudents(students) {
  try {
    localStorage.setItem("students", JSON.stringify(students));
  } catch (e) {
    console.error("Error guardando students en localStorage:", e);
  }
}


export function generateStudentId(name, document) {
  const first = (name || "").trim().charAt(0).toUpperCase() || "X";
  const doc = String(document || "").trim();
  return `${first}${doc}`;
}


export function addStudent(student) {
  const students = readStudents();
  const id = student.id || generateStudentId(student.name, student.document);
  if (students.some(s => s.id === id)) {
    throw new Error("Ya existe un alumno con ese id");
  }
  const newStudent = {
    id,
    name: (student.name || "").trim(),
    document: String(student.document || "").trim(),
    dob: student.dob || null, 
    createdAt: new Date().toISOString(),
    ...student
  };
  students.push(newStudent);
  saveStudents(students);
  return newStudent;
}