const mongoose = require("mongoose");

const dbConection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN);

    console.log("DataBase online!");
  } catch (error) {
    console.log(error);
    throw new Error("Run data base error");
  }
};

module.exports = {
  dbConection,
};
