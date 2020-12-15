const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

app.use(fileUpload({
  useTempFiles: true
}));



app.put('/upload/:tipo/:id', function (req, res) {


  let tipo = req.params.tipo;
  let id = req.params.id;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'No se ha seleccionado ningun archivo'
      }
    });
  }

  // Validar tipo 
  let tiposValidos = ['productos', 'usuarios'];

  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'Los tipos validos son ' + tiposValidos.join(', '),
        tipo: tipo
      }
    })
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let archivo = req.files.archivo;
  let filename = archivo.name.split('.');
  let extension = filename[filename.length - 1];
  let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

  if (extensionesValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'Las extensiones validas son ' + extensionesValidas.join(', '),
        extension: extension
      }
    })
  }

  //Cambiar nombre del archivo
  let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

  // Use the mv() method to place the file somewhere on your server
  archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
    if (err)
      return res.status(500).json({
        ok: false,
        err
      });

    switch (tipo) {
      case 'usuarios':
        imagenUsuario(id, res, nombreArchivo);
        break;

      case 'productos':
        imagenProducto(id, res, nombreArchivo);
        break;

      default:
        break;
    }


  });
});

function imagenUsuario(id, res, nombreArchivo) {

  Usuario.findById(id, (err, usuarioDB) => {

    if (err) {
      borrarFichero('usuarios', nombreArchivo);
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!usuarioDB) {
      borrarFichero('usuarios', nombreArchivo);
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El usuario no existe'
        }
      });
    }

    borrarFichero('usuarios', usuarioDB.img);


    usuarioDB.img = nombreArchivo;

    usuarioDB.save((err, usuarioGuardado) => {
      res.json({
        ok: true,
        usuario: usuarioGuardado,
        img: nombreArchivo
      });
    })
  })
}

function imagenProducto(id, res, nombreArchivo) {

  Producto.findById(id, (err, productoDB) => {

    if (err) {
      borrarFichero('productos', nombreArchivo);
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!productoDB) {
      borrarFichero('productos', nombreArchivo);
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El producto no existe'
        }
      });
    }

    borrarFichero('productos', productoDB.img);


    productoDB.img = nombreArchivo;

    productoDB.save((err, productoGuardado) => {
      res.json({
        ok: true,
        producto: productoGuardado,
        img: nombreArchivo
      });
    })
  })

}

function borrarFichero(tipo, nombreImagen) {
  let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);
  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen);
  }

}


module.exports = app;