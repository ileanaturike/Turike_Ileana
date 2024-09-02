const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const ingresoBD = require("./../Modelos/ingresoModel.js");

app.get("/", listarIngresos);
app.post('/create', crear);

function listarIngresos(req, res) {
    ingresoBD.metodos.getAll((err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(result);
        }
    }
    );
}


function crear(req, res) {
    ingreso = ingresoBD.metodos.crearIngreso(req.body, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(result);
        }
    });
}

module.exports = app;