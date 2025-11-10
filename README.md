# 🧩 Form_Flow_Builder

**Form_Flow_Builder** is a dynamic logic-based form creation platform built with **React**, **Zustand**, and **React Flow**.  
It allows users to design question-based workflows where each option can branch to a different path — just like a decision tree or directed graph.  
Ideal for quiz systems, application forms, and logic-driven survey builders.

---

## 🚀 Features

### 🧠 Core Logic
- **Dynamic Question Linking:**  
  Each question can have multiple options, where every option can direct to another question — creating a logical flow between nodes.
  
- **Graph-based Structure:**  
  Internally represented as a **directed acyclic graph (DAG)**, allowing you to manage form logic like DSA graph traversal.

- **Real-time Workflow Diagram:**  
  Automatically visualizes how questions connect to each other using **React Flow**. Each question becomes a node; options form directional edges.

---

### ⚙️ Functionality
- **Add / Edit / Delete Questions**  
  Modify text dynamically — each question updates instantly in both the content and workflow regions.

- **Add Options per Question**  
  Each option can point to another question (next node) or end the flow.

- **Live Logic Validation:**  
  Integrated validation engine to detect:
  - ❌ **Unreachable questions** (no incoming links)
  - ⚠️ **Orphan questions** (no outgoing edges)
  - 🔁 **Circular dependencies** (loops in the flow)

- **Simulate Form Execution:**  
  Step through your form flow in real-time. The simulator follows your branching logic, question by question.

- **Save / Load Flows (JSON):**  
  Export or import your workflow as structured JSON for reuse or sharing.

---

## 🧩 Architecture Overview

### 🧱 Core Components
| Component | Purpose |
|------------|----------|
| `FormEditor.jsx` | UI logic for adding/editing questions and options |
| `WorkflowView.jsx` | Renders the directed graph (workflow diagram) using React Flow |
| `FormSimulator.jsx` | Simulates user navigation through the question flow |
| `useFormStore.js` | Global state management (Zustand) handling graph logic, validation, and persistence |
| `graphValidator.js` | Utility that validates logical consistency and detects unreachable/cyclic nodes |

---

## 🧮 Logic Flow Example

A simple example:

**Q1:** Are you above 18?  
➡️ Yes → Q2: Do you have a driver’s license?  
➡️ No → Q3: Sorry, you are not eligible.

Each question and option becomes part of a **directed graph**, and the system ensures the connections remain valid.

---

## 🧠 Tech Stack

| Layer | Tools Used |
|--------|-------------|
| Frontend | React + Vite |
| State Management | Zustand |
| Graph Rendering | React Flow |
| Utility | Lodash |
| Styling | Tailwind CSS |

---

## ⚙️ Installation & Setup

Clone and install dependencies:

```bash
git clone https://github.com/armansingh8805/Form_Flow_Builder.git
cd Form_Flow_Builder
npm install
npm run dev
