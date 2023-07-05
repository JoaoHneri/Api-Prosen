const mongoose = require('mongoose');
const User = require('./User');

const EventSchema = new mongoose.Schema({
  local: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  hour: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  src: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    key: {
      type: String,
      required: true
    },
    url: {
      type: String,
      default: ""
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const ProjectSchema = new mongoose.Schema({
  course: {
    type: String,
    required: true
  },
  classmodel: {
    type: String,
    required: true
  },
  period: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  discipline: {
    type: String,
    required: true
  },
  teacher: {
    type: String,
    required: true
  },
  student: {
    type: String,
    required: true
  }
});

const Event = mongoose.model('Event', EventSchema);
const Project = mongoose.model('Project', ProjectSchema);

module.exports = {
  Event,
  Project
};
