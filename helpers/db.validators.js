const { Product, Category, Role, User } = require("../models");

// Users validator
const validateRole = async (role = "") => {
  const existsRole = await Role.findOne({ role });
  if (!existsRole)
    throw new Error(`El rol ${role} no está registrado en la BD`);
};

const validateEmail = async (email = "") => {
  const existsEmail = await User.findOne({ email });
  if (existsEmail) throw new Error(`El correo ${email} ya existe`);
};

const validateID = async (id) => {
  const existsId = await User.findById(id);
  if (!existsId) throw new Error(`El id: ${id} no existe`);
};

// Categories Validators
const validateCategoryId = async (id) => {
  const existsId = await Category.findById(id);
  if (!existsId) throw new Error(`El id: ${id} no existe`);
};

// Products Validators
const validateProductId = async (id) => {
  const existsId = await Product.findById(id);
  if (!existsId) throw new Error(`El id: ${id} no existe`);
};

module.exports = {
  validateRole,
  validateEmail,
  validateID,
  validateCategoryId,
  validateProductId,
};
