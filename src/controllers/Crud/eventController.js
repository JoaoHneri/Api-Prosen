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

    const { originalname: name, size, filename: key } = req.file;

    if (
      !user_id ||
      !local ||
      !title ||
      !hour ||
      !type ||
      !descricao ||
      !startDate 
      
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
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
      src: {
        name,
        size,
        key,
        url: "",
      },
      user: userInfo._id,
    });

    const createdEvent = await event.save();
    const populatedEvent = await Event.findById(createdEvent._id).populate(
      "user"
    );

    return res
      .status(201)
      .json({
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
