const { request, response } = require("express");

const getUsers = (req = request, res = response) => {
  const { q, name = "empty", apikey, page, limit } = req.query;

  res.json({
    msg: "Get api - controller",
    q,
    name,
    apikey,
    page,
    limit,
  });
};

const postUsers = (req, res = response) => {
  const { name, age } = req.body;

  res.json({
    msg: "Post api - controller",
    name,
    age,
  });
};

const putUsers = (req, res = response) => {
  const { id } = req.params;

  res.json({
    msg: "Put api - controller",
    id,
  });
};

const patchUsers = (req, res = response) => {
  res.json({
    msg: "Patch api - controller",
  });
};

const deleteUsers = (req, res = response) => {
  res.json({
    msg: "Delete api - controller",
  });
};

module.exports = {
  getUsers,
  postUsers,
  putUsers,
  patchUsers,
  deleteUsers,
};
