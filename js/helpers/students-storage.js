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

function _readCoursesCollection() {
  try {
    const raw = localStorage.getItem("courses") || localStorage.getItem("cursos");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Error leyendo courses desde localStorage:", e);
    return [];
  }
}

function _saveCoursesCollection(arr) {
  try {
    localStorage.setItem("courses", JSON.stringify(arr));
    localStorage.setItem("cursos", JSON.stringify(arr));
  } catch (e) {
    console.error("Error guardando courses en localStorage:", e);
  }
}

export function removeStudent(idOrName) {
  if (!idOrName && idOrName !== 0) return false;
  const idStr = String(idOrName);

  try {
    const students = readStudents();
    const idx = students.findIndex(s => String(s.id) === idStr);
    if (idx !== -1) {
      students.splice(idx, 1);
      saveStudents(students);
      return true;
    }
  } catch (e) {
    console.warn("removeStudent: error removing from students key", e);
  }

  try {
    const courses = _readCoursesCollection();
    let changed = false;

    const normalizedTarget = idStr.trim().toLowerCase();

    const cleaned = courses.map(c => {
      const newCourse = { ...c };
      const arrNames = Array.isArray(newCourse.alumnos) ? newCourse.alumnos.slice() : (Array.isArray(newCourse.students) ? newCourse.students.slice() : []);
      if (!Array.isArray(arrNames) || arrNames.length === 0) return newCourse;

      const filtered = arrNames.filter(a => {
        if (!a) return true; 
        if (typeof a === "string") {
          const nameLower = a.trim().toLowerCase();
          if (nameLower === normalizedTarget) {
            changed = true;
            return false;
          }
          return true;
        } else if (typeof a === "object") {
          const aid = a.id ? String(a.id) : "";
          const aname = (a.nombre || a.name || "").trim();
          if (aid && aid === idStr) {
            changed = true;
            return false;
          }
          if (aname && aname.trim().toLowerCase() === normalizedTarget) {
            changed = true;
            return false;
          }
          return true;
        }
        return true;
      });

      if (Array.isArray(newCourse.alumnos)) {
        newCourse.alumnos = filtered;
      } else if (Array.isArray(newCourse.students)) {
        newCourse.students = filtered;
      } else if (Array.isArray(newCourse.alumnos) || Array.isArray(newCourse.students)) {
      } else {
      }
      return newCourse;
    });

    if (changed) {
      _saveCoursesCollection(cleaned);
      return true;
    }
  } catch (e) {
    console.warn("removeStudent: error removing from courses key", e);
  }

  return false;
}