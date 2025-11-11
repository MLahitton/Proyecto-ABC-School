export function readAdmins() {
  try {
    const raw = localStorage.getItem("admins")
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("readAdmins: error leyendo admins desde localStorage", err);
    return [];
  }
}

export function saveAdmins(list) {
  try {
    const arr = Array.isArray(list) ? list : [];
    localStorage.setItem("admins", JSON.stringify(arr));
    return true;
  } catch (err) {
    console.error("saveAdmins: error guardando admins en localStorage", err);
    return false;
  }
}

function generateId() {
  return Date.now().toString(36);
}

function isValidEmail(email) {
  return typeof email === "string" && /\S+@\S+\.\S+/.test(email);
}

export function addAdmin({ nombres, apellidos, email, password }) {
  nombres = (nombres || "").trim();
  apellidos = (apellidos || "").trim();
  email = (email || "").trim().toLowerCase();
  password = password || "";

  if (!nombres || !apellidos || !email || !password) {
    throw new Error("Todos los campos (nombres, apellidos, email, password) son obligatorios.");
  }
  if (!isValidEmail(email)) {
    throw new Error("El email no tiene un formato válido.");
  }

  const list = readAdmins();
  if (list.some(a => (a.email || "").toLowerCase() === email)) {
    throw new Error("Ya existe un administrador con ese correo.");
  }

  const id = generateId();
  const newAdmin = {
    id,
    nombres,
    apellidos,
    nombre: `${nombres} ${apellidos}`.trim(),
    email,
    password: String(password),
  };

  list.push(newAdmin);
  saveAdmins(list);
  return newAdmin;
}

export function removeAdmin(identifier) {
  if (!identifier && identifier !== 0) return false;
  const target = String(identifier).trim().toLowerCase();
  const list = readAdmins();
  const idx = list.findIndex(a => String(a.id).toLowerCase() === target || (a.email || "").toLowerCase() === target);
  if (idx === -1) return false;
  list.splice(idx, 1);
  saveAdmins(list);
  return true;
}

export function getAdminById(id) {
  if (!id && id !== 0) return null;
  const list = readAdmins();
  return list.find(a => String(a.id) === String(id)) || null;
}

export function updateAdmin(id, data = {}) {
  const list = readAdmins();
  const idx = list.findIndex(a => String(a.id) === String(id));
  if (idx === -1) return null;

  const allowed = ["nombres", "apellidos", "email", "password"];
  allowed.forEach(k => {
    if (Object.prototype.hasOwnProperty.call(data, k) && data[k] !== undefined) {
      if (k === "email") {
        const newEmail = String(data[k]).trim().toLowerCase();
        if (!isValidEmail(newEmail)) {
          throw new Error("El email no tiene un formato válido.");
        }
        const conflict = list.find((a, i) => i !== idx && (a.email || "").toLowerCase() === newEmail);
        if (conflict) throw new Error("Otro administrador ya usa ese correo.");
        list[idx][k] = newEmail;
      } else {
        list[idx][k] = data[k];
      }
    }
  });

  list[idx].nombre = `${list[idx].nombres || ""} ${list[idx].apellidos || ""}`.trim();
  saveAdmins(list);
  return list[idx];
}