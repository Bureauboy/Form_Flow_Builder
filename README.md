# Form Flow Builder

A visual, logic-driven form/quiz/workflow builder that lets you design question flows as a directed graph. Built with React, Zustand, and React Flow, Form Flow Builder turns conditional forms into an interactive graph editor with live validation, simulation, and JSON import/export.

- Demo: Visualize how questions link, detect unreachable or cyclic nodes, and simulate user navigation through branches.
- Use cases: complex surveys, decision trees, intake forms, quizzes, onboarding flows.

---

## Table of contents

- [Highlights](#highlights)
- [Quick demo / screenshots](#quick-demo--screenshots)
- [Features](#features)
- [How it works (brief)](#how-it-works-brief)
- [Install & run](#install--run)
- [Project structure](#project-structure)
- [Data model & JSON export example](#data-model--json-export-example)
- [Validation rules](#validation-rules)
- [Development notes](#development-notes)
- [Contributing](#contributing)
- [License & author](#license--author)

---

## Highlights

- Visual editor using React Flow — nodes represent questions, edges represent option branches.
- Global state with Zustand — lightweight, predictable store for graph, UI state and persistence.
- Live validation: detects unreachable nodes, orphan nodes, and cycles (circular dependencies).
- Simulator: step through a user journey based on selected options.
- Save/load flows as portable JSON.

---

## Quick demo / screenshots

(Replace these with images or GIFs from your project)
- Workflow editor showing nodes and edges
- Option editor on a selected question
- Simulator running a sample flow

---

## Features

- Create / edit / delete questions (nodes)
- Add multiple options to a question; each option can point to another question or end
- Visualize connections as a directed acyclic graph (DAG)
- Real-time validation for:
  - Unreachable questions (no incoming edges)
  - Orphan questions (no outgoing edges and not terminal)
  - Circular dependencies (cycles)
- Export / import flows (JSON)
- Simulate form execution step-by-step

---

## How it works (brief)

- Questions and options are modeled as nodes (questions) and edges (options -> target question id).
- The store (useFormStore.js) keeps a normalized representation of nodes and edges and exposes helpers to:
  - Add/edit/remove nodes and options
  - Generate React Flow-compatible node/edge objects for rendering
  - Run validation and compute reachable nodes from a chosen start node
- The Graph Validator runs checks for reachability, orphan nodes, and cycles using standard graph traversal techniques (BFS/DFS, topological checks).

---

## Install & run

Requirements:
- Node 16+ (or current LTS)
- npm or yarn

Clone and run locally:

```bash
git clone https://github.com/Bureauboy/Form_Flow_Builder.git
cd Form_Flow_Builder
npm install
npm run dev
```

Common scripts (package.json):
- npm run dev — start dev server (Vite)
- npm run build — build production bundle
- npm run preview — preview production build

---

## Project structure (high level)

- src/
  - components/
    - FormEditor.jsx        — UI for creating and editing questions/options
    - WorkflowView.jsx      — React Flow canvas rendering nodes & edges
    - FormSimulator.jsx     — Simulates user navigation through the flow
  - store/
    - useFormStore.js       — Zustand store: nodes, edges, persistence, helpers
  - utils/
    - graphValidator.js     — Graph validation utilities (unreachable/cyclic/orphan detection)
  - styles/
    - tailwind config, global css
- public/ — static assets
- index.html, vite config, package.json

(Adjust names/paths if files live in different directories)

---

## Data model & JSON export example

A minimal example of the JSON structure exported/imported by the app:

```json
{
  "nodes": [
    {
      "id": "q1",
      "type": "question",
      "title": "Are you above 18?",
      "meta": { "required": true }
    },
    {
      "id": "q2",
      "title": "Do you have a driver's license?"
    },
    {
      "id": "q3",
      "title": "Sorry, you are not eligible"
    }
  ],
  "options": [
    { "id": "o1", "label": "Yes", "from": "q1", "to": "q2", "isTerminal": false },
    { "id": "o2", "label": "No", "from": "q1", "to": "q3", "isTerminal": true }
  ],
  "startNodeId": "q1",
  "meta": {
    "title": "Minimum age flow",
    "createdAt": "2025-11-22T00:00:00Z"
  }
}
```

Notes:
- Each option includes a `from` (source question id) and `to` (target question id) or `isTerminal: true` to end the flow.
- The `startNodeId` identifies the entry point for simulations and reachability checks.

---

## Validation rules (what the validator checks)

- Reachability:
  - Starting at `startNodeId`, are there nodes with zero incoming links that are not the start?
  - Flag nodes that cannot be reached.
- Orphan / terminal checks:
  - Nodes with no outgoing edges are flagged as "terminal". This may be valid (end state) or unintended — the UI indicates which.
- Cycles:
  - Detect cycles using DFS and report the loop path. Cycles are considered invalid when the graph must be acyclic (e.g., a DAG requirement).

Validation results are surfaced in the editor UI and shown as warnings/errors on the graph canvas.

---

## Tips for using the editor

- Always set or confirm the start node before running validations or simulator.
- When deleting a node, make sure to reassign or remove any incoming options that referenced it.
- Use the simulator to test edge cases (e.g., deep branches, missing targets).
- Save frequently — exported JSON is the canonical serialized format for sharing flows.

---

## Development notes

- State: Zustand store is intentionally small — prefer composable selectors and actions for testability.
- Graph rendering: React Flow nodes and edges are derived from the normalized store. Custom node types allow inline editing when selected.
- Tests: Add unit tests for graphValidator.js (cycles, reachability) and for critical store actions.
- Accessibility: Ensure node controls are keyboard-accessible and simulator screens provide screen-reader-friendly labels.

---

## Contributing

Contributions welcome! Suggested workflow:

1. Fork the repo
2. Create a feature branch: git checkout -b feat/my-feature
3. Run & test locally
4. Open a pull request describing your changes and any design decisions

Guidelines:
- Keep commits focused and atomic.
- Add tests for new validation logic.
- Update README and examples if you add new JSON fields or behaviors.

---

## Roadmap (ideas)

- Save flows to remote backends / user accounts
- Versioned flows with diff/restore
- Conditional expressions on options (e.g., show option if answer > 18)
- Richer node types (info screens, inputs with validation)
- Collaboration (multiple users editing)

---

## License & author

- Author: Bureauboy (GitHub: @Bureauboy)
- License: MIT (if different, update accordingly)

---

If you want, I can:
- Add example screenshots/GIFs to the README,
- Generate a CONTRIBUTING.md and CODE_OF_CONDUCT,
- Produce unit tests for graphValidator.js,
- Or open a PR with this new README applied to your repo.

Which should I do next?
