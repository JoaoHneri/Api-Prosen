const express = require('express');
const router = express.Router();
const multer = require('multer');
const multerConfig = require('./config/multer');

const checkToken = require('./middlewares/checkToken');

const registerUserController = require('./controllers/User/registerUserController');
const publicRouteController = require('./controllers/User/publicRouteController');
const loginUserController = require('./controllers/User/loginUserController');
const privateRouteController = require('./controllers/User/privateRouteController');
const updateUserController = require('./controllers/User/UpdateUserController');
const eventController = require('./controllers/Crud/eventController');
const projectController = require('./controllers/Crud/projectController');
const uploadFileController = require('./controllers/Upload/UploadFileController');

// Router users
router.get('/', publicRouteController.getPublicRoute);
router.post('/auth/register', multer(multerConfig).single('file'), registerUserController.registerUser);
router.post('/auth/login', loginUserController.loginUser);
router.get('/user/:id',  privateRouteController.privateRoute);
router.put('/user/:userId', multer(multerConfig).single('file'), updateUserController.updateUser);
router.put('/user/:id/name', checkToken, updateUserController.updateNameUser);
router.put('/user/:id/email', checkToken, updateUserController.updateEmailUser);
router.put('/user/:id/password', checkToken, updateUserController.updatePasswordUser);
router.get('/professores', registerUserController.findUsersWithNoAuth)

// Router Event
router.post('/event', multer(multerConfig).fields([{ name: 'src', maxCount: 8 }, { name: 'video', maxCount: 8 }]), eventController.createEvent);
router.get('/event', eventController.getEvents);
router.get('/event/:id', eventController.getEventById);
router.get('/event/user/:user_id', eventController.getEventByUserId);
router.patch('/event/:id', eventController.updateEventById);
router.put('/event/:event_id', multer(multerConfig).fields([{ name: 'src', maxCount: 8 }, { name: 'video', maxCount: 8 }]), eventController.updateEvent);
router.delete('/event/:id', eventController.deleteEvent);

//Router Project
router.post('/project', multer(multerConfig).single('file'), projectController.createProject);
router.put('/project/:project_id', multer(multerConfig).single('file'), projectController.updateProject);
router.get('/project', projectController.getProjects);
router.get('/project/:user_id', projectController.getProjectsByUserId);
router.get('/project/this/:id', projectController.getProjectById);
router.patch('/project/:id', projectController.updateProjectById);
router.delete('/project/:id', projectController.deleteProject);

//Upload 
router.post('/upload', multer(multerConfig).single('file'),  uploadFileController.uploadFileController);

module.exports = router;
