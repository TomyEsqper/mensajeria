const form = document.getElementById("formulario");
const boton = document.getElementById("enviar");
const estado = document.getElementById("estado");

function mostrar(tipo, texto) {
  estado.className = `estado ${tipo}`;
  estado.textContent = texto;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nombre = form.nombre.value.trim();
  const correo = form.correo.value.trim();
  const mensaje = form.mensaje.value.trim();

  if (!nombre || !correo || !mensaje) {
    mostrar("err", "Completa los tres campos.");
    return;
  }

  boton.disabled = true;
  mostrar("", "Enviando...");

  try {
    const respuesta = await fetch("/api/enviar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, correo, mensaje }),
    });
    const data = await respuesta.json().catch(() => ({}));

    if (!respuesta.ok) {
      throw new Error(data.error || "No se pudo enviar.");
    }

    form.reset();
    mostrar("ok", "Mensaje enviado.");
  } catch (error) {
    mostrar("err", error.message || "No se pudo enviar.");
  } finally {
    boton.disabled = false;
  }
});
