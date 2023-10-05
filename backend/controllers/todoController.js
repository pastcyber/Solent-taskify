const db = require('../firebase')

const createTodo = async (req, res) => {
  try {
    const itemData = req.body; // To-do item data from the request body
    const docRef = await db.collection('todos').add(itemData);
    res.status(201).send(` to-do item created with ID: ${docRef.id}`);
  } catch (error) {
    console.error('Error creating  to-do item: ', error);
    res.status(500).send('Error creating  to-do item');
  }

}

const getAllTodos = async (req, res) => {
  try {
    const snapshot = await db.collection('todos').where('user_id', '==', req.params.userId).get();
    const todosWithTasks = [];

    for (const todoDoc of snapshot.docs) {
      const todoData = todoDoc.data();
      // console.log(todoData,"tas\n\n")
      const taskId = todoData.task_id;
      let taskData = {}; // Initialize taskData as an empty object

      // If a task ID exists, retrieve the associated task document

      if (taskId != '') {
        const taskDoc = await db.collection('tasks').doc(taskId).get();
        taskData = taskDoc.data();
      }

      // Add the to-do item and its associated task information to the response
      todosWithTasks.push({
        id: todoDoc.id,
        todoData: todoData,
        taskData: taskData,
      });
    }

    res.status(200).json(todosWithTasks);
  } catch (error) {
    console.error('Error getting to-do items with associated task information: ', error);
    res.status(500).send('Error getting to-do items with associated task information');
  }
};

const getTodosByDate = async (req, res) => {
try {
  const requestedDate = req.query.date; // Date in the "yyyy-mm-dd" format
  // Query the Firestore collection to fetch todos with the specified end_date
  const todosRef = db.collection('todos');
  let query = todosRef.where('end_date', '==', requestedDate);
  query = query.where('user_id', '==', req.params.userId)
  const snapshot = await query.get();
  if (snapshot.empty) {
    return res.status(404).send("No todos found for the specified date");
  } else {
    const todosWithTasks = [];
    for (const todoDoc of snapshot.docs) {
      const todoData = todoDoc.data();
      // console.log(todoData,"tas\n\n")
      const taskId = todoData.task_id;
      let taskData = {}; // Initialize taskData as an empty object

      // If a task ID exists, retrieve the associated task document

      if (taskId != "") {
        const taskDoc = await db.collection("tasks").doc(taskId).get();
        taskData = taskDoc.data();
      }

      // Add the to-do item and its associated task information to the response
      todosWithTasks.push({
        id: todoDoc.id,
        todoData: todoData,
        taskData: taskData,
      });
    }
    console.log(todosWithTasks);
    return res.status(200).json(todosWithTasks);
  }
  } catch (error) {
    console.error('Error getting todos by date: ', error);
    return res.status(500).send('Error getting todos by date');
  }
};

const updateTodo = async (req, res) => {
  try {
    const todoId = req.query.todo_id;
    const updatedData = req.body; // Updated to-do item data

    // Update the to-do item in the "todos" collection
    await db.collection('todos').doc(todoId).update(updatedData);

    res.status(200).send(' to-do item updated successfully');
  } catch (error) {
    console.error('Error updating  to-do item: ', error);
    res.status(500).send('Error updating  to-do item');
  }

}

const deleteTodo = async (req, res) => {
  try {
    const todoId = req.query.todo_id;

    // Delete the to-do item from the "todos" collection
    await db.collection('todos').doc(todoId).delete();

    res.status(200).send('Standalone to-do item deleted successfully');
  } catch (error) {
    console.error('Error deleting standalone to-do item: ', error);
    res.status(500).send('Error deleting standalone to-do item');
  }

}

const getTodoById = async (req, res) => {
  try {
    const todoId = req.query.todo_id;


    // Query the Firestore collection to fetch the specific to-do item
    const todoDoc = await db.collection('todos').doc(todoId).get();

    if (!todoDoc.exists) {
      res.status(404).send('Standalone to-do item not found');
    } else {
      const todoData = todoDoc.data();
      res.status(200).json({
        id: todoDoc.id,
        data: todoData,
      });
    }
  } catch (error) {
    console.error('Error getting standalone to-do item: ', error);
    res.status(500).send('Error getting standalone to-do item');
  }


}
const getTodosByTaskId = async (req, res) => {
  try {
    const taskId = req.params.task_id;

    // Query the Firestore collection to fetch all to-do items with the specified task ID
    const query = db.collection('todos').where('task_id', '==', taskId);
    const snapshot = await query.get();

    const todos = [];
    snapshot.forEach((doc) => {
      todos.push({
        id: doc.id,
        todoData: doc.data(),
      });
    });

    res.status(200).json(todos);
  } catch (error) {
    console.error('Error getting to-do items by task ID: ', error);
    res.status(500).send('Error getting to-do items by task ID');
  }


}
  
const getUniqueDates = async (req, res) => {
  try {
    const todosRef = db.collection("todos").where('user_id', '==', req.params.userId);
    const query = await todosRef.get();

    const uniqueDates = new Set();
    query.forEach((doc) => {
      const end_date = doc.data().end_date;
      uniqueDates.add(end_date);
    });

    const uniqueDatesArray = Array.from(uniqueDates);
    res.status(200).json(uniqueDatesArray);
  } catch (error) {
    console.error("Error getting unique dates: ", error);
    throw error;
  }
};
const getAllTodosWithCounts = async (req, res) => {
  try {
    const snapshot = await db.collection("todos").where('user_id', '==', req.params.userId).get();
    const todosWithTasks = [];
    let completedCount = 0;
    let inProgressCount = 0;
    let dueCount = 0;

    for (const todoDoc of snapshot.docs) {
      const todoData = todoDoc.data();
      const taskId = todoData.task_id;
      let taskData = {}; // Initialize taskData as an empty object

      if (taskId !== "") {
        const taskDoc = await db.collection("tasks").doc(taskId).get();
        taskData = taskDoc.data();
      }

      // Check the progress field and update the counts
      switch (todoData.progress) {
        case "C":
          completedCount++;
          break;
        case "P":
          inProgressCount++;
          break;
        case "D":
          dueCount++;
          break;
      }

      todosWithTasks.push({
        id: todoDoc.id,
        todoData: todoData,
        taskData: taskData,
      });
    }
    const total = completedCount + inProgressCount + dueCount;
    const counts = {
      completed: completedCount,
      inProgress: inProgressCount,
      due: dueCount,
      total: total,
    };

    res.status(200).json({ todosWithTasks, counts });
  } catch (error) {
    console.error(
      "Error getting to-do items with associated task information: ",
      error
    );
    res
      .status(500)
      .send("Error getting to-do items with associated task information");
  }
};



  module.exports = { createTodo, getAllTodos, updateTodo, deleteTodo, getTodoById, getTodosByTaskId, getTodosByDate ,getUniqueDates,getAllTodosWithCounts}
