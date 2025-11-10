// src/components/WorkflowView.jsx
import React, { useEffect, useRef, useMemo } from "react";
import { useFormStore } from "../hooks/useFormStore";
import ReactFlow, { Background, Controls, MarkerType, MiniMap } from "reactflow";
import dagre from "dagre";
import "reactflow/dist/style.css";

export default function WorkflowView() {
  const questions = useFormStore((s) => s.questions);
  const activeQuestionId = useFormStore((s) => s.activeQuestionId);
  const validationState = useFormStore((s) => s.validationState);
  const updateNodePosition = useFormStore((s) => s.updateNodePosition);
  const reactFlowInstance = useRef(null);

  const edges = useMemo(
    () =>
      questions.flatMap((q) =>
        q.options
          .filter((opt) => opt.next)
          .map((opt, idx) => ({
            id: `${q.id}-${opt.next}-${idx}`,
            source: q.id,
            target: opt.next,
            label: opt.text || "Option",
            labelBgPadding: [6, 3],
            labelBgBorderRadius: 4,
            labelBgStyle: { fill: "#e0f2fe", color: "#0369a1", fontWeight: 500 },
            markerEnd: { type: MarkerType.ArrowClosed, color: "#2563eb" },
            animated: true,
            type: "smoothstep",
            style: { stroke: "#2563eb", strokeWidth: 2 },
          }))
      ),
    [questions]
  );

  const nodes = useMemo(() => {
    const g = new dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: "TB", ranksep: 80, nodesep: 80 });

    questions.forEach((q) => g.setNode(q.id, { width: 200, height: 60 }));
    edges.forEach((e) => g.setEdge(e.source, e.target));
    dagre.layout(g);

    return questions.map((q) => {
      const layoutNode = g.node(q.id);
      const hasCustom = q.position && typeof q.position.x === "number" && typeof q.position.y === "number";

      // determine validation colors
      const unreachable = validationState?.unreachable || [];
      const orphans = validationState?.orphans || [];
      const cycles = validationState?.cycles || [];

      let borderColor = "#3b82f6"; // default blue
      let bgColor = "#ffffff";

      if (unreachable.includes(q.id)) {
        borderColor = "#ef4444"; // red
        bgColor = "#fee2e2";
      } else if (orphans.includes(q.id)) {
        borderColor = "#f59e0b"; // amber
        bgColor = "#fffbeb";
      } else if (cycles.some((c) => c.includes(q.id))) {
        borderColor = "#e11d48"; // red
        bgColor = "#fee2e2";
      }

      // active override
      if (q.id === activeQuestionId) {
        borderColor = "#16a34a"; // green
        bgColor = "#dcfce7";
      }

      return {
        id: q.id,
        data: { label: q.text },
        position: hasCustom ? q.position : { x: layoutNode.x, y: layoutNode.y },
        draggable: true,
        style: {
          border: `3px solid ${borderColor}`,
          borderRadius: "12px",
          padding: "8px",
          background: bgColor,
          fontWeight: "500",
          boxShadow: `0 1px 6px ${borderColor}33`,
          transition: "all 0.2s ease",
        },
      };
    });
  }, [questions, edges, validationState, activeQuestionId]);

  // auto-fit
  useEffect(() => {
    if (reactFlowInstance.current && questions.length > 0) {
      const { fitView } = reactFlowInstance.current;
      setTimeout(() => fitView({ padding: 0.2 }), 300);
    }
  }, [questions, edges]);

  return (
    <div className="h-full w-full bg-white rounded shadow-inner">
      <h2 className="text-lg font-semibold mb-2 text-gray-700">Workflow Diagram</h2>

      {/* 🧠 Live Validation Summary */}
<div className="text-sm mb-2">
  {validationState &&
  validationState.unreachable.length === 0 &&
  validationState.orphans.length === 0 &&
  validationState.cycles.length === 0 ? (
    <span className="text-green-600">✅ All nodes valid</span>
  ) : (
    <div className="bg-red-50 border border-red-200 rounded p-2">
      <p className="text-red-600 font-medium mb-1">⚠️ Issues detected:</p>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        {validationState.unreachable.length > 0 && (
          <li>
            <strong>Unreachable:</strong>{" "}
            {validationState.unreachable.map((id) => (
              <span key={id} className="text-red-500 font-medium mr-2">
                {id}
              </span>
            ))}
            (No incoming links)
          </li>
        )}
        {validationState.orphans.length > 0 && (
          <li>
            <strong>Orphans:</strong>{" "}
            {validationState.orphans.map((id) => (
              <span key={id} className="text-yellow-600 font-medium mr-2">
                {id}
              </span>
            ))}
            (No outgoing options)
          </li>
        )}
        {validationState.cycles.length > 0 && (
          <li>
            <strong>Cycles:</strong>{" "}
            {validationState.cycles.map((cycle, idx) => (
              <span key={idx} className="text-purple-600 font-medium block ml-2">
                🔁 {cycle.join(" → ")}
              </span>
            ))}
          </li>
        )}
      </ul>
    </div>
  )}
</div>


      <div
        style={{
          height: "85%",
          border: "1px solid #ddd",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onInit={(instance) => (reactFlowInstance.current = instance)}
          onNodeClick={(_, node) => useFormStore.getState().jumpToQuestion(node.id)}
          onNodeDragStop={(_, node) => updateNodePosition(node.id, node.position)}
          fitView
          minZoom={0.5}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        >
          <MiniMap nodeColor={(n) => (n.id === activeQuestionId ? "#16a34a" : "#60a5fa")} />
          <Background variant="dots" gap={16} size={1} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
