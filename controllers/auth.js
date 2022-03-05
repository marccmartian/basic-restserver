const { response } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // verificar si email existe
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User or Password wrong - email" });
    }

    // verifica si el usuario esta activo
    if (!user.status) {
      return res
        .status(400)
        .json({ message: "User or password wrong - status" });
    }

    // verifica la contraseña
    const validatedPassword = bcryptjs.compareSync(password, user.password);
    if (!validatedPassword) {
      return res
        .status(400)
        .json({ message: "User or password wrong - password" });
    }

    // Generar el JWT:
    // le paso solo la info que deseo que jwt encripte, aquí el ID del usuario
    // El payload de mi jwt solo almacena la info del ID, y por default, la fecha de creacion y expirar del token
    const token = await generateJWT(user.id);

    res.json({ message: "Login success", user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { name, email, img } = await googleVerify(id_token);

    let user = await User.findOne({ email });

    // si no existe el usuario tengo que crearlo
    if (!user) {
      const data = {
        name,
        email,
        password: ";P",
        img,
        role: "USER_ROLE",
        google: true,
      };
      user = new User(data);
      await user.save();
    }

    // si el usuario esta inactivo
    if (!user.status) {
      return res.status(401).json({
        message: "Hable con el administrador, usuario bloqueado",
      });
    }

    //generar el JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: "El token no se pudo verificar",
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
