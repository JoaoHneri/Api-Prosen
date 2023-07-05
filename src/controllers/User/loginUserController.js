const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.SECRET;

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(422).json({ message: 'Email and password are required!' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(422).json({ message: 'Invalid email format!' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password!' });
    }

    const token = jwt.sign({ id: user._id }, secret);

    const usuario = await User.findOne({email: email});

    res.status(200).json({ message: 'Authentication performed successfully!', token, usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred on the server!' });
  }
};


module.exports = {loginUser};
