function readCollection(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn(`Error leyendo ${key} desde localStorage:`, e);
    return [];
  }
}

function writeCollection(key, arr) {
  try {
    localStorage.setItem(key, JSON.stringify(arr));
  } catch (e) {
    console.error(`Error guardando ${key} en localStorage:`, e);
  }
}

export function readCourses() {
  return readCollection("courses").length ? readCollection("courses") : readCollection("cursos");
}

export function saveCourses(courses) {
  writeCollection("courses", courses);
  writeCollection("cursos", courses);
}


export function generateCourseId(nombre = "") {
  const slug = String(nombre || "curso")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .slice(0, 40) || "curso";
 
  return `c_${slug}`;
}


export function addCourse(course = {}) {
  const courses = readCourses();
  const id = course.id || generateCourseId(course.nombre || course.name || "curso");
  if (courses.some(c => c.id === id)) {
    throw new Error("Ya existe un curso con ese id");
  }

  const newCourse = {
    id,
    nombre: course.nombre || course.name || "Curso sin nombre",
    teacherId: course.teacherId || null,
    studentIds: Array.isArray(course.studentIds) ? course.studentIds.slice() : [],
    modules: Array.isArray(course.modules) ? course.modules.slice() : (Array.isArray(course.modulos) ? course.modulos.slice() : []),
    createdAt: new Date().toISOString(),
    ...course
  };

  courses.push(newCourse);
  saveCourses(courses);
  return newCourse;
}


export function updateCourse(id, patch = {}) {
  const courses = readCourses();
  const idx = courses.findIndex(c => c.id === id);
  if (idx === -1) return null;
  courses[idx] = { ...courses[idx], ...patch };
  saveCourses(courses);
  return courses[idx];
}


export function removeCourse(id) {
  let courses = readCourses();
  const before = courses.length;
  courses = courses.filter(c => c.id !== id);
  saveCourses(courses);
  return courses.length < before;
}


export function enrollStudentToCourse(courseId, studentId) {
  const courses = readCourses();
  const idx = courses.findIndex(c => c.id === courseId);
  if (idx === -1) return null;
  const ids = courses[idx].studentIds || [];
  if (!ids.includes(studentId)) {
    ids.push(studentId);
    courses[idx].studentIds = ids;
    saveCourses(courses);
  }
  return courses[idx];
}


export function removeStudentFromCourse(courseId, studentId) {
  const courses = readCourses();
  const idx = courses.findIndex(c => c.id === courseId);
  if (idx === -1) return null;
  courses[idx].studentIds = (courses[idx].studentIds || []).filter(id => id !== studentId);
  saveCourses(courses);
  return courses[idx];
}


export function assignTeacherToCourse(courseId, teacherId) {
  return updateCourse(courseId, { teacherId });
}


export function getCourseById(courseId) {
  const courses = readCourses();
  return courses.find(c => c.id === courseId) || null;
}


export function getCourseDetails(courseId) {
  const course = getCourseById(courseId);
  if (!course) return null;

  const rawTeachers = readCollection("teachers").length ? readCollection("teachers") : readCollection("profesores");
  const rawStudents = readCollection("students").length ? readCollection("students") : readCollection("alumnos");

  const teacher = Array.isArray(rawTeachers) ? rawTeachers.find(t => t.id === course.teacherId) || null : null;
  const students = Array.isArray(rawStudents)
    ? (course.studentIds || []).map(id => rawStudents.find(s => s.id === id)).filter(Boolean)
    : [];

  return {
    ...course,
    teacher,
    students,
    studentCount: (course.studentIds || []).length
  };
}

