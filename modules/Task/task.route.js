const express = require('express');
const taskController = require('./task.controller');
const { rateLimiter } = require('../../middleware/rateLimiter');
const {taskSchema} = require('./task.dto');
const { validateBody } = require('../../utils/validate');
const router = express.Router();

router.post("/task",validateBody(taskSchema),rateLimiter,taskController.task)

module.exports = router