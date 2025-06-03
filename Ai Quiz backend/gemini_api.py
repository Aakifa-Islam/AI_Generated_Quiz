from google import genai
import json
import re

from dotenv import load_dotenv
import os


# Load environment variables from .env file
load_dotenv()

# Get the API key from environment variable
api_key = os.getenv("GOOGLE_API_KEY")

client = genai.Client(api_key=api_key)




def apiCallforQuiz(text_content, number_of_mcqs, complexity_level="medium"):
    schema = {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "Question": {"type": "string"},
                "options": {"type": "array", "items": {"type": "string"}},
                "Answer": {"type": "string"}
            },
            "required": ["Question", "options", "Answer"]
        }
    }

    prompt = f"""
You are an expert MCQ generator.
Generate exactly {number_of_mcqs} {complexity_level}-level multiple-choice questions from the given text.

Ensure:
- Questions are directly based on the content.
- Each question has 4 options and one correct answer.
- Return result as a JSON list of objects with "Question", "options", "Answer".

Text:
{text_content}
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[{"role": "user", "parts": [{"text": prompt}]}]
        )

        response_text = response.candidates[0].content.parts[0].text
        response_text = re.sub(r'```(json)?', '', response_text.strip())

        structured_output = json.loads(response_text)
        questions = []
        answers = {}
        for item in structured_output:
            questions.append({"Question": item["Question"], "options": item["options"]})
            answers[item["Question"]] = item["Answer"]

        return {"questions": questions, "answers": answers}
    except Exception as e:
        return {"error": str(e), "questions": [], "answers": {}}


