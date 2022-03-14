const { Router } = require("express");
const { check } = require("express-validator");
const {
  uploadFile,
  updateImage,
  displayImage,
  updateImageCloudinary,
} = require("../controllers/uploads");
const { allowedCollections } = require("../helpers");
const { validateFile } = require("../middlewares");
const { validateFields } = require("../middlewares/validate-fields");

const router = Router();

// el post es para crear algo nuevo, sea un archivo
router.post("/", validateFile, uploadFile);

// actualizar imagen - voy a usar lar carga a cloudinary
// router.put(
//   "/:collection/:id",
//   [
//     validateFile,
//     check("id", "El id debe ser de Mongo").isMongoId(),
//     check("collection").custom((c) =>
//       allowedCollections(c, ["users", "products"])
//     ),
//     validateFields,
//   ],
//   updateImage
// );

router.put(
  "/:collection/:id",
  [
    validateFile,
    check("id", "El id debe ser de Mongo").isMongoId(),
    check("collection").custom((c) =>
      allowedCollections(c, ["users", "products"])
    ),
    validateFields,
  ],
  updateImageCloudinary
);

// mostrar imagen
router.get(
  "/:collection/:id",
  [
    check("id", "El id debe ser de Mongo").isMongoId(),
    check("collection").custom((c) =>
      allowedCollections(c, ["users", "products"])
    ),
    validateFields,
  ],
  displayImage
);

module.exports = router;
