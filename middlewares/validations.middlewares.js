const { body, validationResult } = require('express-validator');

const createUserValidations = [
  body('name').notEmpty().withMessage('Name cannot be empty'),
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Must be a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

const createRepairsValidation = [
    // body('Date').isLength({min: 10, max: 10}).withMessage('Date must have a format: YYYY-MM-DD and '),
    body('computerNumber')
      .notEmpty()
      .withMessage('computerNumber cannot be empty')
      .isNumeric()
      .withMessage('Must be a number'),
    body('comments')
      .notEmpty()
      .withMessage('Comments cannot be empty')
      .isString()
      .withMessage('Must be text'),
  ];

const checkValidations = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map(({ msg }) => msg);

    // [msg, msg, msg] -> 'msg. msg. msg'
    const errorMsg = messages.join('. ');

    return res.status(400).json({
      status: 'error',
      message: errorMsg,
    });
  }

  next();
};

module.exports = {
  createUserValidations,
  createRepairsValidation,
  checkValidations,
};
