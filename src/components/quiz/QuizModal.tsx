import React, { useState, useEffect } from 'react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
}

interface QuizModalProps {
  onCorrectAnswer: () => void;
  onClose: () => void;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "What is the capital of France?",
    options: ["London", "Paris", "Berlin", "Madrid"],
    correctAnswer: 1
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Jupiter", "Mars", "Saturn"],
    correctAnswer: 2
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Van Gogh", "Picasso", "Leonardo da Vinci", "Monet"],
    correctAnswer: 2
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correctAnswer: 3
  },
  {
    question: "How many continents are there?",
    options: ["5", "6", "7", "8"],
    correctAnswer: 2
  },
  {
    question: "What is the speed of light?",
    options: ["299,792 km/s", "150,000 km/s", "500,000 km/s", "100,000 km/s"],
    correctAnswer: 0
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    options: ["Gold", "Oxygen", "Silver", "Osmium"],
    correctAnswer: 1
  },
  {
    question: "What year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    correctAnswer: 2
  },
  {
    question: "What is the smallest prime number?",
    options: ["0", "1", "2", "3"],
    correctAnswer: 2
  }
];

export const QuizModal: React.FC<QuizModalProps> = ({ onCorrectAnswer, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    // Select a random question on mount
    const randomIndex = Math.floor(Math.random() * QUIZ_QUESTIONS.length);
    setCurrentQuestion(QUIZ_QUESTIONS[randomIndex]);
  }, []);

  const handleAnswerClick = (index: number) => {
    if (showFeedback) return; // Prevent multiple clicks

    setSelectedAnswer(index);
    const correct = index === currentQuestion?.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      // Wait a moment to show feedback, then trigger success
      setTimeout(() => {
        onCorrectAnswer();
        onClose();
      }, 1500);
    }
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-purple-600 rounded-2xl p-8 max-w-2xl w-full shadow-2xl border-4 border-purple-400">
        {/* Question */}
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          {currentQuestion.question}
        </h2>

        {/* Options */}
        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectOption = index === currentQuestion.correctAnswer;

            let buttonClass = "w-full p-4 rounded-xl text-xl font-semibold transition-all duration-200 ";

            if (showFeedback) {
              if (isCorrectOption) {
                buttonClass += "bg-green-500 text-white border-4 border-green-300";
              } else if (isSelected && !isCorrect) {
                buttonClass += "bg-red-500 text-white border-4 border-red-300";
              } else {
                buttonClass += "bg-purple-400 text-white opacity-50";
              }
            } else {
              buttonClass += "bg-white text-purple-600 hover:bg-purple-100 hover:scale-105 active:scale-95 cursor-pointer";
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                className={buttonClass}
                disabled={showFeedback}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className="mt-6 text-center">
            {isCorrect ? (
              <div className="text-green-300 text-2xl font-bold animate-pulse">
                ✅ Correct! Revealing gems...
              </div>
            ) : (
              <div>
                <div className="text-red-300 text-2xl font-bold mb-4">
                  ❌ Incorrect! Try again later.
                </div>
                <button
                  onClick={onClose}
                  className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-100"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        )}

        {/* Close button (only show if not showing feedback) */}
        {!showFeedback && (
          <button
            onClick={onClose}
            className="mt-6 w-full bg-purple-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-900"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};
