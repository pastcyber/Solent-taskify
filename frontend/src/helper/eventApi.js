import axios from 'axios';
import { auth } from '../firebase';
import { BASE_URL } from '../Global/global';
const userId = localStorage.getItem("userId");

const EVENTS_API = `${BASE_URL}/event`;

// Create a new event
export const createEvent = async (eventData) => {
  try {
    const response = await axios.post(EVENTS_API, eventData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get a list of events
export const getEvents = async () => {
  console.log(auth);
  try {
    if(userId) {
      const response = await axios.get(EVENTS_API + "/" + userId);
      return response.data;
  }
  } catch (error) {
    throw error;
  }
};

// Update an event by ID
export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await axios.put(`${EVENTS_API}/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete an event by ID
export const deleteEvent = async (eventId) => {
  try {
    const response = await axios.delete(`${EVENTS_API}/${eventId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
