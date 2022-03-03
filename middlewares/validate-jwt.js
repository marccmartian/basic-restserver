const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({ message: "No hay token en la petición" });
  }

  try {
    // necesitas una clave secreta (FIRMA) defenida por el desarrollador para poder devolver el payload del jwt
    // en el payload del token solo he pasdo la info del id, por eso lo destructuro
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // obtengo el usuario autenticado le paso el uid extraido del payload del token
    const authenticatedUser = await User.findById(uid);
    if (!authenticatedUser) {
      return res
        .status(401)
        .json({ message: "Token no válido - user no existe en BD" });
    }

    // verificar si el user.uid tiene estado true
    if (!authenticatedUser.status) {
      return res
        .status(401)
        .json({ message: "Token no válido - status: false" });
    }

    req.user = authenticatedUser;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Token no valido" });
  }
};

module.exports = {
  validateJWT,
};
