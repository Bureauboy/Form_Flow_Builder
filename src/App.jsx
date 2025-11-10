import React from "react";
import { ReactFlowProvider } from "reactflow";
import { motion } from "framer-motion";
import FormEditor from "./components/FormEditor";
import WorkflowView from "./components/WorkFlowView";
import FormSimulator from "./components/FormSimulator";
import { useFormStore } from "./hooks/useFormStore";

function Toolbar() {
  const exportToJSON = useFormStore((state) => state.exportToJSON);
  const importFromJSON = useFormStore((state) => state.importFromJSON);

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) importFromJSON(file);
    e.target.value = ""; // reset input
  };

  return (
    <motion.div
      className="flex justify-between items-center mb-4 sticky top-0 bg-slate-100/70 backdrop-blur-md z-10 pb-2 border-b border-slate-300 shadow-sm px-3 py-2 rounded-xl"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-sky-500 text-transparent bg-clip-text">
        FormFlow Builder 🧩
      </h1>

      <div className="flex gap-3">
        <button
          onClick={exportToJSON}
          className="px-4 py-2 rounded-lg border border-indigo-400 text-indigo-600 font-medium hover:bg-indigo-50 transition-all duration-300 hover:scale-105"
        >
          💾 Save
        </button>

        <label className="px-4 py-2 rounded-lg border border-slate-400 text-slate-700 font-medium cursor-pointer hover:bg-slate-100 transition-all duration-300 hover:scale-105">
          📂 Load
          <input
            type="file"
            accept="application/json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>
    </motion.div>
  );
}

export default function App() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200">
      {/* Left Panel */}
      <motion.div
        className="w-1/2 border-r border-slate-300 p-4 overflow-y-auto bg-slate-50/80 backdrop-blur-xl shadow-lg rounded-r-2xl"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Toolbar />

        <motion.div
          className="p-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <FormEditor />
        </motion.div>

        <motion.div
          className="mt-6 border-t border-slate-300 pt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <FormSimulator />
        </motion.div>
      </motion.div>

      {/* Right Panel */}
      <motion.div
        className="w-1/2 p-4 overflow-hidden bg-slate-50/80 backdrop-blur-xl shadow-lg rounded-l-2xl"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <ReactFlowProvider>
          <WorkflowView />
        </ReactFlowProvider>
      </motion.div>
    </div>
  );
}
