// src/pages/FormRuntime.jsx
import React, { useState } from "react";
import { useFormStore } from "../hooks/useFormStore";
import { useNavigate } from "react-router-dom";

export default function FormRuntime() {
  const navigate = useNavigate();
  const questions = useFormStore((state) => state.questions);
  const [currentId, setCurrentId] = useState(questions[0]?.id || null);
  const [answers, setAnswers] = useState([]);

  if (!questions.length) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <p>No form data found.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Back to Builder
        </button>
      </div>
    );
  }

  const currentQ = questions.find((q) => q.id === currentId);

  const handleAnswer = (opt) => {
    setAnswers((a) => [...a, { qid: currentQ.id, ans: opt.text }]);
    if (opt.next) setCurrentId(opt.next);
    else setCurrentId(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">
        {currentId ? (
          <>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {currentQ.text}
            </h2>
            <div className="flex flex-col gap-3">
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-green-50 transition"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-700 mb-3">
              ✅ Form Completed
            </h2>
            <p className="text-gray-600 mb-6">Your path:</p>
            <ul className="text-sm text-gray-700 mb-6">
              {answers.map((a, idx) => (
                <li key={idx}>
                  {a.qid} → {a.ans}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Back to Builder
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
