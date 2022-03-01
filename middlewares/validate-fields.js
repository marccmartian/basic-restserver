const { validationResult } = require("express-validator");

// next, me dice que si paso el middleware continue
const validateFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  next();
};

module.exports = {
  validateFields,
};
