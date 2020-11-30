const express = require('express');

//Libreria para encriptar
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

//Importa el modelo de Mongoose
const Usuario = require('../models/usuario');

const app = express();

app.post('/login', (req, res) => {

    let body = req.body;


    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err){
           return res.status('500').json({
               ok:false,
               err
           })
        }

        if(!usuarioDB){
            return res.status('400').json({
                ok:false,
                message:'!Usuario o contraseña incorrectos'
            })
        }
     
        if(!bcrypt.compareSync( body.password , usuarioDB.password )){
            return res.status('400').json({
                ok:false,
                message:'Usuario o !contraseña incorrectos'
            });
        }

        //Genera el token con la semilla y la caducidad de las variables de entorno
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED , { expiresIn: process.env.CADUCIDAD_TOKEN});

        //Devuelve el usuario
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });


})


module.exports = app;