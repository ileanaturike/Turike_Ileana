const express = require('express');
const app = express();
const morgan = require("morgan");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
morgan(":method :url :status :res[content-length] - :response-time ms");

const configuracion = require("./config.json");

app.use("/api/medico", require("./Controladores/medicoController.js"));
app.use("/api/paciente", require("./Controladores/pacienteController.js"));
app.use("/api/ingreso", require("./Controladores/ingresoController.js"));


app.listen(configuracion.server.port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Sevidor encendido y escuchando en el puerto " + configuracion.server.port);
  }
});