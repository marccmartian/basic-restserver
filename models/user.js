const { model, Schema } = require("mongoose");

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, "The name is required"],
  },
  email: {
    type: String,
    required: [true, "The email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "The password is required"],
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: ["ADMIN_ROLE", "USER_ROLE"],
  },
  status: {
    type: Boolean,
    default: true,
  },
  // me indica si fue creado por google
  google: {
    type: Boolean,
    default: false,
  },
});

// este metodo quita las propiedades '__v' (version) y 'password' de la respuesta del postUser (crear usuario)
// el '...user' hace referencia a las propiedades del objeto actual (user)
UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject(); // la propiedades --v y password las voy a quitar
  user.uid = _id; // la respuesta tambien me trae _id se la cambio por uid
  return user; // aqui me quedo con todo el objeto menos las propiedad __v y password
};

module.exports = model("User", UserSchema);
