const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { request, response } = require("express");
const { uploadFileValidate } = require("../helpers");
const { User, Product } = require("../models");

const uploadFile = async (req = request, res = response) => {
  try {
    // const name = await uploadFileValidate(req.files, ["txt", "md"], "textos");
    const name = await uploadFileValidate(req.files, undefined, "images");

    res.json({ name });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const updateImage = async (req, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          message: `No existe el usuario con el id ${id}`,
        });
      }
      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          message: `No existe el producto con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "se me olvidó validar esto" });
  }

  // limpiar imagenes previas
  if (model.img) {
    const pathImage = path.join(__dirname, "../uploads", collection, model.img);
    if (fs.existsSync(pathImage)) {
      fs.unlinkSync(pathImage);
    }
  }

  const name = await uploadFileValidate(req.files, undefined, collection);
  model.img = name;

  await model.save();

  res.json(model);
};

const displayImage = async (req, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          message: `No existe el usuario con el id ${id}`,
        });
      }
      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          message: `No existe el producto con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "se me olvidó validar esto" });
  }

  // mostrar imagen
  if (model.img) {
    const pathImage = path.join(__dirname, "../uploads", collection, model.img);
    if (fs.existsSync(pathImage)) {
      return res.sendFile(pathImage);
    }
  }

  const pathImage = path.join(__dirname, "../assets/no-image.jpg");
  return res.sendFile(pathImage);

  // res.json({ message: "falta place holder" });
};

// CLOUDINARY
const updateImageCloudinary = async (req, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          message: `No existe el usuario con el id ${id}`,
        });
      }
      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          message: `No existe el producto con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "se me olvidó validar esto" });
  }

  // limpiar imagenes previas
  if (model.img) {
    const nameArr = model.img.split("/");
    const name = nameArr[nameArr.length - 1];
    const [public_id] = name.split(".");
    cloudinary.uploader.destroy(public_id);
  }

  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

  model.img = secure_url;

  await model.save();

  res.json(model);
};

module.exports = {
  uploadFile,
  updateImage,
  displayImage,
  updateImageCloudinary,
};
