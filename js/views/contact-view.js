export function contactView() {
  return `
  <nav>
      <img src="assets/Logo.png" class="logo" alt="Logo">
      <div class="menu">
        <a href="#/home">Home</a>
        <a href="#/home-courses">Courses</a>
        <a href="#/home-trainers">Trainers</a>
        <a href="#/contact">Contact</a>
      </div>
    </nav>
    <main>
      <section>
        <h2>Contacto</h2>
        <p>¿Tienes alguna pregunta? Escríbenos usando el siguiente formulario.</p>

        <form id="contact-form">
          <label>
            Nombre completo
            <input name="fullname" type="text" placeholder="Tu nombre completo" required>
          </label>

          <label>
            Correo electrónico
            <input name="email" type="email" placeholder="tu@correo.com" required>
          </label>

          <label>
            Número de celular
            <input name="telefono" type="tel" placeholder="+57 300 0000000" required>
          </label>

          <div>
            <button type="submit" class="btn">
              Enviar
            </button>
            <button type="reset" class="btn">
              Limpiar
            </button>
          </div>
        </form>
      </section>
    </main>
  `;
}