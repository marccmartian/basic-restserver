const { request, response } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");

const getUsers = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const userfilter = { status: true };

  // const users = await User.find(userfilter).skip(from).limit(limit);
  // const total = await User.countDocuments(userfilter);

  // Si una promesa no tiene que ver con la otra
  // entonces puedes ejecutarlas al mismo tiempo, con Promise.all, es mas eficiente (rapido)
  const [total, users] = await Promise.all([
    User.countDocuments(userfilter),
    User.find(userfilter).skip(from).limit(limit),
  ]);

  res.json({ total, users });
};

// CREATE USER
const postUsers = async (req, res = response) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });

  // encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  // guardar en BD
  await user.save();

  res.json({
    user,
  });
};

// UPDATE USER
const putUsers = async (req, res = response) => {
  const { id } = req.params;
  // _id, pass, google, email no los voy a actualizar
  const { _id, password, google, email, ...rest } = req.body;

  // validar contra la BD
  if (password) {
    // encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(id, rest);

  res.json(updatedUser);
};

const patchUsers = (req, res = response) => {
  res.json({
    msg: "Patch api - controller",
  });
};

// DELETE USER
const deleteUsers = async (req, res = response) => {
  const { id } = req.params;

  // borrado fisico
  // const deletedUser = await User.findByIdAndDelete(id);

  // borrado lógico
  const deletedUser = await User.findByIdAndUpdate(id, { status: false });

  res.json(deletedUser);
};

module.exports = {
  getUsers,
  postUsers,
  putUsers,
  patchUsers,
  deleteUsers,
};
