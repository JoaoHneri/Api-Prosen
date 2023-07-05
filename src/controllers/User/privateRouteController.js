const User = require('../../models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const privateRoute = async (req, res) => {
  const id = req.params.id;

  try {
    // Verificar se o usuário existe
    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Se o usuário existe, responder com os dados do usuário
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred on the server!' });
  }
};

module.exports = { privateRoute };
