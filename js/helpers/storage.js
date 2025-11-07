// Lee datos desde localStorage. Si no existen retorna un array vacío.
export function leerDato(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

// Guarda datos en localStorage bajo la clave dada.
export function guardarDato(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}