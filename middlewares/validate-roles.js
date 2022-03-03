const { request, response } = require("express");

// este valida SOLO si es ADMIN
const validateAdminRole = (req = request, res = response, next) => {
  // con esto garantizo que se haya ejecutado primero el middleware 'validateJWT'
  // como este middleware va despues, puedo acceder al usuario autenticado, que surge del middle 'validateJWT'
  if (!req.user) {
    return res.status(500).json({
      message: "Se quiere validar el rol sin validar el token primero",
    });
  }

  const { role, name } = req.user;

  if (role !== "ADMIN_ROLE") {
    return res.status(401).json({
      message: `${name} no es administrador - no tiene permiso`,
    });
  }

  next();
};

// este middleware es diferente, al ser llamado recibe argumentos (roles) y si no pasa retorna la respuesta
// este valida si el rol puede ser varios ADMIN o SALES, etc. es decir, cualquier otro rol que le pase como argumento
const validateOtherRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(500).json({
        message: "Se quiere validar el rol sin validar el token primero",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        message: `El servicio requiere uno de los roles ${roles}`,
      });
    }

    next();
  };
};

module.exports = {
  validateAdminRole,
  validateOtherRole,
};
