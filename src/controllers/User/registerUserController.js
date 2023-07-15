const User = require('../../models/User');
const bcrypt = require('bcrypt');
const UploadFile = require('../../models/UploadFile');

const registerUser = async (req, res) => {
  const {
    nameUser,
    email,
    password,
    confirmPassword,
    office,
    telephone,
    authAdmin,
    authStudent,
    record,
    graduation,
    LevelofEducation,
  } = req.body;

  const { originalname: name, size, filename: key } = req.file;

  try {
    const requiredFields = [
      'nameUser',
      'email',
      'password',
      'confirmPassword',
      'office',
      'telephone',
      'record',
      'graduation',
      'LevelofEducation',
    ];

    if (!requiredFields.every((field) => field in req.body)) {
      return res
        .status(422)
        .json({ message: 'All fields are required!', authAdmin: false });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(422)
        .json({ message: 'Invalid email format!', authAdmin: false });
    }

    if (password !== confirmPassword) {
      return res
        .status(422)
        .json({ message: 'Passwords do not match!', authAdmin: false });
    }

    if (password.length < 6) {
      return res
        .status(422)
        .json({ message: 'Password should be at least 6 characters long!', authAdmin: false });
    }

    const userExists = await User.exists({ email });
    if (userExists) {
      return res
        .status(422)
        .json({ message: 'Please use another email!', authAdmin: false });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      nameUser,
      email,
      office,
      telephone,
      record,
      graduation,
      LevelofEducation,
      password: hashedPassword,
      authAdmin: authAdmin || false,
      authStudent:  authStudent || false,
      file: {
        name,
        size,
        key,
        url: "",
      },
    });

    await user.save();

    res.status(201).json({ message: 'User successfully created!', authAdmin: authAdmin || false, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred on the server!', authAdmin: false });
  }
};

const findUsersWithNoAuth = async (req, res) => {
  try {
    const users = await User.find({ $and: [{ authAdmin: false }, { authStudent: false }] });
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred on the server!' });
  }
};



module.exports = { registerUser, findUsersWithNoAuth };
