const { query } = require('express');
var mysql = require('mysql');
const configuracion = require("./../config.json");
var connection = mysql.createConnection(configuracion.database)
 
 connection.connect(function(err) { 
    if(err){  
        console.log(err.sqlMessage);
    } else {
         console.log("conectado a la BD ingreso");
    }
 });


 var metodos = {}

//-----------------------------------CREAR INGRESO-----------------------------------
metodos.crearIngreso = function (datosIngreso, callback) {
    ingreso = [
        datosIngreso.id_ingreso,
        datosIngreso.fecha_ingreso,
        datosIngreso.nro_habitacion,
        datosIngreso.nro_cama,
        datosIngreso.observaciones,
        datosIngreso.nro_historial_paciente,
        datosIngreso.matricula_medico
    ];

    consulta = "INSERT INTO INGRESO (id_ingreso, fecha_ingreso, nro_habitacion, nro_cama, observaciones, nro_historial_paciente, matricula_medico) VALUES (?, ?, ?, ?, ?, ?, ?)";

    connection.query(consulta, ingreso, (err, rows) => {
        if (err) {
            if (err.code = "ER_DUP_ENTRY") {
                callback({
                    message: "Ya existe el ingreso nro " + datosIngreso.id_ingreso,
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
                message: "El ingreso " + datosIngreso.id_ingreso + " se registro correctamente",
                detail: rows,
            })
        }
    });
}


 //-------------------------------------LISTAR INGRESOS-------------------------------------
 metodos.getAll = function (callback) {
    consulta = "select i.id_ingreso, i.fecha_ingreso, i.nro_habitacion, i.nro_cama, i.observaciones, i.nro_historial_paciente, concat(p.apellido, ', ', p.nombre) as apeNomPaciente, i.matricula_medico, concat(m.apellido, ', ', m.nombre) as apeNomMedico from ingreso i inner join medico m on i.matricula_medico = m.matricula inner join paciente p on i.nro_historial_paciente = p.nro_historial_clinico";
    
    connection.query(consulta, function (err, resultados, fields) {
         if (err) {
             callback(err);
             return;
         } else {
             callback(undefined, {
                 messaje: "INGRESOS",
                 detail: resultados,
             });
         }
     });
 }

module.exports = { metodos }