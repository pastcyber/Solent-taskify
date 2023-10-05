import axios from 'axios';

import { BASE_URL } from '../Global/global';
const TODOS_API = `${BASE_URL}/todo`;
const userId = localStorage.getItem("userId");
// Create a new to-do
export const createTodo = async (todoData) => {
  try {
    const response = await axios.post(TODOS_API, todoData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get a list of to-dos
export const getTodos = async () => {
  try {
    const response = await axios.get(TODOS_API+"/" + userId);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get a list of to-dos
export const getAllTodosWithCounts = async () => {
  try {
    const response = await axios.get(`${TODOS_API}/count/${userId}`);
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get a list of to-dos
export const getTodosByDate = async (date) => {
  try {
    const response = await axios.get(`${TODOS_API}/date/${userId}?date=${date}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get a list of to-dos
export const getAllDates = async () => {
  try {
    const response = await axios.get(`${TODOS_API}/get-all-dates/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update a to-do by ID
export const updateTodo = async (todoId, todoData) => {
  try {
    const response = await axios.put(`${TODOS_API}?todo_id=${todoId}`, todoData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update a to-do by ID
export const getTodoByTaskId = async (task_id) => {
  try {
    const response = await axios.get(`${TODOS_API}/task/${task_id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a to-do by ID
export const deleteTodo = async (todoId) => {
  try {
    const response = await axios.delete(`${TODOS_API}?todo_id=${todoId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
