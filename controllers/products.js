const { request, response } = require("express");
const { Product } = require("../models");

const createProduct = async (req = request, res = response) => {
  const { status, user, ...body } = req.body;

  const productDB = await Product.findOne({ name: body.name });

  if (productDB) {
    return res.status(400).json({
      message: `El producto ${name} ya existe`,
    });
  }

  const data = {
    ...body,
    name: body.name.toUpperCase(),
    user: req.user._id,
  };

  const product = new Product(data);
  await product.save();
  res.status(201).json(product);
};

const getProducts = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };

  const [total, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .populate("user", "name")
      .populate("category", "name")
      .skip(from)
      .limit(limit),
  ]);

  res.json({ total, products });
};

const getProductById = async (req = request, res = response) => {
  const { id } = req.params;
  const product = await Product.findById(id)
    .populate("user", "name")
    .populate("category", "name");
  res.json(product);
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { status, user, ...data } = req.body;

  if (data.nombre) data.nombre = data.nombre.toUpperCase();

  data.user = req.user._id;

  const newProduct = await Product.findByIdAndUpdate(id, data, { new: true });
  res.json(newProduct);
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const removedProduct = await Product.findByIdAndUpdate(
    id,
    { status: false },
    { new: true }
  );
  res.json(removedProduct);
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
