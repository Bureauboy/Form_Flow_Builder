// src/utils/graphValidator.js

export function validateGraph(questions) {
  if (!Array.isArray(questions)) return { unreachable: [], orphans: [], cycles: [] };

  const graph = {};
  const incomingCount = {};

  // Build adjacency list and incoming edge count
  questions.forEach((q) => {
    graph[q.id] = [];
    incomingCount[q.id] = 0;
  });

  questions.forEach((q) => {
    q.options.forEach((opt) => {
      if (opt.next && graph[opt.next]) {
        graph[q.id].push(opt.next);
        incomingCount[opt.next] += 1;
      }
    });
  });

  // 1️⃣ Orphans: questions with no outgoing links
  const orphans = questions.filter((q) => q.options.length === 0).map((q) => q.id);

  // 2️⃣ Unreachable: nodes with no incoming links
  let unreachable = Object.entries(incomingCount)
    .filter(([_, count]) => count === 0)
    .map(([id]) => id);

  // 🟢 FIX: Don't mark the first question as unreachable
  if (unreachable.length > 0 && questions.length > 0) {
    const startNodeId = questions[0].id;
    unreachable = unreachable.filter((id) => id !== startNodeId);
  }

  // 3️⃣ Detect cycles (DFS)
  const visited = new Set();
  const stack = new Set();
  const cycles = [];

  const dfs = (nodeId, path) => {
    if (stack.has(nodeId)) {
      const cycleStart = path.indexOf(nodeId);
      if (cycleStart !== -1) {
        cycles.push(path.slice(cycleStart));
      }
      return;
    }
    if (visited.has(nodeId)) return;

    visited.add(nodeId);
    stack.add(nodeId);

    const neighbors = graph[nodeId] || [];
    for (const n of neighbors) dfs(n, [...path, n]);

    stack.delete(nodeId);
  };

  questions.forEach((q) => dfs(q.id, [q.id]));

  return {
    unreachable,
    orphans,
    cycles,
  };
}
