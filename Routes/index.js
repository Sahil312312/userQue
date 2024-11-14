const taskRouter = require('../modules/Task/task.route')

var v1Router = (app) => {
    app.use("/api/v1",taskRouter);
}

module.exports = v1Router;