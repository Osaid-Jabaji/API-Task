const { body } = require('express-validator');

const userValidationRules = [
    body('name').isString().isLength({ min: 1 }).trim().escape(),
    body('password').isLength({ min: 6 }).trim().escape()
];

module.exports = userValidationRules;
