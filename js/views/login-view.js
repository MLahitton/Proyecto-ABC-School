export function loginView() {
  return `
    <section class="login-section">
      <h2>Iniciar sesión como administrador</h2>
      <form id="login-form" autocomplete="off">
        <label>Usuario:</label>
        <input name="usuario" required>
        <label>Contraseña:</label>
        <input type="password" name="password" required>
        <button type="submit">Ingresar</button>
      </form>
      <div id="login-error" style="color:red;display:none;">Usuario o contraseña incorrectos</div>
    </section>
  `;
}