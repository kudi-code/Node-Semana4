//Libraries
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

//Utils
const { catchAsync } = require('../utils/catchAsync');
//Models
const { User } = require('../models/users.model');
const { AppError } = require('../utils/appError');


//Init dotenv
dotenv.config({ path: './config.env' });

const getAllUsers = catchAsync(async (req, res,next) => {
  //SELECT * FROM users  
    const users = await User.findAll({attributes: {exclude: ['password']}});
    res.status(201).json({
      users,
    });
});

const createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  // INSERT INTO ...
  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
    role,
  });

  // Remove password from response
  newUser.password = undefined;

  res.status(201).json({ newUser });
});

const getUserById = (async (req, res, next) => {
    const { id } = req.params; // {id} debe ser igual al parametro enviado por la URL
    //SELECT * FROM users WHERE id = ?

    const user = await User.findOne({ where: { id: id } });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'User not found given this ID',
      });
    }

    res.status(201).json({
      user,
    });
});

const updateUser = catchAsync(async (req, res, next) => {  
    const { id } = req.params; // {id} debe ser igual al parametro enviado por la URL
    const { name } = req.body;

    //SELECT * FROM users WHERE id = ?

    const user = await User.findOne({ where: { id: id } });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'User not found given this ID',
      });
    }

    await user.update({ name: name });

    res.status(200).json({
      status: 'sucess',
    });
});

const deleteUser = catchAsync(async (req, res, next) => {
    const { id } = req.params; // {id} debe ser igual al parametro enviado por la URL
    //SELECT * FROM users WHERE id = ?

    const user = await User.findOne({ where: { id: id } });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'User not found given this ID',
      });
    }
    //DELETE FROM ...
    user.update({ status: 'deleted' });

    res.status(200).json({
      status: 'sucess',
    });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate that user exists with given email
  const user = await User.findOne({
    where: { email, status: 'available' },
  }); 
  console.log(user)
  // Compare password with db
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Invalid credentials', 400));
  }

  // Generate JWT
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  user.password = undefined;

  res.status(200).json({ token, id: user.id });
});

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  login
};
