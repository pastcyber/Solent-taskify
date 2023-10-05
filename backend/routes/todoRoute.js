const express = require('express');
const { getAllTodos, createTodo, updateTodo, deleteTodo, getTodoById, getTodosByTaskId, getTodosByDate, getUniqueDates, getAllTodosWithCounts } = require('../controllers/todoController');

const router = express.Router();


router.get('/:userId', getAllTodos)
router.post("/", createTodo)
router.put("/", updateTodo)
router.delete("/", deleteTodo)
router.get('/get-all-dates/:userId', getUniqueDates)
router.get('/date/:userId' ,getTodosByDate)
router.get('/count/:userId' ,getAllTodosWithCounts)
router.route('/task/:task_id').get(getTodosByTaskId)



module.exports = router