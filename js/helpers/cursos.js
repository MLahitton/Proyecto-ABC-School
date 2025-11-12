import { leerDato, guardarDato } from './storage.js';

export function getCursos() {
  return leerDato('cursos');
}

export function saveCursos(cursos) {
  guardarDato('cursos', cursos);
}

export function crearCurso({ codigo, nombre, descripcion, docente }) {
  const cursos = getCursos();
  const nuevoCurso = {
    id: Date.now().toString(),
    codigo,
    nombre,
    descripcion,
    docente,
    modulos: [],
    creado: new Date().toISOString()
  };
  cursos.push(nuevoCurso);
  saveCursos(cursos);
  return nuevoCurso;
}

export function editarCurso(id, cambios) {
  const cursos = getCursos();
  const idx = cursos.findIndex(c => c.id === id);
  if (idx === -1) return null;
  cursos[idx] = { ...cursos[idx], ...cambios };
  saveCursos(cursos);
  return cursos[idx];
}

export function eliminarCurso(id) {
  let cursos = getCursos();
  cursos = cursos.filter(c => c.id !== id);
  saveCursos(cursos);
}

export function agregarModulo(cursoId, { codigo, nombre, descripcion }) {
  const cursos = getCursos();
  const curso = cursos.find(c => c.id === cursoId);
  if (!curso) return null;
  const nuevoModulo = {
    id: Date.now().toString() + '-' + Math.floor(Math.random()*10000),
    codigo,
    nombre,
    descripcion,
    lecciones: []
  };
  curso.modulos.push(nuevoModulo);
  saveCursos(cursos);
  return nuevoModulo;
}

export function editarModulo(cursoId, moduloId, cambios) {
  const cursos = getCursos();
  const curso = cursos.find(c => c.id === cursoId);
  if (!curso) return null;
  const idx = curso.modulos.findIndex(m => m.id === moduloId);
  if (idx === -1) return null;
  curso.modulos[idx] = { ...curso.modulos[idx], ...cambios };
  saveCursos(cursos);
  return curso.modulos[idx];
}

export function eliminarModulo(cursoId, moduloId) {
  const cursos = getCursos();
  const curso = cursos.find(c => c.id === cursoId);
  if (!curso) return;
  curso.modulos = curso.modulos.filter(m => m.id !== moduloId);
  saveCursos(cursos);
}

export function agregarLeccion(cursoId, moduloId, { titulo, intensidad, contenido, multimedia }) {
  const cursos = getCursos();
  const curso = cursos.find(c => c.id === cursoId);
  if (!curso) return null;
  const modulo = curso.modulos.find(m => m.id === moduloId);
  if (!modulo) return null;
  const nuevaLeccion = {
    id: Date.now().toString() + '-' + Math.floor(Math.random()*10000),
    titulo,
    intensidad,
    contenido,
    multimedia: multimedia || []
  };
  modulo.lecciones.push(nuevaLeccion);
  saveCursos(cursos);
  return nuevaLeccion;
}

export function editarLeccion(cursoId, moduloId, leccionId, cambios) {
  const cursos = getCursos();
  const curso = cursos.find(c => c.id === cursoId);
  if (!curso) return null;
  const modulo = curso.modulos.find(m => m.id === moduloId);
  if (!modulo) return null;
  const idx = modulo.lecciones.findIndex(l => l.id === leccionId);
  if (idx === -1) return null;
  modulo.lecciones[idx] = { ...modulo.lecciones[idx], ...cambios };
  saveCursos(cursos);
  return modulo.lecciones[idx];
}

export function eliminarLeccion(cursoId, moduloId, leccionId) {
  const cursos = getCursos();
  const curso = cursos.find(c => c.id === cursoId);
  if (!curso) return;
  const modulo = curso.modulos.find(m => m.id === moduloId);
  if (!modulo) return;
  modulo.lecciones = modulo.lecciones.filter(l => l.id !== leccionId);
  saveCursos(cursos);
}