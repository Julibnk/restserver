const express = require('express');

//Importa el modelo de Mongoose
const Usuario = require('../models/usuario');

const app = express();

//Libreria para encriptar
const bcrypt = require("bcrypt");

//Libreria que amplia funcionalidades con objetos de JS
const _ = require("underscore");

app.get('/usuario', function (req, res) {
    console.log('get usuario');
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true}, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({ estado: true}, (err, cuantos) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos
                })
            })


        });

})

app.post('/usuario', function (req, res) {

    let body = req.body;

    // Instancia un objeto del esquema usuario
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

})

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

})


app.delete('/usuario/:id', function (req, res) {

    let id = req.params.id;

    let cambiarEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiarEstado, {
        new: true
    }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })

})

// Delete fisico
// app.delete('/usuario/:id', function (req, res) {

//     let id = req.params.id;

//     Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 err
//             })
//         }
//         if (!usuarioBorrado){
//             return res.status(400).json({
//                 ok: false,
//                 err: {
//                     message: 'Usuario no encontrado'
//                 }
//             })
//         }
//         res.json({
//             ok: true,
//             usuarioBorrado
//         })
//     })

// })


module.exports = app;