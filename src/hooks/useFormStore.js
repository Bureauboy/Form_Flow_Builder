// src/hooks/useFormStore.js
import { create } from "zustand";
import _ from "lodash";
import { validateGraph } from "../utils/graphValidator";

export const useFormStore = create((set, get) => ({
  questions: [],

  // ➕ Add new question node
  addQuestion: (text) =>
    set((state) => {
      const id = `q${state.questions.length + 1}`;
      const newQuestion = {
        id,
        text: text || `Untitled Question ${state.questions.length + 1}`,
        options: [],
        position: null,
      };
      const updated = [...state.questions, newQuestion];
      const validationState = validateGraph(updated);
      return { questions: updated, validationState };
    }),

  // ➕ Add option (edge)
  addOption: (questionId, optionText, nextQuestion = null) =>
    set((state) => {
      const updated = _.cloneDeep(state.questions);
      const q = updated.find((q) => q.id === questionId);
      if (q) q.options.push({ text: optionText, next: nextQuestion });
      const validationState = validateGraph(updated);
      return { questions: updated, validationState };
    }),

  // ✏️ Update option text
  updateOptionText: (questionId, optionIndex, newText) =>
    set((state) => {
      const updated = state.questions.map((q) => {
        if (q.id !== questionId) return q;
        const newOptions = q.options.map((opt, i) =>
          i === optionIndex ? { ...opt, text: newText } : opt
        );
        return { ...q, options: newOptions };
      });
      const validationState = validateGraph(updated);
      return { questions: updated, validationState };
    }),

  // 🔗 Update “next” link for an option
  updateOptionNext: (questionId, optionIndex, nextId) =>
    set((state) => {
      const updated = state.questions.map((q) => {
        if (q.id !== questionId) return q;
        const updatedOptions = q.options.map((opt, i) =>
          i === optionIndex ? { ...opt, next: nextId } : opt
        );
        return { ...q, options: updatedOptions };
      });
      const validationState = validateGraph(updated);
      console.log("Next link updated:", questionId, optionIndex, nextId);
      return { questions: updated, validationState };
    }),

  // 🧠 Update question text
  updateQuestionText: (questionId, newText) =>
    set((state) => {
      const updated = _.cloneDeep(state.questions);
      const q = updated.find((q) => q.id === questionId);
      if (q) q.text = newText;
      const validationState = validateGraph(updated);
      return { questions: updated, validationState };
    }),

  // ❌ Delete a question node
  deleteQuestion: (questionId) =>
    set((state) => {
      const updated = state.questions.filter((q) => q.id !== questionId);
      const validationState = validateGraph(updated);
      return { questions: updated, validationState };
    }),

  // 🧩 Build adjacency list (Graph structure)
  getGraph: () => {
    const { questions } = get();
    const graph = {};
    questions.forEach((q) => {
      graph[q.id] = q.options.map((opt) => opt.next).filter(Boolean);
    });
    return graph;
  },

  // 🟢 Simulation Active Question Tracking
  activeQuestionId: null,
  setActiveQuestion: (id) => set({ activeQuestionId: id }),
  clearActiveQuestion: () => set({ activeQuestionId: null }),

  // 🌀 Jump to a specific question (for diagram clicks)
  jumpToQuestion: (id) => {
    const { questions } = get();
    const exists = questions.find((q) => q.id === id);
    if (exists) {
      set({ activeQuestionId: id });
      window.dispatchEvent(new CustomEvent("jumpToQuestion", { detail: id }));
    }
  },

  // 💾 Export current flow as JSON (includes positions)
  exportToJSON: () => {
    const { questions } = get();

    const cleanedQuestions = questions.map((q) => ({
      id: q.id,
      text: q.text,
      options: q.options,
      position: q.position || null, // include position
    }));

    const data = JSON.stringify({ questions: cleanedQuestions }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "form_flow.json";
    a.click();
    URL.revokeObjectURL(url);
  },

  // 📂 Import flow from a JSON file (restores positions)
  importFromJSON: (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (json.questions && Array.isArray(json.questions)) {
          const withPositions = json.questions.map((q) => ({
            ...q,
            position: q.position || null,
          }));
          const validationState = validateGraph(withPositions);
          set({ questions: withPositions, validationState });
          alert("✅ Form flow loaded successfully!");
        } else {
          alert("⚠️ Invalid file structure.");
        }
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load JSON file.");
      }
    };
    reader.readAsText(file);
  },

  // 🧩 Update manual node position
  updateNodePosition: (nodeId, position) =>
    set((state) => {
      const updated = state.questions.map((q) =>
        q.id === nodeId ? { ...q, position } : q
      );
      const validationState = validateGraph(updated);
      return { questions: updated, validationState };
    }),

  // 🧩 Validation state (real-time warnings)
  validationState: {
    unreachable: [],
    orphans: [],
    cycles: [],
  },

  // ⚙️ Run validation explicitly (optional)
  runValidation: () => {
    const { questions } = get();
    const result = validateGraph(questions);
    set({ validationState: result });
  },
}));
