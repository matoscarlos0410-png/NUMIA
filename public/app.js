let usuario =
  localStorage.getItem("numia_nombre") || "";

let nivel =
  localStorage.getItem("numia_nivel")
  || "Principiante";

let materia =
  localStorage.getItem("numia_materia")
  || "Automático";

let historial =
  JSON.parse(
    localStorage.getItem("numia_historial")
    || "[]"
  );


/* ==========================
   SALUDO
========================== */

function actualizarSaludo() {

  const saludo =
    document.getElementById("saludo");

  if (usuario) {

    saludo.textContent =
      `👋 Hola ${usuario}, ¿qué quieres aprender hoy?`;

  } else {

    saludo.textContent =
      "👋 ¡Hola! Soy NUMIA.";

  }
}


/* ==========================
   NOMBRE
========================== */

function guardarNombre() {

  const input =
    document.getElementById("nombre");

  const nombre =
    input.value.trim();

  if (!nombre) {

    alert("Escribe tu nombre.");

    return;
  }

  usuario = nombre;

  localStorage.setItem(
    "numia_nombre",
    usuario
  );

  actualizarSaludo();

}


/* ==========================
   MATERIA
========================== */

function seleccionarMateria(
  boton,
  nuevaMateria
) {

  materia = nuevaMateria;

  localStorage.setItem(
    "numia_materia",
    materia
  );

  document
    .querySelectorAll(".subject")
    .forEach(btn => {

      btn.classList.remove("active");

    });

  boton.classList.add("active");
}


/* ==========================
   NIVEL
========================== */

function seleccionarNivel(
  boton,
  nuevoNivel
) {

  nivel = nuevoNivel;

  localStorage.setItem(
    "numia_nivel",
    nivel
  );

  document
    .querySelectorAll(".level")
    .forEach(btn => {

      btn.classList.remove("active");

    });

  boton.classList.add("active");
}


/* ==========================
   EJEMPLOS
========================== */

function usarEjemplo(texto) {

  document
    .getElementById("pregunta")
    .value = texto;

  preguntar();
}


/* ==========================
   PREGUNTAR
========================== */

async function preguntar() {

  const input =
    document.getElementById("pregunta");

  const respuesta =
    document.getElementById("respuesta");

  const pregunta =
    input.value.trim();


  if (!pregunta) {

    respuesta.textContent =
      "✏️ Escribe una pregunta primero.";

    return;
  }


  respuesta.className =
    "answer loading";

  respuesta.textContent =
    "🤖 NUMIA está pensando...\n\n" +
    "Estoy preparando tu respuesta.";


  try {

    const response =
      await fetch(
        "/api/chat",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            message: pregunta,

            level: nivel,

            userName:
              usuario || "Estudiante",

            subject: materia

          })

        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.error ||
        "No se pudo obtener una respuesta."
      );

    }


    respuesta.className =
      "answer";

    respuesta.textContent =
      data.answer;


    guardarHistorial(
      pregunta,
      data.answer
    );


  } catch (error) {

    respuesta.className =
      "answer";

    respuesta.textContent =
      "❌ " +
      error.message;

  }

}


/* ==========================
   HISTORIAL
========================== */

function guardarHistorial(
  pregunta,
  respuesta
) {

  historial.unshift({

    pregunta: pregunta,

    respuesta: respuesta,

    fecha:
      new Date()
        .toLocaleString()

  });


  if (historial.length > 30) {

    historial =
      historial.slice(0, 30);

  }


  localStorage.setItem(
    "numia_historial",
    JSON.stringify(historial)
  );


  mostrarHistorial();
}


function mostrarHistorial() {

  const contenedor =
    document.getElementById(
      "historial"
    );


  if (!historial.length) {

    contenedor.textContent =
      "No hay conversaciones todavía.";

    return;
  }


  contenedor.innerHTML =
    historial.map(item => {

      return `

        <div class="history-item">

          <div class="history-question">
            ${escapar(item.pregunta)}
          </div>

          <div class="history-date">
            ${escapar(item.fecha)}
          </div>

        </div>

      `;

    }).join("");
}


/* ==========================
   BORRAR HISTORIAL
========================== */

function borrarHistorial() {

  historial = [];

  localStorage.removeItem(
    "numia_historial"
  );

  mostrarHistorial();
}


/* ==========================
   LIMPIAR PREGUNTA
========================== */

function limpiarPregunta() {

  document
    .getElementById("pregunta")
    .value = "";

}


/* ==========================
   SEGURIDAD HTML
========================== */

function escapar(texto) {

  return String(texto)

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );
}


/* ==========================
   INICIO
========================== */

actualizarSaludo();

mostrarHistorial();
