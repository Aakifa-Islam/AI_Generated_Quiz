

import './box.css';


function Box({ questionItem, selectedOption, onOptionChange, isSubmitted, correctAnswer }) {
  return (
    <div className={`box-container ${isSubmitted ? (selectedOption === correctAnswer ? 'correct' : 'incorrect') : ''}`}>
      <h4>{questionItem.Question}</h4>
      <div className="options-list">
        {questionItem.options.map((option, index) => (
          <div key={index} className="option-item">
            <input
              type="radio"
              id={`${questionItem.Question}-${index}`}
              name={questionItem.Question}
              value={option}
              checked={selectedOption === option}
              onChange={(e) => onOptionChange(questionItem.Question, e.target.value)}
              disabled={isSubmitted}
            />
            <label htmlFor={`${questionItem.Question}-${index}`}>{option}</label>
          </div>
        ))}
      </div>
      {isSubmitted && (
        <div className="result">
          {selectedOption === correctAnswer ? (
            <span className="correct-text">✅ Correct</span>
          ) : (
            <span className="incorrect-text">❌ Incorrect! Correct Answer: {correctAnswer}</span>
          )}
        </div>
      )}
    </div>
  );
}

export default Box;
