// API base URL
export const BASE_URL = 'http://localhost:8000';

export const convertDateFormat = (date) =>{

const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 to month since months are zero-based
const day = String(date.getDate()).padStart(2, "0");

// Create the formatted date string
const formattedDate = `${year}-${month}-${day}`;
return formattedDate
} 