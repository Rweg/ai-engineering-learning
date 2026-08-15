const modules = [
  {
    id: "rag",
    title: "RAG Systems",
    tag: "Retrieval",
    outcome: "Build grounded assistants over public or synthetic documents.",
    learn: ["chunking strategies", "embeddings", "vector search", "hybrid retrieval", "prompt assembly", "retrieval evaluation"],
    artifact: "RAG demo with retrieval quality notes and a failure-mode checklist.",
    quiz: {
      question: "What is the main purpose of retrieval in a RAG system?",
      options: ["Ground generation in source context", "Replace all evaluation", "Make prompts longer"],
      answer: 0
    }
  },
  {
    id: "azure-ai",
    title: "Azure AI",
    tag: "Cloud AI",
    outcome: "Understand model deployment, search, evaluation, and cost-aware usage.",
    learn: ["Azure AI Foundry", "Azure OpenAI", "Azure AI Search", "model selection", "token management", "evaluation"],
    artifact: "Model comparison table, deployment notes, and token/cost calculator.",
    quiz: {
      question: "Which service concept is most directly tied to hybrid retrieval for RAG?",
      options: ["Azure AI Search", "CSS media queries", "Git remotes"],
      answer: 0
    }
  },
  {
    id: "mcp-agents",
    title: "MCP and Agents",
    tag: "Agents",
    outcome: "Design tool-using AI systems with clear boundaries and evaluation.",
    learn: ["tools", "resources", "JSON schemas", "secure context access", "planning", "memory"],
    artifact: "Agent design doc with tool schema and evaluation checklist.",
    quiz: {
      question: "What should a tool schema make clear?",
      options: ["Inputs, outputs, and constraints", "Only the UI colors", "The developer's resume"],
      answer: 0
    }
  },
  {
    id: "mlops",
    title: "Production MLOps",
    tag: "Operations",
    outcome: "Deploy, monitor, version, and safely operate AI systems.",
    learn: ["experiment tracking", "model registry", "CI/CD", "monitoring", "drift checks", "rollback"],
    artifact: "Containerized API with monitoring and release checklist.",
    quiz: {
      question: "Why monitor data drift after deployment?",
      options: ["Input patterns can change and degrade model behavior", "It makes CSS smaller", "It replaces security review"],
      answer: 0
    }
  },
  {
    id: "docker-cicd",
    title: "Docker and CI/CD",
    tag: "Delivery",
    outcome: "Package AI services and ship them with repeatable checks.",
    learn: ["Dockerfile", "containerized APIs", "GitHub Actions", "tests", "deployment gates", "release notes"],
    artifact: "Basic CI workflow for testing a small API or RAG service.",
    quiz: {
      question: "What does CI help protect?",
      options: ["Repeatable quality checks before changes ship", "Private data by default", "Model accuracy without tests"],
      answer: 0
    }
  },
  {
    id: "fine-tuning",
    title: "Fine-Tuning Decision Framework",
    tag: "Strategy",
    outcome: "Choose between prompting, RAG, fine-tuning, and not using AI.",
    learn: ["prompting limits", "RAG fit", "fine-tuning fit", "evaluation cost", "data requirements", "risk tradeoffs"],
    artifact: "Decision tree applied to three synthetic use cases.",
    quiz: {
      question: "When is RAG often a better first step than fine-tuning?",
      options: ["When answers must use changing source documents", "When no documents exist", "When evaluation is unnecessary"],
      answer: 0
    }
  }
];

const healthTopics = [
  ["Digital Health Systems", "EMR, HMIS, LMIS concepts, batch and real-time inference, and decision-support workflows."],
  ["HL7 and FHIR Basics", "FHIR-shaped resources, identifiers, coding systems, provenance, and interoperability tradeoffs."],
  ["Data Quality and Lineage", "Completeness, validity, duplication, drift, representativeness, and traceability."],
  ["Clinical-Style Evaluation", "Sensitivity, specificity, calibration, subgroup performance, thresholding, and error analysis."],
  ["Governance and Security", "Access control, audit logging, privacy review, risk registers, and responsible AI documentation."],
  ["Health MLOps", "Model registry, staged deployment, drift monitoring, incident response, rollback, and retirement."]
];

