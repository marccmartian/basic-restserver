const { Router } = require("express");
const { check } = require("express-validator");
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories");
const { validateCategoryId } = require("../helpers/db.validators");
const {
  validateFields,
  validateJWT,
  validateAdminRole,
} = require("../middlewares");

const router = Router();

// crear categoria - privado - usuario con token
router.post(
  "/",
  [
    validateJWT,
    check("name", "El nombre es obligatorio").notEmpty(),
    validateFields,
  ],
  createCategory
);

// obtener todas las categorias - publico
router.get("/", getCategories);

// obtener una categoria por id - publico
router.get(
  "/:id",
  [
    check("id", "No es in ID de mongo válido").isMongoId(),
    check("id").custom(validateCategoryId),
    validateFields,
  ],
  getCategoryById
);

// actualizar categoria - privado - usuario con token
router.put(
  "/:id",
  [
    validateJWT,
    check("name", "El nombre es obligatoria").notEmpty(),
    check("id").custom(validateCategoryId),
    validateFields,
  ],
  updateCategory
);

// borrar categoria - admin
router.delete(
  "/:id",
  [
    validateJWT,
    validateAdminRole,
    check("id", "No es in ID de mongo válido").isMongoId(),
    check("id").custom(validateCategoryId),
    validateFields,
  ],
  deleteCategory
);

module.exports = router;
