const UploadFile = require('../../models/UploadFile');

const uploadFileController = async (req, res) => {
  const { originalname: name, size, filename: key } = req.file;

  try {
    const file = await UploadFile.create({
      name,
      size,
      key,
      url: '', // Defina a URL corretamente, caso esteja disponível
    });

    return res.json(file);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadFileController };
