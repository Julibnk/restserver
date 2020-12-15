const express = require('express');
const _ = require("underscore");

let {
    verificaToken,
    verificaAdmin_Role
} = require('../middlewares/autenticacion');
const categoria = require('../models/categoria');

let app = express();
const Categoria = require('../models/categoria');

// Recuperar todas las categorias
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
    .sort('descripcion')
    .populate('usuario' , 'nombre email')
    .exec((err, categorias) => {
        if (err) {
            // throw err
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(200).json({
            ok: true,
            categorias
        });
    });

});

// Recuperar una categoria
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'No se ha encontrado la categoria'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });


    });

});

// Crear una categria
app.post('/categoria', [verificaToken, verificaAdmin_Role], (req, res) => {

    let body = req.body;
    let usuario = req.usuario;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se ha creado la categoria'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

});

// Actualizar una categoria
app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    let body = _.pick(req.body, 'descripcion');

    console.log(req.body);
    console.log(id);

    Categoria.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
            context: 'query'
        },
        (err, categoriaDB) => {
            if (err) {
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'Categoria no encontrada'
                    }
                });
            }

            res.json({
                ok: true,
                categoria: categoriaDB
            });
        })
})

// Solo admin, delete fisico
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error al eliminar la categoria'
                }
            })
        }

        if (!categoriaBorrada) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'No se ha encontrado la categoria'
                }
            })
        }

        res.json({
            ok: true,
            categoriaBorrada
        })
    })
})

module.exports = app;