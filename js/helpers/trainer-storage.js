export function readTeachers() {
  try {
    const raw = localStorage.getItem("teachers");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Error leyendo teachers desde localStorage:", e);
    return [];
  }
}

export function saveTeachers(teachers) {
  try {
    localStorage.setItem("teachers", JSON.stringify(teachers));
  } catch (e) {
    console.error("Error guardando teachers en localStorage:", e);
  }
}

export function generateTeacherId(nombres = "", documento = "") {
  const first = (nombres || "").trim().charAt(0).toUpperCase() || "T";
  const doc = String(documento || "").trim() || Date.now().toString(36);
  return `${first}${doc}`;
}

function _normalizeTeacherInput(obj = {}) {
  const nombres = (obj.nombres || obj.nombre || obj.name || "").trim();
  const apellidos = (obj.apellidos || obj.apellido || "").trim();
  const documento = (obj.documento || obj.document || "").trim();
  const email = (obj.email || obj.correo || obj.correoElectronico || "").trim();
  const telefono = (obj.telefono || obj.phone || obj.telefonoCelular || "").trim();
  const especialidad = (obj.especialidad || obj.specialty || "").trim();
  const bio = (obj.bio || obj.descripcion || "").trim();
  const nombreCompleto = [nombres, apellidos].filter(Boolean).join(" ").trim() || obj.nombre || obj.name || "";
  return { nombres, apellidos, documento, email, telefono, especialidad, bio, nombreCompleto };
}

export function addTeacher(teacher) {
  const teachers = readTeachers();
  const normalized = _normalizeTeacherInput(teacher);
  const id = teacher.id || generateTeacherId(normalized.nombres || normalized.nombreCompleto, normalized.documento);
  if (teachers.some(t => String(t.id) === String(id))) {
    throw new Error("Ya existe un docente con ese id");
  }
  const newTeacher = {
    id,
    nombre: normalized.nombreCompleto,
    nombres: normalized.nombres,
    apellidos: normalized.apellidos,
    documento: normalized.documento,
    email: normalized.email,
    telefono: normalized.telefono,
    especialidad: normalized.especialidad,
    bio: normalized.bio,
    createdAt: new Date().toISOString(),
    ...teacher
  };
  teachers.push(newTeacher);
  saveTeachers(teachers);
  return newTeacher;
}

export function updateTeacher(id, data) {
  const teachers = readTeachers();
  const idx = teachers.findIndex(t => String(t.id) === String(id));
  if (idx === -1) return null;
  const merged = { ...teachers[idx], ...data };
  const normalized = _normalizeTeacherInput(merged);
  merged.nombre = normalized.nombreCompleto || merged.nombre;
  merged.nombres = normalized.nombres || merged.nombres;
  merged.apellidos = normalized.apellidos || merged.apellidos;
  merged.documento = normalized.documento || merged.documento;
  merged.email = normalized.email || merged.email;
  merged.telefono = normalized.telefono || merged.telefono;
  merged.especialidad = normalized.especialidad || merged.especialidad;
  merged.bio = normalized.bio || merged.bio;
  teachers[idx] = merged;
  saveTeachers(teachers);
  return teachers[idx];
}

export function removeTeacher(identifier) {
  if (!identifier && identifier !== 0) return false;
  const idStr = String(identifier).trim().toLowerCase();
  try {
    const teachers = readTeachers();
    const idxById = teachers.findIndex(t => String(t.id).toLowerCase() === idStr);
    if (idxById !== -1) {
      teachers.splice(idxById, 1);
      saveTeachers(teachers);
      return true;
    }
    const idxByDoc = teachers.findIndex(t => String(t.documento || "").toLowerCase() === idStr);
    if (idxByDoc !== -1) {
      teachers.splice(idxByDoc, 1);
      saveTeachers(teachers);
      return true;
    }
    const idxByName = teachers.findIndex(t => (String(t.nombre || "")).toLowerCase() === idStr);
    if (idxByName !== -1) {
      teachers.splice(idxByName, 1);
      saveTeachers(teachers);
      return true;
    }
  } catch (e) {
    console.warn("removeTeacher error:", e);
  }
  return false;
}

export function getTeacherById(id) {
  if (!id && id !== 0) return null;
  const teachers = readTeachers();
  return teachers.find(t => String(t.id) === String(id)) || null;
}