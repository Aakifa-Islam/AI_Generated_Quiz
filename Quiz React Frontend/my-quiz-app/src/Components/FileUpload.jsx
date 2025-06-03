
import React, { useState } from 'react';
import { generateQuiz } from '../api';
import Box from './Box';
import './fileUpload.css';

function FileUpload() {
  const [files, setFiles] = useState([]);
  const [noOfMcqs, setNoOfMcqs] = useState('');
  const [complexity, setComplexity] = useState('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const validFileTypes = [
    'text/plain',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const invalidFiles = selectedFiles.filter(file => !validFileTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      alert('Invalid file format! Only .txt, .pdf, .pptx, and .docx files are allowed.');
      setFiles([]);
    } else {
      setFiles(selectedFiles);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0 || !noOfMcqs || !complexity) {
      alert('Please fill all fields and upload files.');
      return;
    }

    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('no_of_mcqs', noOfMcqs);
    formData.append('complexity_level', complexity);

    setIsProcessing(true);

    try {
      const data = await generateQuiz(formData);
      console.log('Server Response:', data);

      if (data && Array.isArray(data.questions) && typeof data.answers === 'object') {
        setQuizResult(data);
        setSelectedAnswers({}); // reset answers
        setIsSubmitted(false);  // reset submit
        setScore(0);             // reset score
      } else {
        alert('Unexpected server response format.');
        console.error('Unexpected server response:', data);
      }
    } catch (error) {
      alert('Failed to generate quiz. Check console for details.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOptionChange = (questionText, selectedOption) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionText]: selectedOption,
    }));
  };

  const handleFinalSubmit = () => {
    let calculatedScore = 0;

    quizResult.questions.forEach((item) => {
      const correctAnswer = quizResult.answers[item.Question];
      if (selectedAnswers[item.Question] === correctAnswer) {
        calculatedScore += 1;
      }
    });

    setScore(calculatedScore);
    setIsSubmitted(true);
  };

  return (
    <div className="file-upload-container">
      {!quizResult ? (
        <>
          <h2>Generate Quiz From Multiple Files</h2>
          <form onSubmit={handleSubmit} className="upload-form">
            <label>Upload Multiple Files:</label>
            <input type="file" multiple onChange={handleFileChange} />

            <label>Number of MCQs:</label>
            <input
              type="number"
              value={noOfMcqs}
              onChange={(e) => setNoOfMcqs(e.target.value)}
              min="1"
            />

            <label>Complexity Level:</label>
            <select value={complexity} onChange={(e) => setComplexity(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <button type="submit">Generate Quiz</button>
          </form>

          {isProcessing && <div className="processing-screen active">Processing...</div>}
        </>
      ) : (
        <div className="result-container">
          <h3>Quiz Time! 🎯</h3>
          <div className="questions">
            {quizResult.questions.map((item, index) => (
              <Box
                key={index}
                questionItem={item}
                selectedOption={selectedAnswers[item.Question]}
                onOptionChange={handleOptionChange}
                isSubmitted={isSubmitted}
                correctAnswer={quizResult.answers[item.Question]}
              />
            ))}
          </div>

          {!isSubmitted && (
            <button className="final-submit-btn" onClick={handleFinalSubmit}>
              Submit All Answers
            </button>
          )}

          {isSubmitted && (
            <div className="final-score">
              🎯 Final Score: {score} / {quizResult.questions.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
