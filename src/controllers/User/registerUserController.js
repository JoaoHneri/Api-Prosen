const User = require('../../models/User');
const bcrypt = require('bcrypt');
const UploadFile = require('../../models/UploadFile');

const registerUser = async (req, res) => {
  const {
    name,
    email,
    password,
    confirmPassword,
    office,
    telephone,
    authAdmin,
    record,
    graduation,
    LevelofEducation,
  } = req.body;

  const { originalname, size, filename } = req.file || {};

  try {
    const requiredFields = [
      'name',
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
      name,
      email,
      office,
      telephone,
      record,
      graduation,
      LevelofEducation,
      password: hashedPassword,
      authAdmin: authAdmin || false,
    });

    if (req.file) {
      const uploadFile = new UploadFile({
        name: originalname,
        size,
        key: filename,
        url: '',
      });

      await uploadFile.save();
      user.file = uploadFile._id;
    }

    await user.save();

    res.status(201).json({ message: 'User successfully created!', authAdmin: authAdmin || false, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred on the server!', authAdmin: false });
  }
};

module.exports = { registerUser };
