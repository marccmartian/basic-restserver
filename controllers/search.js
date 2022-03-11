const { request, response } = require("express");
const { ObjectId } = require("mongoose").Types;
const { User, Category, Product } = require("../models");

const allowedColletions = ["users", "categories", "products", "roles"];

const searchUsers = async (term = "", res = response) => {
  const isMongoId = ObjectId.isValid(term);

  if (isMongoId) {
    const user = await User.findById(term);
    return res.json({ results: user ? [user] : [] });
  }

  // con esto le digo que el termino sea insensible a mayus o minus.
  // puedo cambiar el find por un count si solo quiero contar los resultados
  const regex = new RegExp(term, "i");
  const users = await User.find({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ status: true }],
  });

  res.json({ results: users });
};

const searchCategories = async (term = "", res = response) => {
  const isMongoId = ObjectId.isValid(term);

  if (isMongoId) {
    const category = await Category.findById(term);
    return res.json({ results: category ? [category] : [] });
  }

  const regex = new RegExp(term, "i");
  const categories = await Category.find({ name: regex, status: true });

  res.json({ results: categories });
};

const searchProducts = async (term = "", res = response) => {
  const isMongoId = ObjectId.isValid(term);

  if (isMongoId) {
    const product = await Product.findById(term).populate("category", "name");
    return res.json({ results: product ? [product] : [] });
  }

  const regex = new RegExp(term, "i");
  const products = await Product.find({ name: regex, status: true }).populate(
    "category",
    "name"
  );

  res.json({ results: products });
};

const search = (req = request, res = response) => {
  const { collection, term } = req.params;

  if (!allowedColletions.includes(collection)) {
    return res.status(400).json({
      message: `Las colleciones permitidas son: ${allowedColletions}`,
    });
  }

  switch (collection) {
    case "users":
      searchUsers(term, res);
      break;

    case "categories":
      searchCategories(term, res);
      break;

    case "products":
      searchProducts(term, res);
      break;

    default:
      res.status(500).json({
        message: "Se me olvidó hacer esta busqueda",
      });
      break;
  }
};

module.exports = {
  search,
};
