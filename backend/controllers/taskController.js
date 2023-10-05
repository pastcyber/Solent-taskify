const db = require('../firebase')

const createTask = async(req,res)=>{

    try {
        const docRef = await db.collection('tasks').add(req.body);
        res.status(201).send(`Task added with ID: ${docRef.id}`);
      } catch (error) {
        console.error('Error adding task: ', error);
        res.status(500).send('Error adding task');
      }
}

const GetAllTask = async(req,res)=>{

    try {
        const snapshot = await db.collection('tasks').where('user_id', '==', req.params.userId).get();
        const tasks = [];
        snapshot.forEach((doc) => {
          tasks.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        res.status(200).json(tasks);
      } catch (error) {
        console.error('Error getting tasks: ', error);
        res.status(500).send('Error getting tasks');
      }

    
}

const updateTask = async(req,res)=>{

    try {
        const taskId = req.query.task_id;
        const taskData = req.body;
        await db.collection('tasks').doc(taskId).update(taskData);
        res.status(200).send('Task updated successfully');
      } catch (error) {
        console.error('Error updating task: ', error);
        res.status(500).send('Error updating task');
      }
    
}

const deleteTask = async (req,res)=>{
  try {
    const taskId = req.query.task_id;

    // Retrieve the task's to-do items
    const todosQuery = await db.collection('todos').where('task_id', '==', taskId).get();

    // Delete each associated to-do item
    const deletePromises = todosQuery.docs.map(async (todoDoc) => {
      await todoDoc.ref.delete();
    });

    // Wait for all to-do items to be deleted
    await Promise.all(deletePromises);

    // Delete the task itself
    await db.collection('tasks').doc(taskId).delete();

    res.status(200).send('Task and associated to-do items deleted successfully');
  } catch (error) {
    console.error('Error deleting task and associated to-do items: ', error);
    res.status(500).send('Error deleting task and associated to-do items');
  }

}

const getTaskById = async(req,res)=>{
    try {
        const taskId = req.params.task_id;
        const doc = await db.collection('tasks').doc(taskId).get();
        
        if (!doc.exists) {
          res.status(404).send('Task not found');
        } else {
          res.status(200).json({
            id: doc.id,
            data: doc.data(),
          });
        }
      } catch (error) {
        console.error('Error getting task: ', error);
        res.status(500).send('Error getting task');
      }

    
}
const getAllTaskWithCounts = async (req, res) => {
  try {
    const tasksRef = db.collection("tasks").where('user_id', '==', req.params.userId);
    const tasksSnapshot = await tasksRef.get();

    const tasksWithCounts = [];

    for (const taskDoc of tasksSnapshot.docs) {
      const taskData = taskDoc.data();
      const taskId = taskDoc.id;

      // Query todos associated with the current task
      const todosRef = db.collection("todos").where("task_id", "==", taskId);
      const todosSnapshot = await todosRef.get();

      const totalTodos = todosSnapshot.size;

      let completedCount = 0;

      todosSnapshot.forEach((todoDoc) => {
        const todoData = todoDoc.data();

        if (todoData.progress === "C") {
          completedCount++;
        }
      });

      // Create an object with task information and counts
      const taskWithCounts = {
        id: taskId,
        data: taskData,
        totalTodos: totalTodos,
        completedTodos: completedCount,
      };

      tasksWithCounts.push(taskWithCounts);
    }

    res.status(200).json(tasksWithCounts);
  } catch (error) {
    console.error("Error getting tasks with counts: ", error);
    res.status(500).send("Error getting tasks with counts");
  }
};

module.exports = {createTask,GetAllTask,updateTask,deleteTask,getTaskById,getAllTaskWithCounts}
