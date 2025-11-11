export function readAdmins() {
  try {
    const raw = localStorage.getItem("admins") || localStorage.getItem("administrativos");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAdmins(list) {
  try {
    localStorage.setItem("admins", JSON.stringify(list));
    localStorage.setItem("administrativos", JSON.stringify(list));
  } catch (e) {
    console.error("saveAdmins:", e);
  }
}

export function addAdmin({ nombres, apellidos, email, password }) {
  if (!nombres || !apellidos || !email || !password) {
    throw new Error("Todos los campos son obligatorios.");
  }
  const list = readAdmins();
  if (list.some(a => (a.email || "").toLowerCase() === email.toLowerCase())) {
    throw new Error("Ya existe un administrador con ese correo.");
  }
  const id = Date.now().toString(36);
  const newAdmin = {
    id,
    nombres,
    apellidos,
    nombre: `${nombres} ${apellidos}`.trim(),
    email,
    password,
    createdAt: new Date().toISOString()
  };
  list.push(newAdmin);
  saveAdmins(list);
  return newAdmin;
}

export function removeAdmin(identifier) {
  if (!identifier && identifier !== 0) return false;
  const list = readAdmins();
  const idOrEmail = String(identifier).trim().toLowerCase();
  const idx = list.findIndex(a => String(a.id) === idOrEmail || (a.email || "").toLowerCase() === idOrEmail);
  if (idx === -1) return false;
  list.splice(idx, 1);
  saveAdmins(list);
  return true;
}

export function getAdminById(id) {
  const list = readAdmins();
  return list.find(a => String(a.id) === String(id)) || null;
}