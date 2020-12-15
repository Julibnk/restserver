const express = require('express');
const _ = require('underscore');
const {
    verificaToken
} = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');
let Categoria = require('../models/categoria');


// Buscar productos
app.get('/productos/buscar/:termino' , verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i'); // 'i' hace que no sea case sensitive

    Producto.find({nombre:regex})
        .populate('categoria', 'nombre')
        .exec((err, productos) => {


            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se han encontrado productos'
                    }
                });
            }

            res.json({
                ok: true, 
                productos
            });

        });

});

// Get productos
app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;

    // Producto.find
    //Trae todos los productos
    //Con el usuario y categoria
    //Paginado 

    Producto.find({
            disponible: true
        })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'email nombre')
        .populate('categoria', 'descripcion')
        .exec((err, productosDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se han encontrado productos'
                    }
                })
            }

            if (!productosDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se han encontrado productos'
                    }
                })
            }

            res.json({
                ok: true,
                productosDB
            })

        });

});

// Get productos por id
app.get('/producto/:id', verificaToken, (req, res) => {


    let id = req.params.id;


    Producto.findOne({
            _id: id,
            disponible: true
        }, (err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                })
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                })
            }
            res.json({
                ok: true,
                productoDB

            })
        }).populate('usuario', ' email nombre')
        .populate('categoria', 'descripcion');

});

// Crear un producto
app.post('/producto', verificaToken, (req, res) => {

    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion']);

    body.usuario = req.usuario._id;
    // console.log(req.body.categoria);

    Categoria.findOne({
        'descripcion': req.body.categoria
    }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        console.log(categoriaDB);

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se ha encontrado la categoria'
                }
            });
        }

        body.categoria = categoriaDB._id;

        let producto = new Producto({
            nombre: body.nombre,
            precioUni: body.precioUni,
            descripcion: body.descripcion,
            usuario: body.usuario,
            categoria: body.categoria
        });

        producto.save((err, productoCreado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productoCreado) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productoCreado
            })
        })
    });

});

// Actualizar un producto
app.put('/producto/:id', verificaToken, (req, res) => {
    //Modificar el producto

    let id = req.params.id;

    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion']);

    Producto.findByIdAndUpdate(id, body, {
        new: true, runValidators: true
    }, (err, productoModificado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!productoModificado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            productoModificado
        });


    });


});

// Actualizar un producto
app.delete('/producto/:id', verificaToken, (req, res) => {
    //Borra un producto
    //Borrado logico
    let id = req.params.id;

    let productoUpdate = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, productoUpdate, {
        new: true
    }, (err, productoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            productoBorrado

        });
    });

});



module.exports = app;