const milestones = [
  "Define synthetic schema",
  "Generate sample data",
  "Add validation checks",
  "Train baseline model",
  "Build inference API",
  "Add RAG workflow",
  "Add monitoring outputs",
  "Write model card, data card, and runbook",
  "Publish sanitized portfolio writeup"
];

const state = JSON.parse(localStorage.getItem("aiLearningState") || '{"done":{},"quiz":{}}');
const moduleList = document.querySelector("#moduleList");
const moduleDetail = document.querySelector("#moduleDetail");
const healthGrid = document.querySelector("#healthGrid");
const capstoneMilestones = document.querySelector("#capstoneMilestones");
const completeCount = document.querySelector("#completeCount");
const quizScore = document.querySelector("#quizScore");

function saveState() {
  localStorage.setItem("aiLearningState", JSON.stringify(state));
  renderStats();
}

function renderStats() {
  const doneCount = Object.values(state.done).filter(Boolean).length;
  const quizValues = Object.values(state.quiz);
  const correct = quizValues.filter(Boolean).length;
  const score = quizValues.length ? Math.round((correct / quizValues.length) * 100) : 0;
  completeCount.textContent = String(doneCount);
  quizScore.textContent = `${score}%`;
}

function renderModules(selectedId = modules[0].id) {
  moduleList.innerHTML = "";
  modules.forEach((module) => {
    const button = document.createElement("button");
    button.className = `module-button ${module.id === selectedId ? "active" : ""}`;
    button.type = "button";
    button.innerHTML = `<span>${module.title}</span><small>${module.tag}</small>`;
    button.addEventListener("click", () => renderModules(module.id));
    moduleList.appendChild(button);
  });

  const module = modules.find((item) => item.id === selectedId);
  moduleDetail.innerHTML = `
    <p class="eyebrow">${module.tag}</p>
    <h3>${module.title}</h3>
    <p>${module.outcome}</p>
    <h4>Learn</h4>
    <ul>${module.learn.map((item) => `<li>${item}</li>`).join("")}</ul>
    <h4>Evidence to Produce</h4>
    <p>${module.artifact}</p>
    <label class="check-row">
      <input type="checkbox" data-done="${module.id}" ${state.done[module.id] ? "checked" : ""}>
      <span>I completed this module artifact</span>
    </label>
    <div class="quiz">
      <h4>Quick Check</h4>
      <p>${module.quiz.question}</p>
      <div class="quiz-options">
        ${module.quiz.options.map((option, index) => `
          <button type="button" data-quiz="${module.id}" data-answer="${index}">${option}</button>
        `).join("")}
      </div>
      <p class="quiz-result" id="quiz-${module.id}">${state.quiz[module.id] === true ? "Correct." : state.quiz[module.id] === false ? "Try again." : ""}</p>
    </div>
  `;
}

function renderHealthTopics() {
  healthGrid.innerHTML = healthTopics.map(([title, body]) => `
    <article class="track">
      <h3>${title}</h3>
      <p>${body}</p>
    </article>
  `).join("");
}

function renderMilestones() {
  capstoneMilestones.innerHTML = milestones.map((milestone, index) => {
    const id = `capstone-${index}`;
    return `
      <label class="milestone">
        <input type="checkbox" data-done="${id}" ${state.done[id] ? "checked" : ""}>
        <span>${milestone}</span>
      </label>
    `;
  }).join("");
}

document.addEventListener("change", (event) => {
  const id = event.target.dataset.done;
  if (!id) return;
  state.done[id] = event.target.checked;
  saveState();
});

document.addEventListener("click", (event) => {
  const moduleId = event.target.dataset.quiz;
  if (!moduleId) return;
  const module = modules.find((item) => item.id === moduleId);
  const selected = Number(event.target.dataset.answer);
  state.quiz[moduleId] = selected === module.quiz.answer;
  saveState();
  const result = document.querySelector(`#quiz-${moduleId}`);
  result.textContent = state.quiz[moduleId] ? "Correct." : "Try again.";
});

document.querySelector("#resetProgress").addEventListener("click", () => {
  localStorage.removeItem("aiLearningState");
  state.done = {};
  state.quiz = {};
  renderModules();
  renderMilestones();
  renderStats();
});

renderModules();
renderHealthTopics();
renderMilestones();
renderStats();
