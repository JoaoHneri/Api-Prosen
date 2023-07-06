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
  title: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  },
  classProject: {
    type: String,
    required: true
  },
  shift: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  linkEvent: {
    type: String,
    required: true
  },
  supervisor: {
    type: String,
    required: true
  },
  groupLeaderEmail: {
    type: String,
    required: true
  },
  authors: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
});

const Event = mongoose.model('Event', EventSchema);
const Project = mongoose.model('Project', ProjectSchema);

module.exports = {
  Event,
  Project
};
