const User = require('../../models/User');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
  const { name, email, password, confirmPassword, office, telephone, authAdmin } = req.body;

  try {
    // Verificar se todos os campos obrigatórios estão presentes
    if (!name || !email || !password || !confirmPassword || !office || !telephone) {
      return res.status(422).json({ message: 'All fields are required!', authAdmin: false });
    }

    // Validar o formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(422).json({ message: 'Invalid email format!', authAdmin: false });
    }

    // Verificar se a senha e a confirmação de senha correspondem
    if (password !== confirmPassword) {
      return res.status(422).json({ message: 'Passwords do not match!', authAdmin: false });
    }

    // Verificar a força da senha (exemplo: mínimo de 6 caracteres)
    if (password.length < 6) {
      return res.status(422).json({ message: 'Password should be at least 6 characters long!', authAdmin: false });
    }

    const userExists = await User.exists({ email });
    if (userExists) {
      return res.status(422).json({ message: 'Please use another email!', authAdmin: false });
    }

    // Criptografar a senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Criar o usuário
    const user = new User({
      name,
      email,
      office,
      telephone,
      password: hashedPassword,
      authAdmin: authAdmin || false,
    });

    await user.save();
    res.status(201).json({ message: 'User successfully created!', authAdmin: authAdmin || false, user: user});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred on the server!', authAdmin: false });
  }
};

module.exports = { registerUser };
