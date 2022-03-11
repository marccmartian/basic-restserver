const { request, response } = require("express");
const { Category } = require("../models");

const createCategory = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase();

  const categoryDB = await Category.findOne({ name });

  if (categoryDB) {
    return res.status(400).json({
      message: `La categoría ${name} ya existe`,
    });
  }

  // data a enviar
  const data = {
    name,
    user: req.user._id, // el usuario viene del JWT - ya validado por su middleware
  };

  const category = new Category(data);
  await category.save(); // guarda en la BD
  res.status(201).json(category);
};

const getCategories = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };

  const [total, categories] = await Promise.all([
    Category.countDocuments(query),
    // populate pasa la referencia del modelo user
    Category.find(query).populate("user", "name").skip(from).limit(limit),
  ]);

  res.json({ total, categories });
};

const getCategoryById = async (req = request, res = response) => {
  const { id } = req.params;
  const category = await Category.findById(id).populate("user", "name");
  res.json(category);
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { status, user, ...data } = req.body;

  data.name = data.name.toUpperCase();
  data.user = req.user._id;

  const newCategory = await Category.findByIdAndUpdate(id, data, { new: true });
  res.json(newCategory);
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const removedCategory = await Category.findByIdAndUpdate(
    id,
    { status: false },
    { new: true }
  );
  res.json(removedCategory);
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
