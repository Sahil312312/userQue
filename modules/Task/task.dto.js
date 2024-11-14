const Joi = require('joi');

const taskSchema = Joi.object({
    userId: Joi.string().required().messages({
        'string.base': 'userId should be present in String',
        'any.required': 'userId is required'
    })
});

module.exports = { taskSchema };