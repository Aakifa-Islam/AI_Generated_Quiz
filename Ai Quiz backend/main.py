'''This is the correct code that extract data form multiple files and do the 
summarization and quiz generation from the file. Just one thing in the quiz generation
is the order in which the json response from the api store in the list'''



from fastapi import FastAPI, UploadFile, File, Form
import uvicorn 
from typing import  List
from pydantic import BaseModel


from extract_file import  extract_text_from_content
from gemini_api import  apiCallforQuiz


app = FastAPI()


from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins or specify your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




class mcqsPoints(BaseModel):
    no_of_mcqs: int
    complexity_level:str


@app.post("/GenerateQuizFromMultipleFiles")
async def GenerateQuizFromGemini(
    no_of_mcqs: int = Form(...),
    complexity_level: str = Form(...),
    files: List[UploadFile] = File(...),
):
    #print(no_of_mcqs, complexity_level)
    #print(files)

    all_questions = []  
    all_answers = {}    

    total_files = len(files)

    # Calculate MCQs per file
    mcqs_per_file = no_of_mcqs // total_files
    remaining_mcqs = no_of_mcqs % total_files

    for idx, file in enumerate(files):
        try:
            file_bytes = await file.read()
            file_extension = file.filename.split('.')[-1]
            file_content = extract_text_from_content(file_bytes, file_extension)

            assigned_mcqs = mcqs_per_file + (1 if idx < remaining_mcqs else 0)

            response = apiCallforQuiz(file_content, assigned_mcqs, complexity_level)
            

            if "error" in response and response["error"]:
                print(f"Error in file {file.filename}: {response['error']}")
                continue  # Skip this file and move to next

            questions = response.get("questions", [])
            answers = response.get("answers", {})

            all_questions.extend(questions)  # Add all questions
            all_answers.update(answers)      # Merge answers into all_answers

        except Exception as e:
            print(f"Exception occurred while processing {file.filename}: {str(e)}")
            continue  
        

    return {
        "questions": all_questions,
        "answers": all_answers
    }









if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port =8000)













