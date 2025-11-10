import React, { useState } from "react";
import { useFormStore } from "../hooks/useFormStore";

export default function FormEditor() {
  const {
    questions,
    addQuestion,
    addOption,
    updateQuestionText,
    updateOptionText,
    updateOptionNext,
    deleteQuestion,
  } = useFormStore();

  const [newQuestion, setNewQuestion] = useState("");

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      addQuestion(newQuestion.trim());
      setNewQuestion("");
    }
  };

  // 🟢 NEW: Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // stop form submission or unintended newlines
      handleAddQuestion();
    }
  };

  return (
    <div>
      {/* Add Question */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          onKeyDown={handleKeyDown} // 🟢 added event
          placeholder="Enter your question..."
          className="border rounded px-3 py-2 w-full"
        />
        <button
          onClick={handleAddQuestion}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q) => (
          <div
            key={q.id}
            className="border border-gray-300 rounded-lg p-3 bg-white shadow-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <input
                value={q.text}
                onChange={(e) => updateQuestionText(q.id, e.target.value)}
                className="text-lg font-semibold border-b focus:outline-none w-3/4"
              />
              <button
                onClick={() => deleteQuestion(q.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {q.options.map((opt, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-1 border p-2 rounded-md bg-gray-50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) =>
                        updateOptionText(q.id, idx, e.target.value)
                      }
                      placeholder="Option text"
                      className="border px-2 py-1 rounded w-1/2"
                    />

                    <select
                      value={opt.next || ""}
                      onChange={(e) =>
                        updateOptionNext(q.id, idx, e.target.value)
                      }
                      className="border px-2 py-1 rounded w-1/3"
                    >
                      <option value="">→ Next Question</option>
                      {questions
                        .filter((other) => other.id !== q.id)
                        .map((other) => (
                          <option key={other.id} value={other.id}>
                            {other.text}
                          </option>
                        ))}
                    </select>

                    <button
                      onClick={() => {
                        const updatedOptions = [...q.options];
                        updatedOptions.splice(idx, 1);
                        q.options = updatedOptions;
                        useFormStore.setState((state) => ({
                          questions: state.questions.map((ques) =>
                            ques.id === q.id ? q : ques
                          ),
                        }));
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>

                  {opt.next && (
                    <p className="text-xs text-gray-500 ml-1">
                      ➡️ Linked to:{" "}
                      <span className="font-semibold text-gray-700">
                        {opt.next}
                      </span>
                    </p>
                  )}
                </div>
              ))}

              <button
                onClick={() => addOption(q.id, "New Option")}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                + Add Option
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
