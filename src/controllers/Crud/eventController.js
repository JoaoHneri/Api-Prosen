const { Event } = require("../../models/Data");
const User = require("../../models/User");

const createEvent = async (req, res) => {
  try {
    const {
      user_id,
      local,
      title,
      hour,
      type,
      descricao,
      startDate,
    } = req.body;

    const src = req.files; // Array de arquivos enviados

    if (
      !user_id ||
      !local ||
      !title ||
      !hour ||
      !type ||
      !descricao ||
      !startDate ||
      !src || // Verifica se há arquivos enviados
      src.length === 0 // Verifica se o array de arquivos está vazio
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided, including files." });
    }

    const userInfo = await User.findById(user_id);
    if (!userInfo) {
      return res.status(404).json({ message: "User not found." });
    }

    const event = new Event({
      local,
      title,
      hour,
      type,
      descricao,
      startDate,
      src: [], // Array vazio para armazenar as informações dos arquivos
      user: userInfo._id,
    });

    // Percorre o array de arquivos e armazena as informações no campo src
    src.forEach((src) => {
      const { originalname: name, size, filename: key } = src;

      event.src.push({
        name,
        size,
        key,
        url: "", // Você pode armazenar a URL do arquivo aqui, se necessário
      });
    });

    const createdEvent = await event.save();
    const populatedEvent = await Event.findById(createdEvent._id).populate(
      "user"
    );

    return res.status(201).json({
      message: "Data successfully registered in the system!",
      event: populatedEvent,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("user");

    if (events.length === 0) {
      return res.status(404).json({ message: "No events found." });
    }

    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEventById = async (req, res) => {
  const eventId = req.params.id;

  try {
    if (!eventId) {
      return res.status(400).json({ message: "Event ID must be provided." });
    }

    if (!isValidId(eventId)) {
      return res.status(400).json({ message: "Invalid Event ID." });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEventById = async (req, res) => {
  const eventId = req.params.id;
  const { area, title, authors, type, teacher, startDate, email, pdf } =
    req.body;

  const updateEvent = {
    area,
    title,
    authors,
    type,
    teacher,
    startDate,
    email,
    pdf,
  };

  try {
    if (!eventId) {
      return res.status(400).json({ message: "Event ID must be provided." });
    }

    if (!isValidId(eventId)) {
      return res.status(400).json({ message: "Invalid Event ID." });
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updateEvent, {
      new: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    if (!eventId) {
      return res.status(400).json({ message: "Event ID must be provided." });
    }

    if (!isValidId(eventId)) {
      return res.status(400).json({ message: "Invalid Event ID." });
    }

    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.status(200).json({ message: "Event deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const isValidId = (id) => {
  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
  return isValidObjectId;
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEventById,
  deleteEvent,
};
