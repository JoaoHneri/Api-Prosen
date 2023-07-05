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
    const { name } = req.body;
  
    if (!name) {
      return res.status(422).json({ message: "The name is required!" });
    }
  
    try {
      await User.findByIdAndUpdate(userId, { name });
  
      res.status(200).json({ message: "Username successfully updated!" });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  };
  
  module.exports = {
    updatePasswordUser,
    updateEmailUser,
    updateNameUser,
  };
  