const User = require('../../models/User');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
  const { name, email, password, confirmPassword, cargo, telefone } = req.body;

  try {
    // Verificar se todos os campos obrigatórios estão presentes
    if (!name || !email || !password || !confirmPassword || !cargo || !telefone) {
      return res.status(422).json({ message: 'All fields are required!' });
    }

    // Validar o formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(422).json({ message: 'Invalid email format!' });
    }

    // Verificar se a senha e a confirmação de senha correspondem
    if (password !== confirmPassword) {
      return res.status(422).json({ message: 'Passwords do not match!' });
    }

    // Verificar a força da senha (exemplo: mínimo de 6 caracteres)
    if (password.length < 6) {
      return res.status(422).json({ message: 'Password should be at least 6 characters long!' });
    }

    const userExists = await User.exists({ email });
    if (userExists) {
      return res.status(422).json({ message: 'Please use another email!' });
    }

    // Criptografar a senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Criar o usuário
    const user = new User({
      name,
      email,
      cargo,
      telefone,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: 'User successfully created!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred on the server!' });
  }
};

module.exports = { registerUser };
