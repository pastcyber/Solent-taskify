import axios from 'axios';
import { BASE_URL } from '../Global/global';
const userId = localStorage.getItem("userId");
// Define API endpoints for tasks, projects, and events
const TASKS_API = `${BASE_URL}/task`;


// Task API Functions
export const createTask = async (taskData) => {
  try {
    const response = await axios.post(TASKS_API, taskData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTasks = async () => {
  try {
    const response = await axios.get(`${TASKS_API}/task_with_count/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    const response = await axios.put(`${TASKS_API}?task_id=${taskId}`, taskData);
    return response.data;
  } catch (error) { 
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await axios.delete(`${TASKS_API}?task_id=${taskId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


