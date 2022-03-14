const path = require("path"); // ya viene inluido en node
const { v4: uuidv4 } = require("uuid");

const uploadFileValidate = (
  files,
  validExtensions = ["png", "jpg", "jpeg", "gif"],
  folder = ""
) => {
  return new Promise((resolve, reject) => {
    const { archivo } = files;

    const cutedName = archivo.name.split(".");
    const extension = cutedName[cutedName.length - 1];

    // validar extension
    if (!validExtensions.includes(extension)) {
      return reject(
        `La extension ${extension} no es permitida, debes usar ${validExtensions}`
      );
    }

    // asignar un nombre unico
    const nameTemp = uuidv4() + "." + extension;

    // se usa path porque estoy en el controller folder y tiene que guardarse en upload folder
    // const uploadPath = path.join(__dirname, "../uploads/", archivo.name);
    const uploadPath = path.join(__dirname, "../uploads/", folder, nameTemp);

    archivo.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve(nameTemp);
    });
  });
};

module.exports = {
  uploadFileValidate,
};
