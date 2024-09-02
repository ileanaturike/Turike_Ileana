const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const pacienteBD = require("./../Modelos/pacienteModel.js");

app.get("/", listarTodo);
app.get("/nss/:nss", getPaciente);
app.post('/create', crearPaciente);
app.delete("/:nro_historial_clinico", eliminarPaciente);
app.put("/:nro_historial_clinico", modificarPaciente);


function listarTodo(req, res) {
    pacientes = pacienteBD.metodos.getAll((err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(result);
        }
    }
    );
}

function getPaciente(req, res) {
    nss = req.params.nss;
    pacientes = pacienteBD.metodos.getPaciente(nss, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(result);
        }
    }
    );
}

function crearPaciente(req, res) {
    pacienteBD.metodos.crearPaciente(req.body, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(result);
        }
    });
}

function eliminarPaciente(req, res) {
    pacienteBD.metodos.deletePaciente(req.params.nro_historial_clinico, (err, result) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).send(result)
        }
    })
}

function modificarPaciente(req, res) {
    datosPaciente = req.body;
    deEstePaciente = req.params.nro_historial_clinico;
    pacienteBD.metodos.update(datosPaciente, deEstePaciente, (err, exito) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(exito) 
        }
    });
}


module.exports = app;