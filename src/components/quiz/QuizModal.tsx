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
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    // Select a random question on mount
    const randomIndex = Math.floor(Math.random() * QUIZ_QUESTIONS.length);
    setCurrentQuestion(QUIZ_QUESTIONS[randomIndex]);
    setQuestionIndex(randomIndex);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (showFeedback || timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto skip when time runs out
          handleSkip();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showFeedback, timeLeft]);

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

  const handleSkip = () => {
    // Close the modal when skipping
    onClose();
  };

  if (!currentQuestion) {
    return null;
  }

  // Calculate timer progress for circular timer (0-1)
  const timerProgress = timeLeft / 10;
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference * (1 - timerProgress);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative">
        {/* Circular Timer */}
        <div className="absolute top-8 right-8 w-24 h-24">
          <svg className="transform -rotate-90 w-24 h-24">
            {/* Background circle */}
            <circle
              cx="48"
              cy="48"
              r="45"
              stroke="#E5E7EB"
              strokeWidth="6"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="48"
              cy="48"
              r="45"
              stroke="#F97316"
              strokeWidth="6"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">{timeLeft}</span>
          </div>
        </div>

        {/* Question Counter */}
        <div className="text-purple-600 font-semibold text-lg mb-2">
          Question {questionIndex + 1}/{QUIZ_QUESTIONS.length}
        </div>

        {/* Question */}
        <h2 className="text-2xl font-bold text-gray-900 mb-8 pr-28">
          {currentQuestion.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectOption = index === currentQuestion.correctAnswer;

            let buttonClass = "w-full p-4 rounded-2xl text-lg font-medium transition-all duration-200 border-2 ";

            if (showFeedback) {
              if (isCorrectOption) {
                buttonClass += "bg-green-500 text-white border-green-500";
              } else if (isSelected && !isCorrect) {
                buttonClass += "bg-red-500 text-white border-red-500";
              } else {
                buttonClass += "bg-gray-100 text-gray-400 border-gray-200";
              }
            } else {
              if (isSelected) {
                buttonClass += "bg-purple-600 text-white border-purple-600";
              } else {
                buttonClass += "bg-gray-100 text-gray-700 border-gray-200 hover:border-purple-400 cursor-pointer";
              }
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
              <div className="text-green-600 text-2xl font-bold">
                ✅ Correct! Revealing gems...
              </div>
            ) : (
              <div>
                <div className="text-red-600 text-2xl font-bold mb-4">
                  ❌ Incorrect! Try again later.
                </div>
                <button
                  onClick={onClose}
                  className="bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        )}

        {/* Skip Question button (only show if not showing feedback) */}
        {!showFeedback && (
          <button
            onClick={handleSkip}
            className="mt-6 w-full bg-gray-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800"
          >
            Skip Question
          </button>
        )}
      </div>
    </div>
  );
};
