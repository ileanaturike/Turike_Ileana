const { query } = require('express');
var mysql = require('mysql');

var configuracion = require('./../config.json');

var connection = mysql.createConnection(configuracion.database);
 
 connection.connect(function(err) { 
    if(err){  
        console.log(err.sqlMessage);
    } else {
         console.log("conectado a la BD paciente");
    }
 });



//------------------------------------------------------------------------------------
 var metodos = {}

//----------------------------------- CREAR PACIENTE ---------------------------------
metodos.crearPaciente = function (datosPaciente, callback) {
    paciente = [
        datosPaciente.nro_historial_clinico,
        datosPaciente.nss,
        datosPaciente.nombre,
        datosPaciente.apellido,
        datosPaciente.domicilio,
        datosPaciente.codigo_postal,
        datosPaciente.telefono,
        datosPaciente.observaciones
    ];

    consulta = "INSERT INTO PACIENTE (nro_historial_clinico, nss, nombre, apellido, domicilio, codigo_postal, telefono, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    connection.query(consulta, paciente, (err, rows) => {
        if (err) {
            if (err.code = "ER_DUP_ENTRY") {
                callback({
                    message: "Ya existe un paciente con el número de historia clínica " + datosPaciente.nro_historial_clinico,
                    detail: err.sqlMessage
                })
            } else {
                callback({
                    message: "Otro error que no conocemos",
                    detail: err.sqlMessage
                })
            }


        } else {
            callback(undefined, {
                message: "El paciente " + datosPaciente.nombre + " " + datosPaciente.apellido + " se registro correctamente.",
                detail: rows,
            })
        }
    });
}


 //------------------------------ LISTAR PACIENTES ------------------------------
 metodos.getAll = function (callback) {
    consulta = "select * from paciente";
     connection.query(consulta, function (err, resultados, fields) {
         if (err) {
             callback(err);
             return;
         } else {
             callback(undefined, {
                 messaje: "PACIENTES",
                 detail: resultados,
             });
         }
     });
 }


//-------------------------- OBTENER PACIENTES POR NSS --------------------------
metodos.getPaciente = function (nro_historial_clinico, callback) {
    consulta = "select * from paciente where nss = ?";

    connection.query(consulta, nss, function (err, resultados, fields) {
        if (err) {
            callback(err);
        } else {
            if (resultados.length == 0) {
                callback(undefined, "no se encontro un paciente con el NSS: " + nss)
            } else {
                callback(undefined, {
                    messaje: "Resultados de la consulta",
                    detail: resultados,
                });
            }
        }

    });
}


//---------------------------- MODIFICAR PACIENTE -----------------------------
metodos.update = function (datosPaciente, deTalPaciente, callback) {

    datos = [
        datosPaciente.nro_historial_clinico,
        datosPaciente.nss,
        datosPaciente.nombre,
        datosPaciente.apellido,
        datosPaciente.domicilio,
        datosPaciente.codigo_postal,
        datosPaciente.telefono,
        datosPaciente.observaciones,
        parseInt(deTalPaciente)
    ];
    consulta = "update paciente set  nro_historial_clinico = ?, nss = ?, nombre = ?, apellido = ?, domicilio = ?, codigo_postal = ?, telefono = ?, observaciones = ? WHERE nro_historial_clinico = ?";

    connection.query(consulta, datos, (err, rows) => {
        if (err) {
            callback(err);
        } else {

            if (rows.affectedRows == 0) {
                callback(undefined, {
                    message:
                        `no se encontro un paciente con el n° historia clinica: ${deTalPaciente}`,
                    detail: rows,
                })
            } else {
                callback(undefined, {
                    message:
                        `el paciente ${datosPaciente.nombre} ${datosPaciente.apellido} se actualizo correctamente`,
                    detail: rows,
                })
            }

        }
    });


}

//-------------------------------- ELIMINAR PACIENTE -------------------------------
metodos.deletePaciente = function (nro_historial_clinico, callback) {
    consulta = "delete from paciente where nro_historial_clinico = ?";
    connection.query(consulta, nro_historial_clinico, function (err, rows, fields) {
        if (err) {
            callback({
                message: "Ha ocurrido un error",
                detail: err,
            });
        }

        if (rows.affectedRows == 0) {
            callback(undefined, "No se encontro un paciente con el nro de historia clinica " + nro_historial_clinico);
        } else {
            callback(undefined, "El paciente " + nro_historial_clinico + " fue eliminado");
        }
    });
}

 module.exports = { metodos }