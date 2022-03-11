const { Router } = require("express");
const { check } = require("express-validator");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");
const {
  validateCategoryId,
  validateProductId,
} = require("../helpers/db.validators");
const {
  validateFields,
  validateJWT,
  validateAdminRole,
} = require("../middlewares");

const router = Router();

// crear producto - privado - usuario con token
router.post(
  "/",
  [
    validateJWT,
    check("name", "El nombre es obligatorio").notEmpty(),
    check("category", "No es un Id de Mongo").isMongoId(),
    check("category").custom(validateCategoryId),
    validateFields,
  ],
  createProduct
);

// obtener todas los productos - publico
router.get("/", getProducts);

// obtener un producto por id - publico
router.get(
  "/:id",
  [
    check("id", "No es in ID de mongo válido").isMongoId(),
    check("id").custom(validateProductId),
    validateFields,
  ],
  getProductById
);

// actualizar producto - privado - usuario con token
router.put(
  "/:id",
  [
    validateJWT,
    // check("category", "No es un Id de Mongo").isMongoId(),
    check("id").custom(validateProductId),
    validateFields,
  ],
  updateProduct
);

// borrar producto - admin
router.delete(
  "/:id",
  [
    validateJWT,
    validateAdminRole,
    check("id", "No es in ID de mongo válido").isMongoId(),
    check("id").custom(validateProductId),
    validateFields,
  ],
  deleteProduct
);

module.exports = router;
