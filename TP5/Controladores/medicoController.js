const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const medicoBD = require("./../Modelos/medicoModel.js");

app.get("/", listarTodo);
app.get("/especialidad/:especialidad", getByEspecialidad);
app.post('/create', crear);
app.get('/matricula/:matricula', obtenerMedico);
app.delete("/:matricula", eliminarMedico);
app.put("/:matricula", modificarMedico);


function listarTodo(req, res) {
    medicos = medicoBD.metodos.getAll((err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(result);
        }
    }
    );
}

function getByEspecialidad(req, res) {
    especialidad = req.params.especialidad
    medicos = medicoBD.metodos.getByEspecialidad(especialidad, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(result);
        }
    }
    );
}

function crear(req, res) {
    medicoBD.metodos.crearMedico(req.body, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(result);
        }
    });
}

function obtenerMedico(req, res) {
    let matricula = req.params.matricula;
    medicoBD.metodos.getMedico(matricula, (err, result) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send(result)
            }
        }
    )};


function eliminarMedico(req, res) {
    medicoBD.metodos.deleteMedico(req.params.matricula, (err, result) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).send(result)
        }
    })
}

function modificarMedico(req, res) {
    datosMedico = req.body;
    deEsteMedico = req.params.matricula;
    medicoBD.metodos.update(datosMedico, deEsteMedico, (err, exito) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(exito) 
        }
    });
}


module.exports = app;