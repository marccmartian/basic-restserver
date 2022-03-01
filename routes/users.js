const { Router } = require("express");
const { check } = require("express-validator");
const {
  getUsers,
  putUsers,
  postUsers,
  deleteUsers,
  patchUsers,
} = require("../controllers/users");
const {
  validateRole,
  validateEmail,
  validateID,
} = require("../helpers/db.validators");
const { validateFields } = require("../middlewares/validate-fields");

const router = Router();

router.get("/", getUsers);

// cuando hay tres parametros en un peticion, el segundo si son varios es un array de middlewares
// en este caso las middlewares (validaciones) de express-validator
// el primer parametro es la propiedad del objeto que envias en string
router.post(
  "/",
  [
    check("email", "El email no es valido").isEmail(),
    check("email").custom(validateEmail),
    check("name", "El nombre es obligatorio").notEmpty(),
    check("password", "Password debe ser de 5 letras").isLength({ min: 5 }),
    // check("role", "No es un rol válido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    // check("role").custom((role) => isValidateRole(role)), // es lo mismo que la siguiente linea
    check("role").custom(validateRole),
    validateFields,
  ],
  postUsers
);

router.put(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(validateID),
    check("role").custom(validateRole),
    validateFields,
  ],
  putUsers
);

router.delete(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(validateID),
    validateFields,
  ],
  deleteUsers
);

router.patch("/", patchUsers);

module.exports = router;
