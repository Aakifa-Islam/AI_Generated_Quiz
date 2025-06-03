

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const generateQuiz = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/GenerateQuizFromMultipleFiles`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // Return the raw data
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
