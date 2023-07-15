const User = require('../../models/User');
const bcrypt = require('bcrypt');

const updatePasswordUser = async (req, res) => {
    const userId = req.params.id;
    const { password, confirmPassword } = req.body;
  
    if (!password || !confirmPassword) {
      return res.status(422).json({ message: "Password and confirmation are required!" });
    }
  
    if (password !== confirmPassword) {
      return res.status(422).json({ message: "Password and confirmation must match!" });
    }
  
    try {
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);
  
      await User.findByIdAndUpdate(userId, { password: passwordHash });
  
      res.status(200).json({ message: "User password updated successfully!" });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  };
  
  const updateEmailUser = async (req, res) => {
    const userId = req.params.id;
    const { email } = req.body;
  
    if (!email) {
      return res.status(422).json({ message: "Email is required!" });
    }
  
    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(422).json({ message: "Please use another email!" });
      }
  
      await User.findByIdAndUpdate(userId, { email });
  
      res.status(200).json({ message: "User email successfully updated!" });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  };
  
  const updateNameUser = async (req, res) => {
    const userId = req.params.id;
    const { nameUser } = req.body;
  
    if (!nameUser) {
      return res.status(422).json({ message: "The name is required!" });
    }
  
    try {
      await User.findByIdAndUpdate(userId, { nameUser });
  
      res.status(200).json({ message: "Username successfully updated!" });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  };

  const updateUser = async (req, res) => {
    const { userId } = req.params;
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
  
      const userExists = await User.exists({ email, _id: { $ne: userId } });
      if (userExists) {
        return res
          .status(422)
          .json({ message: 'Please use another email!', authAdmin: false });
      }
  
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      const updatedUser = {
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
      };
  
      const user = await User.findByIdAndUpdate(userId, updatedUser, { new: true });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found!', authAdmin: false });
      }
  
      res.status(200).json({ message: 'User successfully updated!', authAdmin: authAdmin || false, user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred on the server!', authAdmin: false });
    }
  };
  
  
  
  
  module.exports = {
    updatePasswordUser,
    updateEmailUser,
    updateNameUser,
    updateUser
  };
  