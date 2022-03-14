const { response } = require("express");

const validateFile = (req, res = response, next) => {
  // codigo sacado de un ejemplo de la doc
  // console.log(req.files);  // inspecciona las propiedades de cada 'archivo' a subir
  // 'archivo' es el nombre del key que le di en postman. body / 'form-data'

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    return res
      .status(400)
      .json({ message: "No hay archivos que subir - validateFile" });
  }

  next();
};

module.exports = {
  validateFile,
};
