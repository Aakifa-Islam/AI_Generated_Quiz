# AI Quiz Generator
A powerful quiz generator that accepts multiple document formats (`PDF`, `DOCX`, `TXT`, `PPTX`) and creates quizzes using Generative AI.  
Built with **FastAPI** (Backend) and **React** (Frontend), using **Gemini API** for dynamic quiz generation.

## Features
- Upload multiple files (PDF, TXT, DOCX, PPTX)
- Extract content from documents
- Generate MCQs using Gemini API
---
![Image Alt](https://github.com/Aakifa-Islam/AI_Generated_Quiz/blob/ab15f8fdeedf8a583e35987236d2ebbdd0c43ed8/New%20folder/Quiz1.png)





## How to Run This Project
### Frontend Setup

-Open Terminal in "Quiz React Frontend" folder
cd "Quiz React Frontend"

-Go into the app directory
cd my-quiz-app

-Install dependencies
npm install

-Run the frontend
npm run dev

### Backend
-Open Terminal in "Ai Quiz backend" folder
cd "Ai Quiz backend"

-Create a .env file and add your Gemini API key like this:
GEMINI_API_KEY=your_api_key_here

-Install required Python packages
pip install -r requirement.txt

-Run the FastAPI backend
python main.py

