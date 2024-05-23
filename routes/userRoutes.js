const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const userValidationRules = require('../validation/userValidation');

router.post('/signup', userValidationRules, userController.signUp);
router.post('/login', userValidationRules, userController.login);
router.get('/users', authMiddleware, userController.getAllUsers);
router.post('/users', authMiddleware, userValidationRules, userController.createUser);
router.put('/users/:id', authMiddleware, userValidationRules, userController.updateUser);
router.delete('/users/:id', authMiddleware, userController.deleteUser);

module.exports = router;
