const express = require('express');
const { GetAllTask, getTaskById, updateTask, createTask, deleteTask } = require('../controllers/taskController');
const {getAllTaskWithCounts} = require('../controllers/taskController')
const router = express.Router();



router.get("/:userId", GetAllTask);
router.get("/task_with_count/:userId", getAllTaskWithCounts);
router.post("/", createTask);
router.put("/", updateTask);
router.delete("/", deleteTask);
router.route("/:task_id").get(getTaskById);



module.exports = router