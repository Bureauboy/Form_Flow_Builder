import React, { useState, useEffect } from "react";
import { useFormStore } from "../hooks/useFormStore";

export default function FormSimulator() {
  const questions = useFormStore((state) => state.questions);
  const setActiveQuestion = useFormStore((state) => state.setActiveQuestion);
  const clearActiveQuestion = useFormStore((state) => state.clearActiveQuestion);
  const [currentId, setCurrentId] = useState(null);
  const [path, setPath] = useState([]);

  // 🌀 Listen for workflow node click events
  useEffect(() => {
    const handleJump = (e) => {
      const questionId = e.detail;
      const exists = questions.find((q) => q.id === questionId);
      if (exists) setCurrentId(questionId);
    };

    window.addEventListener("jumpToQuestion", handleJump);
    return () => window.removeEventListener("jumpToQuestion", handleJump);
  }, [questions]);

  // 🟢 Keep workflow highlighting in sync
  useEffect(() => {
    if (currentId) setActiveQuestion(currentId);
    else clearActiveQuestion();
  }, [currentId, setActiveQuestion, clearActiveQuestion]);

  // 🧭 Start or Restart simulation
  const startSimulation = () => {
    if (questions.length === 0) return alert("No questions available.");
    setCurrentId(questions[0].id);
    setPath([]);
  };

  // 🟢 NEW: Restart simulation without reload
  const restartSimulation = () => {
    if (questions.length === 0) return;
    setCurrentId(questions[0].id);
    setPath([]);
  };

  const currentQuestion = questions.find((q) => q.id === currentId);

  const handleSelect = (next, optText) => {
    setPath((prev) => [...prev, `${currentId} (${optText})`]);
    if (!next) {
      alert("End of form reached ✅");
      setCurrentId(null);
    } else {
      setCurrentId(next);
    }
  };

  return (
    <div className="mt-6 p-4 border-t border-gray-300">
      <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
        🧭 Form Simulator
      </h2>

      {currentId === null ? (
        <button
          onClick={startSimulation}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Start Simulation
        </button>
      ) : (
        <div className="space-y-3">
          {/* Question Display */}
          <div className="flex justify-between items-center">
            <p className="font-medium">{currentQuestion?.text}</p>
            <button
              onClick={restartSimulation}
              className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded hover:bg-gray-300 transition"
            >
              ↻ Restart
            </button>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-2">
            {currentQuestion?.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(opt.next, opt.text)}
                className="px-3 py-2 text-left border rounded hover:bg-green-50"
              >
                {opt.text || "Option"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Path Tracker */}
      {path.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          <p className="font-semibold mb-1">Visited Path:</p>
          <p>{path.join(" → ")}</p>
        </div>
      )}
    </div>
  );
}
