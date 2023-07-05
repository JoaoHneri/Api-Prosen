const { Project } = require('../../models/Data');
const User = require('../../models/User');

const createProject = async (req, res) => {
  try {
    const { user_id, course, classmodel, period, discipline, teacher, student } = req.body;

    if (!user_id || !course || !classmodel || !period || !discipline || !teacher || !student) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    const userInfo = await User.findById(user_id);
    if (!userInfo) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const { originalname: name, size, filename: key } = req.file;

    const project = new Project({
      course,
      classmodel,
      period,
      discipline,
      teacher,
      student,
      user: userInfo._id
    });

    const createdProject = await project.save();
    const populatedProject = await Project.findById(createdProject._id).populate('user');

    res.status(201).json({ message: 'Data successfully registered in the system!', project: populatedProject });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('user');

    if (projects.length === 0) {
      return res.status(404).json({ message: 'No projects found.' });
    }

    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjectById = async (req, res) => {
  const projectId = req.params.id;

  try {
    if (!projectId) {
      return res.status(400).json({ message: 'Project ID must be provided.' });
    }

    if (!isValidId(projectId)) {
      return res.status(400).json({ message: 'Invalid Project ID.' });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { course, classmodel, period, discipline, teacher, student } = req.body;

    const updateProject = {
      course,
      classmodel,
      period,
      discipline,
      teacher,
      student,
    };

    const update = await Project.updateOne({ _id: projectId }, updateProject);

    if (update.nModified === 0) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    res.status(200).json({ message: 'Project successfully updated.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    const data = await Project.deleteOne({ _id: projectId });

    if (!data.deletedCount) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    res.status(200).json({ message: 'Project deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const isValidId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProjectById,
  deleteProject
};