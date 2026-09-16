const DESTINO = "tomyesqper@gmail.com";
const CORREO_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const form = document.getElementById("formulario");
const boton = document.getElementById("enviar");
const estado = document.getElementById("estado");

function mostrar(tipo, texto) {
  estado.className = tipo ? `estado ${tipo}` : "estado";
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

  if (!CORREO_RE.test(correo)) {
    mostrar("err", "El correo no es válido.");
    return;
  }

  if (DESTINO === "tu-correo@ejemplo.com") {
    mostrar("err", "Pon tu correo en DESTINO, dentro de app.js.");
    return;
  }

  boton.disabled = true;
  mostrar("", "Enviando...");

  try {
    const respuesta = await fetch(
      `https://formsubmit.co/ajax/${encodeURIComponent(DESTINO)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          nombre,
          correo,
          mensaje,
          _replyto: correo,
          _subject: `Mensaje de ${nombre}`,
          _template: "table",
          _captcha: "false",
        }),
      }
    );

    const data = await respuesta.json().catch(() => ({}));

    if (!respuesta.ok || data.success === "false") {
      throw new Error(data.message || "No se pudo enviar.");
    }

    form.reset();
    mostrar("ok", "Mensaje enviado.");
  } catch (error) {
    mostrar("err", error.message || "No se pudo enviar.");
  } finally {
    boton.disabled = false;
  }
});
