const course = [
  {
    id: "llm-apps",
    title: "How Modern LLM Applications Work",
    tag: "Core",
    time: "60 min",
    lesson: "From text prompt to production feature",
    explanation: [
      "A large language model receives text, converts it into tokens, and predicts the next likely tokens. An application around the model decides what instructions, user input, retrieved context, tools, and output format the model receives.",
      "The model is not the whole system. A production AI feature usually includes an API layer, prompt construction, context selection, safety checks, logging, evaluation, and user experience decisions.",
      "The context window is the model's working memory for a single request. If relevant information is not in the context window or learned during training, the model may guess. AI engineering is largely the discipline of giving the model the right context, the right tools, and the right constraints."
    ],
    diagram: "User input\n   |\n   v\nApplication code\n   |\n   +--> system instructions\n   +--> selected context\n   +--> tool definitions\n   +--> output schema\n   |\n   v\nLLM inference\n   |\n   v\nvalidated response",
    example: "A support assistant should not simply pass the user's question to a model. It should identify the product area, retrieve relevant docs, ask the model to cite the evidence, validate the response shape, and log whether the user accepted the answer.",
    code: "from openai import OpenAI\n\nclient = OpenAI()\n\nresponse = client.responses.create(\n    model=\"gpt-4.1-mini\",\n    input=[\n        {\"role\": \"system\", \"content\": \"Answer using concise, grounded technical explanations.\"},\n        {\"role\": \"user\", \"content\": \"What is a context window?\"}\n    ]\n)\n\nprint(response.output_text)",
    codeNotes: [
      "client = OpenAI() creates the API client.",
      "The system message sets behavior before the user asks a question.",
      "The user message is the actual task.",
      "response.output_text is the model's generated answer."
    ],
    lab: "Write three versions of the same prompt: vague, specific, and schema-constrained. Compare how the answer changes.",
    quiz: {
      question: "Why is the model not the entire AI application?",
      options: ["The app must manage context, tools, validation, logging, and user workflow.", "The model only works with images.", "The app cannot send instructions to the model."],
      answer: 0
    },
    interview: "Explain the difference between model capability and application reliability.",
    evidence: "Create a one-page architecture note for a simple LLM feature, including prompt, context, validation, and logging."
  },
  {
    id: "prompt-context",
    title: "Prompt and Context Engineering",
    tag: "Prompting",
    time: "60 min",
    lesson: "How instructions become behavior",
    explanation: [
      "Prompt engineering is not magic wording. It is interface design for a probabilistic system. You define the task, constraints, audience, examples, output format, and what the model should do when information is missing.",
      "Context engineering goes further. It decides which facts, files, user preferences, retrieved passages, tool results, and prior state are worth placing in the model's limited context window.",
      "A good prompt reduces ambiguity. A good context strategy reduces irrelevant information. Together they make outputs more consistent and easier to evaluate."
    ],
    diagram: "Task\n + constraints\n + examples\n + relevant context\n + output schema\n        |\n        v\nBetter controlled model behavior",
    example: "Instead of asking 'summarize this', ask for 'three bullet points, each with an evidence quote and a risk label, for a technical manager who has two minutes.'",
    code: "prompt = \"\"\"\nYou are reviewing a model evaluation report.\nReturn JSON with keys: summary, risks, next_steps.\nIf the report lacks metrics, set risks to include 'missing metrics'.\n\nReport:\n{report_text}\n\"\"\"",
    codeNotes: [
      "The role is explicit.",
      "The output shape is defined.",
      "A missing-information behavior is specified.",
      "The variable report_text is the context being injected."
    ],
    lab: "Take a messy request you might ask an AI assistant. Rewrite it with role, goal, constraints, examples, and output format.",
    quiz: {
      question: "What is context engineering primarily about?",
      options: ["Selecting the right information to place in the model's context window.", "Making every prompt longer.", "Replacing evaluation with examples."],
      answer: 0
    },
    interview: "What prompt failure modes would you test before shipping an AI feature?",
    evidence: "Create a prompt evaluation table with five test inputs, expected behavior, actual behavior, and fixes."
  },
  {
    id: "embeddings",
    title: "Embeddings and Semantic Search",
    tag: "Retrieval",
    time: "90 min",
    lesson: "Turning meaning into searchable vectors",
    explanation: [
      "An embedding converts text into a list of numbers. The numbers are useful because semantically similar texts should land near each other in vector space.",
      "Keyword search looks for overlapping words. Semantic search looks for related meaning. That is why 'validated training data' can match 'datasets checked before model training' even when the words differ.",
      "Similarity is usually calculated with a distance or angle metric such as cosine similarity. You do not need to memorize the formula first. You need to know its role: compare a query vector with document vectors and rank the closest matches."
    ],
    diagram: "\"validated training data\"\n        |\n        v\nembedding model\n        |\n        v\n[0.18, -0.72, 0.31, 0.09, ...]\n        |\n        v\ncompare with stored document vectors",
    example: "A: 'The model requires validated training data.' B: 'Training datasets should be checked before model training.' C: 'The cafeteria closes at 8 PM.' A should be closer to B than C.",
    code: "from openai import OpenAI\n\nclient = OpenAI()\n\nresponse = client.embeddings.create(\n    model=\"text-embedding-3-small\",\n    input=\"How do I validate a machine learning dataset?\"\n)\n\nvector = response.data[0].embedding\nprint(len(vector))\nprint(vector[:5])",
    codeNotes: [
      "embeddings.create asks an embedding model to represent text numerically.",
      "model selects the embedding model.",
      "input is the text being embedded.",
      "response.data[0].embedding is the vector you store or compare."
    ],
    lab: "Create embeddings for A, B, and C from the example. Compute cosine similarity. Confirm whether similarity(A, B) is greater than similarity(A, C).",
    quiz: {
      question: "Why are embeddings useful for retrieval?",
      options: ["They allow search by meaning, not only exact words.", "They make text impossible to compare.", "They remove the need for documents."],
      answer: 0
    },
    interview: "Your semantic search returns text with similar vocabulary but poor answers. What would you investigate?",
    evidence: "Submit a notebook that embeds three statements, calculates similarities, and explains the ranking."
  },
  {
    id: "rag",
    title: "Building RAG Systems",
    tag: "RAG",
    time: "90 min",
    lesson: "Retrieval before generation",
    explanation: [
      "A language model does not automatically know your private documents or newly created information. RAG solves this by adding a retrieval step before generation.",
      "Without RAG, the flow is question to LLM to answer. With RAG, the system first searches a knowledge base, retrieves relevant passages, builds an augmented prompt, and then asks the model to answer using that evidence.",
      "RAG matters because you cannot send 5,000 documents into every prompt. It is too slow, expensive, and often impossible because of context-window limits. RAG asks: which small pieces are most relevant right now?"
    ],
    diagram: "User question\n   |\n   v\nEmbed or rewrite query\n   |\n   v\nSearch knowledge base\n   |\n   v\nRetrieve passages\n   |\n   v\nQuestion + evidence\n   |\n   v\nLLM grounded answer",
    example: "If a user asks how to validate a dataset, the retriever might return passages about missing labels, schema checks, train/validation splits, and drift checks. The model then answers from those passages instead of guessing.",
    code: "def build_rag_prompt(question, passages):\n    evidence = \"\\n\\n\".join(\n        f\"Source {i + 1}: {text}\" for i, text in enumerate(passages)\n    )\n    return f\"\"\"\nAnswer the question using only the evidence below.\nIf the evidence is insufficient, say what is missing.\n\nEvidence:\n{evidence}\n\nQuestion: {question}\n\"\"\"",
    codeNotes: [
      "The function receives a question and retrieved passages.",
      "Each passage is labeled so citations are easier.",
      "The instruction tells the model to stay grounded.",
      "The model is told what to do when evidence is insufficient."
    ],
    lab: "Create a tiny knowledge base of five synthetic operational notes. Write a function that selects two relevant notes and builds an augmented prompt.",
    quiz: {
      question: "Why not send an entire knowledge base to the LLM?",
      options: ["Context windows and cost make this impractical.", "LLMs cannot process text.", "Vector databases replace LLMs."],
      answer: 0
    },
    interview: "How would you debug a RAG answer that is fluent but not grounded in the retrieved sources?",
    evidence: "Build a minimal RAG flow with ingestion, retrieval, prompt assembly, and a written failure-mode analysis."
  },
  {
    id: "advanced-retrieval",
    title: "Advanced Retrieval",
    tag: "Search",
    time: "75 min",
    lesson: "When basic vector search is not enough",
    explanation: [
      "Basic vector search can fail when the query needs exact terms, dates, IDs, metadata, or domain-specific wording. Advanced retrieval combines multiple signals.",
      "Hybrid search combines semantic similarity with keyword scoring such as BM25. Metadata filtering restricts results by fields like document type, facility, date, or workflow stage. Reranking takes candidate results and reorders them with a stronger model.",
      "Query rewriting and multi-query retrieval help when the user's question is vague. The system creates better search queries, retrieves more candidates, and then filters or reranks them."
    ],
    diagram: "User query\n   |\n   +--> keyword search\n   +--> vector search\n   +--> metadata filter\n           |\n           v\n       candidate docs\n           |\n           v\n        reranker\n           |\n           v\n       final context",
    example: "A query for 'failed materialization yesterday' may need semantic search for similar incident language, keyword search for 'materialization', and metadata filters for date and pipeline stage.",
    code: "retrieval_config = {\n    \"top_k\": 20,\n    \"filters\": {\"doc_type\": \"runbook\", \"environment\": \"production-like\"},\n    \"hybrid\": True,\n    \"rerank_to\": 5\n}",
    codeNotes: [
      "top_k controls how many initial candidates are retrieved.",
      "filters remove irrelevant documents before or after search.",
      "hybrid means combine semantic and keyword signals.",
      "rerank_to keeps the strongest final context."
    ],
    lab: "Design retrieval settings for three questions: exact ID lookup, conceptual explanation, and incident troubleshooting.",
    quiz: {
      question: "What does reranking do?",
      options: ["Reorders retrieved candidates using a stronger relevance signal.", "Deletes the vector database.", "Makes prompts ignore evidence."],
      answer: 0
    },
    interview: "Compare hybrid search, metadata filtering, query rewriting, and reranking.",
    evidence: "Write a retrieval-debug checklist for poor search results."
  },
  {
    id: "rag-eval",
    title: "Evaluating RAG",
    tag: "Evaluation",
    time: "90 min",
    lesson: "Measure retrieval and answers separately",
    explanation: [
      "RAG can fail in two places: retrieval or generation. If retrieval brings the wrong context, the model may answer incorrectly even if it follows instructions. If retrieval is good but generation is bad, the answer may ignore or distort evidence.",
      "Evaluate retrieval with hit rate, recall, precision, and whether the expected source appears in top-k. Evaluate generation with groundedness, answer relevance, citation quality, and refusal behavior.",
      "A practical evaluation set contains questions, expected source documents, expected answer qualities, and examples of insufficient-evidence cases."
    ],
    diagram: "Question set\n   |\n   +--> retrieval metrics: hit rate, recall, precision\n   |\n   +--> answer metrics: groundedness, relevance, citation quality",
    example: "If top-5 retrieval contains the right document but the answer cites the wrong passage, retrieval may be acceptable while generation/citation behavior needs work.",
    code: "def hit_rate(results, expected_doc_id):\n    return int(any(item[\"doc_id\"] == expected_doc_id for item in results))\n\nscore = hit_rate(retrieved_docs, expected_doc_id=\"policy-017\")",
    codeNotes: [
      "results is the list of retrieved documents.",
      "expected_doc_id is the source that should appear.",
      "The function returns 1 for hit and 0 for miss.",
      "Average this across many questions for hit rate."
    ],
    lab: "Create ten evaluation questions for a synthetic policy knowledge base. Label the expected source for each question.",
    quiz: {
      question: "Why evaluate retrieval separately from generation?",
      options: ["They fail in different ways and need different fixes.", "They are always identical.", "Generation metrics automatically measure indexing."],
      answer: 0
    },
    interview: "What metrics would you track before trusting a RAG system in production?",
    evidence: "Create a RAG evaluation sheet with questions, expected sources, retrieved sources, answer quality, and fixes."
  },
  {
    id: "azure-ai",
    title: "Azure AI Engineering",
    tag: "Cloud",
    time: "75 min",
    lesson: "Cloud architecture for AI applications",
    explanation: [
      "Azure AI engineering means turning model access, search, identity, monitoring, and deployment into a repeatable architecture. The cloud pieces matter because production systems need security, scale, and operational controls.",
      "Azure OpenAI provides model deployments. Azure AI Search can store searchable indexes for RAG. Azure AI Foundry helps evaluate, compare, and manage AI app development workflows.",
      "The engineering question is not only which model to call. It is how requests flow through identity, application code, retrieval, model deployment, logging, monitoring, and release controls."
    ],
    diagram: "Web app or API\n   |\n   v\nIdentity and config\n   |\n   +--> Azure AI Search index\n   +--> Azure OpenAI deployment\n   +--> monitoring and logs",
    example: "A RAG app might use Azure AI Search for hybrid retrieval, Azure OpenAI for answer generation, and application logs for latency, token usage, and failed retrievals.",
    code: "AZURE_OPENAI_ENDPOINT=\"https://example.openai.azure.com/\"\nAZURE_OPENAI_DEPLOYMENT=\"gpt-4.1-mini\"\nAZURE_SEARCH_INDEX=\"public-safe-docs\"",
    codeNotes: [
      "Configuration should live outside code.",
      "Endpoint identifies the service location.",
      "Deployment identifies the model deployment name.",
      "Search index identifies the retrieval source."
    ],
    lab: "Draw an Azure RAG architecture with identity, API, search index, model deployment, and monitoring.",
    quiz: {
      question: "What does Azure AI Search often provide in a RAG architecture?",
      options: ["Indexes and retrieval over documents.", "A replacement for all application code.", "A browser stylesheet."],
      answer: 0
    },
    interview: "How would you explain the request path of a cloud-hosted RAG app?",
    evidence: "Create an architecture diagram and a configuration checklist for an Azure-style AI app."
  },
  {
    id: "tool-calling",
    title: "Tool Calling",
    tag: "Tools",
    time: "75 min",
    lesson: "Letting the model request actions safely",
    explanation: [
      "Tool calling lets a model ask application code to run a specific function. The model does not execute the function itself. It emits a structured request, and your application decides whether and how to run it.",
      "A tool schema describes the tool name, purpose, arguments, and argument types. Good schemas reduce invalid calls and make the system easier to test.",
      "Security matters. Some tool calls should require approval, strict validation, or read-only access. Tool results should be treated as untrusted input when they return external data."
    ],
    diagram: "User request\n   |\n   v\nLLM decides tool is needed\n   |\n   v\nstructured tool call\n   |\n   v\napplication validates and runs tool\n   |\n   v\ntool result returned to LLM",
    example: "For 'summarize my latest evaluation run', the model might call get_eval_run(run_id), receive metrics, and then explain the result.",
    code: "tool_schema = {\n    \"name\": \"get_dataset_quality_report\",\n    \"description\": \"Return validation results for a synthetic dataset run.\",\n    \"parameters\": {\n        \"type\": \"object\",\n        \"properties\": {\"run_id\": {\"type\": \"string\"}},\n        \"required\": [\"run_id\"]\n    }\n}",
    codeNotes: [
      "name is the callable function identifier.",
      "description helps the model know when to use it.",
      "parameters define valid arguments.",
      "required prevents incomplete calls."
    ],
    lab: "Design three tools for a dataset readiness assistant: get report, list failed checks, and create remediation plan.",
    quiz: {
      question: "Who actually executes a tool call?",
      options: ["Application code after validation.", "The model directly inside its weights.", "The user's browser bookmarks."],
      answer: 0
    },
    interview: "What can go wrong when tool arguments are not validated?",
    evidence: "Write tool schemas plus validation rules for a small AI assistant."
  },
  {
    id: "agents",
    title: "AI Agents",
    tag: "Agents",
    time: "90 min",
    lesson: "Reason, act, observe, repeat",
    explanation: [
      "An agent is an AI system that can use tools over multiple steps to pursue a goal. The model decides what to do next, the application executes approved actions, and the result is fed back into the loop.",
      "The basic loop is: receive user request, reason about next step, decide whether a tool is needed, call tool, observe result, continue or answer. State keeps track of what has happened.",
      "Agents need boundaries. Use human approval for risky actions, timeouts for long loops, budgets for cost, and evaluation for success. More autonomy without control usually creates more failure modes."
    ],
    diagram: "User request\n   |\n   v\nLLM reasoning\n   |\nNeed tool?\n  | yes                 | no\n  v                     v\ntool call           final answer\n  |\n  v\ntool result\n  |\n  v\nLLM continues",
    example: "A learning agent could inspect your progress, recommend the next lab, generate a quiz, and update a local progress record only after approval.",
    code: "while steps < max_steps:\n    action = model_decide(state)\n    if action.type == \"final\":\n        return action.answer\n    if action.requires_approval:\n        request_human_approval(action)\n    result = run_tool(action)\n    state.append(result)",
    codeNotes: [
      "The loop is bounded by max_steps.",
      "The model proposes an action.",
      "Final answers stop the loop.",
      "Tool results update state for the next step."
    ],
    lab: "Implement a toy agent loop where a model stub chooses between search_notes, calculate_score, and final_answer.",
    quiz: {
      question: "Why should agent loops have step limits?",
      options: ["To control cost, latency, and runaway behavior.", "Because tools cannot return data.", "Because state is always empty."],
      answer: 0
    },
    interview: "When would you use a workflow instead of an autonomous agent?",
    evidence: "Build a toy agent loop with state, two tools, and a stop condition."
  },
  {
    id: "mcp",
    title: "Model Context Protocol",
    tag: "MCP",
    time: "90 min",
    lesson: "A standard way to expose context and tools",
    explanation: [
      "MCP exists because AI clients need a consistent way to discover and use external tools, resources, and prompts. Instead of every integration inventing its own protocol, MCP defines a client/server pattern.",
      "The client is the AI application. The server exposes capabilities. Tools are actions, resources are readable context, and prompts are reusable prompt templates. JSON Schema describes inputs and outputs.",
      "Security boundaries sit at the server and client. The server should expose only intended capabilities. The client should decide what the model can see or invoke."
    ],
    diagram: "AI client\n   |\n   | discovery\n   v\nMCP server\n   +--> tools\n   +--> resources\n   +--> prompts",
    example: "A learning MCP server could expose read_progress, list_lessons, and record_completed_lesson without giving the model access to unrelated files.",
    code: "{\n  \"name\": \"record_completed_lesson\",\n  \"inputSchema\": {\n    \"type\": \"object\",\n    \"properties\": {\"lesson_id\": {\"type\": \"string\"}},\n    \"required\": [\"lesson_id\"]\n  }\n}",
    codeNotes: [
      "The tool name communicates the action.",
      "inputSchema uses JSON Schema.",
      "lesson_id is the only accepted argument.",
      "Narrow schemas reduce accidental overreach."
    ],
    lab: "Sketch an MCP server for this learning site with three tools and two resources.",
    quiz: {
      question: "In MCP, what is a resource?",
      options: ["Readable context exposed by a server.", "A Docker image layer.", "A neural network loss value."],
      answer: 0
    },
    interview: "How would you design MCP permissions for sensitive local files?",
    evidence: "Create a mini MCP design doc with tools, resources, schemas, and security boundaries."
  },
  {
    id: "ai-apis",
    title: "Building AI APIs",
    tag: "API",
    time: "75 min",
    lesson: "Turn AI logic into a service",
    explanation: [
      "An AI API wraps model calls, retrieval, tools, and validation behind predictable routes. This lets other applications use the AI feature without knowing every internal detail.",
      "FastAPI is useful because it gives typed request models, automatic docs, async support, and clean route definitions. A production API should also include health checks, structured logs, configuration, and clear error responses.",
      "The API boundary is where you validate inputs, enforce limits, handle failures, and decide what should be logged."
    ],
    diagram: "Client\n  |\n  v\nPOST /answer\n  |\n  v\nvalidate request\n  |\n  v\nretrieval + model call\n  |\n  v\nvalidated response",
    example: "A POST /dataset-readiness route might accept a dataset summary and return readiness score, missing checks, and recommended next actions.",
    code: "from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass Question(BaseModel):\n    text: str\n\n@app.post(\"/answer\")\ndef answer(question: Question):\n    return {\"answer\": f\"Received: {question.text}\"}\n\n@app.get(\"/health\")\ndef health():\n    return {\"status\": \"ok\"}",
    codeNotes: [
      "FastAPI creates the web app.",
      "Question defines the request shape.",
      "POST /answer receives user input.",
      "GET /health helps deployment systems check the service."
    ],
    lab: "Build a FastAPI app with /health and /readiness endpoints using synthetic input data.",
    quiz: {
      question: "Why add a health endpoint?",
      options: ["To let deployment systems verify the service is alive.", "To train the model automatically.", "To replace request validation."],
      answer: 0
    },
    interview: "What should an AI API log, and what should it avoid logging?",
    evidence: "Create a small FastAPI service with typed request and response models."
  },
  {
    id: "docker",
    title: "Docker",
    tag: "Delivery",
    time: "90 min",
    lesson: "Package the runtime, not just the code",
    explanation: [
      "Docker solves the 'works on my machine' problem by packaging application code with its runtime dependencies. An image is the packaged template. A container is a running instance of that image.",
      "A Dockerfile describes how to build the image. Each instruction creates a layer. Ports expose network traffic. Environment variables configure behavior. Volumes let data live outside the container.",
      "When an app works locally but fails in a container, common causes include missing files, wrong working directory, missing environment variables, unavailable ports, or dependencies that were installed locally but not in the image."
    ],
    diagram: "Dockerfile\n   |\n   v\ndocker build\n   |\n   v\nimage\n   |\n   v\ndocker run\n   |\n   v\ncontainer",
    example: "A FastAPI app can be packaged so another machine runs the same Python version, same dependencies, and same start command.",
    code: "FROM python:3.12-slim\n\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\n\nEXPOSE 8000\nCMD [\"uvicorn\", \"main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\"]",
    codeNotes: [
      "FROM chooses the base image.",
      "WORKDIR sets the directory inside the image.",
      "COPY brings files into the image.",
      "RUN installs dependencies at build time.",
      "CMD starts the service when the container runs."
    ],
    lab: "Containerize your FastAPI readiness API. Run it locally and call /health from outside the container.",
    quiz: {
      question: "What is the difference between an image and a container?",
      options: ["An image is a template; a container is a running instance.", "They are the same thing.", "A container is only a Python file."],
      answer: 0
    },
    interview: "How would you debug a service that works locally but fails in Docker?",
    evidence: "Submit a Dockerfile, run command, and notes from one container debugging issue."
  },
  {
    id: "testing",
    title: "Testing AI Applications",
    tag: "Testing",
    time: "75 min",
    lesson: "Test the software and the AI behavior",
    explanation: [
      "AI applications need normal software tests plus behavior tests. Unit tests check functions. Integration tests check routes, tools, retrieval, and data flow. Evaluation tests check whether outputs are useful and grounded.",
      "Mock LLMs make tests deterministic. Instead of calling a real model in every unit test, return predictable responses. Use real model calls selectively for evaluation suites.",
      "Retrieval tests should verify that expected documents appear for known questions. Tool tests should verify argument validation and error handling."
    ],
    diagram: "Unit tests\n + integration tests\n + retrieval tests\n + evaluation tests\n        |\n        v\nhigher confidence AI app",
    example: "A RAG test can ask 'What checks are required before training?' and assert that the validation checklist document appears in the top-3 retrieved sources.",
    code: "def test_health_endpoint(client):\n    response = client.get(\"/health\")\n    assert response.status_code == 200\n    assert response.json()[\"status\"] == \"ok\"",
    codeNotes: [
      "The test calls the API like a client.",
      "It checks HTTP status.",
      "It checks the expected JSON body.",
      "Simple health tests catch broken deployment wiring."
    ],
    lab: "Write three tests: one API test, one retrieval test, and one mocked LLM response test.",
    quiz: {
      question: "Why mock LLMs in some tests?",
      options: ["To make tests faster, cheaper, and deterministic.", "To avoid writing assertions.", "To remove API routes."],
      answer: 0
    },
    interview: "What is the difference between a regression test and an evaluation set?",
    evidence: "Add a small pytest suite for your capstone API and retrieval logic."
  },
  {
    id: "cicd",
    title: "CI/CD",
    tag: "Automation",
    time: "75 min",
    lesson: "From git push to automated checks",
    explanation: [
      "Continuous integration means every change can automatically run tests. Continuous delivery adds packaging and deployment steps. The point is to catch problems before humans rely on the system.",
      "A GitHub Actions workflow starts when an event occurs, such as push or pull_request. GitHub creates a runner, checks out the repository, installs dependencies, and runs your commands.",
      "For AI apps, CI can run unit tests, retrieval tests, linting, prompt fixture checks, and container builds. Deployment gates can require passing tests before release."
    ],
    diagram: "git push\n   |\n   v\nGitHub event\n   |\n   v\nrunner starts\n   |\n   v\ncheckout code\n   |\n   v\ninstall dependencies\n   |\n   v\nrun tests\n   |\n   v\npass or fail",
    example: "If someone breaks /health, the CI run fails before deployment. That is much cheaper than discovering the API is down after release.",
    code: "name: Test\n\non:\n  push:\n  pull_request:\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with:\n          python-version: \"3.12\"\n      - run: pip install -r requirements.txt\n      - run: pytest",
    codeNotes: [
      "on defines the events that trigger the workflow.",
      "jobs groups work to run.",
      "runs-on chooses the runner environment.",
      "checkout downloads the repository.",
      "pytest runs the test suite."
    ],
    lab: "Add a GitHub Actions workflow that runs tests for your FastAPI app.",
    quiz: {
      question: "What happens after a push triggers a GitHub Actions workflow?",
      options: ["A runner checks out code and runs configured steps.", "GitHub manually reviews every line.", "The browser cache is cleared only."],
      answer: 0
    },
    interview: "What checks would you require before deploying an AI API?",
    evidence: "Create a workflow file and a screenshot or log of a passing run."
  },
  {
    id: "observability",
    title: "AI Observability",
    tag: "Monitoring",
    time: "75 min",
    lesson: "Know how the system behaves after launch",
    explanation: [
      "AI observability tracks the behavior of the full system: latency, errors, token usage, cost, retrieval quality, tool success rates, refusal rates, and user feedback.",
      "Traditional logs tell you whether the service crashed. AI traces help you inspect model inputs, retrieval results, tool calls, and outputs. Metrics reveal trends such as rising cost or degraded retrieval.",
      "Good monitoring separates symptoms from causes. Slow answers might come from retrieval, model latency, tool calls, or network problems."
    ],
    diagram: "Request\n   |\n   +--> latency metric\n   +--> token and cost metric\n   +--> retrieval trace\n   +--> tool trace\n   +--> answer quality signal",
    example: "If grounded answer rate drops after adding new documents, the issue may be chunking, indexing, metadata, or retrieval configuration.",
    code: "log_event({\n    \"route\": \"/answer\",\n    \"latency_ms\": 842,\n    \"retrieved_docs\": 5,\n    \"tokens_in\": 1800,\n    \"tokens_out\": 240,\n    \"tool_errors\": 0\n})",
    codeNotes: [
      "route identifies the feature path.",
      "latency_ms tracks speed.",
      "retrieved_docs helps debug RAG.",
      "tokens_in and tokens_out support cost monitoring."
    ],
    lab: "Define ten metrics for your capstone and label each as reliability, cost, quality, or safety.",
    quiz: {
      question: "What is one AI-specific observability signal?",
      options: ["Retrieval relevance or groundedness.", "Only CPU temperature.", "Only button color."],
      answer: 0
    },
    interview: "How would you investigate a sudden increase in AI feature cost?",
    evidence: "Create an observability plan with metrics, traces, dashboards, and alert thresholds."
  },
  {
    id: "production-architecture",
    title: "Production AI Architecture",
    tag: "Systems",
    time: "90 min",
    lesson: "Design for failure, cost, and change",
    explanation: [
      "Production AI architecture handles unreliability. Model APIs can rate-limit, tools can fail, retrieval can miss, users can submit strange inputs, and costs can spike.",
      "Reliability patterns include retries with backoff, queues, caching, timeouts, circuit breakers, fallbacks, and idempotent operations. Security patterns include least privilege, secrets management, audit logs, and approval gates.",
      "Scalability is not only serving more requests. It is controlling latency, model cost, retrieval index size, deployment safety, and support burden as the system grows."
    ],
    diagram: "Client\n  |\nAPI gateway\n  |\nApp service\n  +--> cache\n  +--> queue\n  +--> retrieval\n  +--> model provider\n  +--> logs and metrics",
    example: "A batch dataset assistant should be idempotent: rerunning a failed job should not duplicate artifacts or corrupt state.",
    code: "def call_with_retry(fn, attempts=3):\n    for attempt in range(attempts):\n        try:\n            return fn()\n        except RateLimitError:\n            sleep(2 ** attempt)\n    raise",
    codeNotes: [
      "The function retries temporary failures.",
      "Backoff reduces pressure on a limited service.",
      "After max attempts, the error is surfaced.",
      "Real code should log each failure."
    ],
    lab: "Design failure handling for three cases: model timeout, retrieval outage, and invalid tool result.",
    quiz: {
      question: "Why use idempotency in production workflows?",
      options: ["Retries can safely repeat without corrupting state.", "It makes prompts shorter.", "It removes the need for logging."],
      answer: 0
    },
    interview: "How would you design a safe rollback for an AI feature?",
    evidence: "Write a production architecture note with failure modes and mitigations."
  },
  {
    id: "fine-tuning",
    title: "Fine-Tuning",
    tag: "Training",
    time: "75 min",
    lesson: "When changing model behavior is worth it",
    explanation: [
      "Fine-tuning updates a model using examples so it better follows a pattern. It is not the first answer to every problem. Many issues are better solved with prompting, retrieval, tools, or better evaluation.",
      "Use prompting when the task is simple. Use RAG when the answer depends on changing knowledge. Consider fine-tuning when you need consistent style, format, classification behavior, or domain-specific patterns that examples can teach.",
      "Fine-tuning requires data quality, train/validation splits, evaluation, and monitoring. Bad training examples can make behavior worse."
    ],
    diagram: "Problem\n   |\n   +--> prompt?\n   +--> RAG?\n   +--> tool?\n   +--> fine-tune?\n   |\n   v\nevaluate before and after",
    example: "If the model lacks current policy facts, use RAG. If it knows the facts but consistently formats reports incorrectly, fine-tuning may help.",
    code: "decision = {\n    \"need_current_knowledge\": True,\n    \"format_consistency_problem\": False,\n    \"enough_high_quality_examples\": False,\n    \"recommended\": \"RAG before fine-tuning\"\n}",
    codeNotes: [
      "The decision should be based on the failure mode.",
      "Current knowledge points toward retrieval.",
      "Format consistency can point toward fine-tuning.",
      "High-quality examples are required for training."
    ],
    lab: "Classify ten AI feature problems as prompt, RAG, tool, fine-tune, or no-AI.",
    quiz: {
      question: "When is RAG often better than fine-tuning?",
      options: ["When answers depend on changing documents.", "When you need no source material.", "When you have no evaluation set."],
      answer: 0
    },
    interview: "What risks would you review before fine-tuning a model?",
    evidence: "Create a fine-tuning decision memo for three synthetic use cases."
  },
  {
    id: "deep-learning",
    title: "Deep Learning Foundations",
    tag: "ML",
    time: "90 min",
    lesson: "Prediction, loss, gradients, update",
    explanation: [
      "Deep learning starts with prediction. A model receives inputs and produces an output. Training compares that output with the truth, calculates a loss, computes gradients, and updates parameters to reduce future loss.",
      "For regression, the model predicts a number. In a concrete-strength project, inputs might describe cement, water, aggregate, age, and other features. The model predicts compressive strength.",
      "The training loop is the heart of learning: prediction, compare with truth, loss, gradients, parameter update, new prediction. Neural networks are flexible function approximators trained by this loop."
    ],
    diagram: "features\n   |\n   v\nprediction\n   |\n   v\ncompare with truth\n   |\n   v\nloss\n   |\n   v\ngradients\n   |\n   v\nupdate parameters",
    example: "If the true concrete strength is 42 MPa and the model predicts 35 MPa, the loss measures the error. Optimization adjusts weights so similar future examples move closer to truth.",
    code: "for x, y_true in training_data:\n    y_pred = model(x)\n    loss = loss_fn(y_pred, y_true)\n    loss.backward()\n    optimizer.step()\n    optimizer.zero_grad()",
    codeNotes: [
      "model(x) makes a prediction.",
      "loss_fn compares prediction to truth.",
      "loss.backward calculates gradients.",
      "optimizer.step updates parameters.",
      "zero_grad clears gradients before the next batch."
    ],
    lab: "Train a tiny regression model on synthetic tabular data. Plot loss over epochs and explain whether learning happened.",
    quiz: {
      question: "What does loss measure?",
      options: ["How wrong the model prediction is compared with truth.", "How many files are in a repo.", "How fast CSS loads."],
      answer: 0
    },
    interview: "Explain backpropagation to someone who understands spreadsheets but not neural networks.",
    evidence: "Submit a regression notebook with loss curve, evaluation metric, and explanation."
  },
  {
    id: "health-ai",
    title: "Health AI Engineering",
    tag: "Specialization",
    time: "90 min",
    lesson: "Responsible AI inside health-system workflows",
    explanation: [
      "Health AI engineering is not just model accuracy. The system must fit clinical or public-health workflows, protect sensitive data, support auditability, and be understandable enough for review.",
      "Interoperability matters because health systems often use EMRs, HMIS, LMIS, and reporting platforms. FHIR-shaped data gives a standard way to represent resources such as Patient, Encounter, Observation, and MedicationRequest.",
      "Validation must include data quality, representativeness, subgroup performance, clinical relevance, workflow fit, and human escalation paths."
    ],
    diagram: "health workflow\n   |\n   v\ndata quality and governance\n   |\n   v\nmodel or RAG system\n   |\n   v\nvalidation and review\n   |\n   v\nmonitored deployment",
    example: "A triage model should be evaluated not only for overall accuracy but also for missed high-risk cases, subgroup performance, calibration, and whether health workers can act on the output.",
    code: "{\n  \"resourceType\": \"Observation\",\n  \"status\": \"final\",\n  \"code\": {\"text\": \"synthetic readiness score\"},\n  \"valueQuantity\": {\"value\": 0.82, \"unit\": \"score\"}\n}",
    codeNotes: [
      "resourceType identifies the FHIR-style resource.",
      "status describes the observation state.",
      "code names what was measured.",
      "valueQuantity carries the synthetic value."
    ],
    lab: "Create five synthetic FHIR-shaped observations and a validation checklist for missing fields.",
    quiz: {
      question: "Why is overall accuracy insufficient for health AI?",
      options: ["Safety, subgroup performance, calibration, and workflow fit also matter.", "Accuracy is never measured.", "Health systems do not use data."],
      answer: 0
    },
    interview: "What documentation would you prepare for a health AI pilot?",
    evidence: "Create a synthetic health AI validation packet with data card, model card, and risk register."
  },
  {
    id: "capstone",
    title: "Capstone",
    tag: "Project",
    time: "multi-week",
    lesson: "ML Dataset Readiness and Operations Copilot",
    explanation: [
      "The capstone turns the course into evidence. You will build a synthetic-data-only copilot that checks dataset readiness, explains risks, serves results through an API, and documents operational readiness.",
      "The project should grow as you progress. Early modules produce prompts and embeddings. RAG modules add retrieval. API and Docker modules turn the logic into a service. Testing, CI/CD, observability, and architecture modules make it production-minded.",
      "The final artifact should be safe to show: use only public-safe or synthetic details. It should demonstrate how you think and build."
    ],
    diagram: "synthetic data\n   |\nvalidation checks\n   |\nreadiness score\n   |\nRAG explanation\n   |\nFastAPI service\n   |\nDocker + CI/CD + monitoring\n   |\nportfolio writeup",
    example: "Given a synthetic dataset manifest, the copilot flags missing labels, schema drift, split imbalance, and incomplete metadata, then recommends next actions with supporting evidence.",
    code: "readiness_report = {\n    \"score\": 0.74,\n    \"blocking_issues\": [\"missing validation split\", \"incomplete label policy\"],\n    \"recommended_next_step\": \"fix blocking issues before training\"\n}",
    codeNotes: [
      "score summarizes readiness.",
      "blocking_issues identify what prevents safe use.",
      "recommended_next_step turns analysis into action.",
      "The final app should explain how it reached the result."
    ],
    lab: "Build the first slice: synthetic manifest input, validation rules, readiness score, and a short explanation.",
    quiz: {
      question: "What makes the capstone portfolio-safe?",
      options: ["It uses synthetic or public-safe data and generalized scenarios.", "It includes confidential production details.", "It depends on private screenshots."],
      answer: 0
    },
    interview: "Walk through your capstone architecture from input data to monitored API response.",
    evidence: "Publish a portfolio writeup with architecture, demo, tests, evaluation, limitations, and next steps."
  }
];

const healthTopics = [
  ["Digital Health Systems", "Learn how EMR, HMIS, LMIS, and reporting workflows shape AI integration. Build an architecture sketch before writing code."],
  ["HL7 and FHIR Basics", "Represent synthetic observations, encounters, and readiness signals with FHIR-shaped JSON so interoperability becomes concrete."],
  ["Data Quality and Lineage", "Check completeness, validity, duplication, drift, representativeness, and provenance before trusting model outputs."],
  ["Clinical-Style Evaluation", "Use sensitivity, specificity, calibration, subgroup analysis, threshold review, and error analysis instead of accuracy alone."],
  ["Governance and Security", "Design access controls, audit logging, privacy review, approval gates, risk registers, and responsible AI documentation."],
  ["Health MLOps", "Operate models with versioning, staged deployment, monitoring, incident response, rollback, and retirement protocols."]
];

const milestones = [
  "Synthetic schema and data generator",
  "Data quality validation report",
  "Embedding and retrieval prototype",
  "RAG prompt with citations and refusal behavior",
  "Baseline readiness model",
  "FastAPI service with /health and /readiness",
  "Dockerfile and local container run",
  "Pytest suite and GitHub Actions workflow",
  "Monitoring metrics and runbook",
  "Model card, data card, and portfolio writeup"
];

const state = JSON.parse(localStorage.getItem("aiLearningState") || '{"done":{},"quiz":{}}');
const moduleList = document.querySelector("#moduleList");
const moduleDetail = document.querySelector("#moduleDetail");
const healthGrid = document.querySelector("#healthGrid");
const capstoneMilestones = document.querySelector("#capstoneMilestones");
const completeCount = document.querySelector("#completeCount");
const quizScore = document.querySelector("#quizScore");

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

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

function renderModules(selectedId = course[0].id) {
  moduleList.innerHTML = "";
  course.forEach((module, index) => {
    const button = document.createElement("button");
    button.className = `module-button ${module.id === selectedId ? "active" : ""}`;
    button.type = "button";
    button.innerHTML = `<span>${index + 1}. ${module.title}</span><small>${module.time}</small>`;
    button.addEventListener("click", () => renderModules(module.id));
    moduleList.appendChild(button);
  });

  const module = course.find((item) => item.id === selectedId);
  moduleDetail.innerHTML = `
    <p class="eyebrow">${module.tag} - ${module.time}</p>
    <h3>${module.title}</h3>
    <p class="lesson-title">${module.lesson}</p>
    <div class="lesson-section">
      <h4>Explanation</h4>
      ${module.explanation.map((paragraph) => `<p>${paragraph}</p>`).join("")}
    </div>
    <div class="lesson-section">
      <h4>System Flow</h4>
      <pre class="diagram"><code>${escapeHtml(module.diagram)}</code></pre>
    </div>
    <div class="lesson-section">
      <h4>Worked Example</h4>
      <p>${module.example}</p>
    </div>
    <div class="lesson-section">
      <h4>Code or Configuration</h4>
      <pre><code>${escapeHtml(module.code)}</code></pre>
      <ul>${module.codeNotes.map((note) => `<li>${note}</li>`).join("")}</ul>
    </div>
    <div class="lesson-section lab-card">
      <h4>Lab</h4>
      <p>${module.lab}</p>
    </div>
    <div class="quiz">
      <h4>Knowledge Check</h4>
      <p>${module.quiz.question}</p>
      <div class="quiz-options">
        ${module.quiz.options.map((option, index) => `
          <button type="button" data-quiz="${module.id}" data-answer="${index}">${option}</button>
        `).join("")}
      </div>
      <p class="quiz-result" id="quiz-${module.id}">${state.quiz[module.id] === true ? "Correct." : state.quiz[module.id] === false ? "Try again." : ""}</p>
    </div>
    <details class="lesson-section">
      <summary>Solution Guidance</summary>
      <p>Start with the smallest working version. Write down your hypothesis before running code, inspect outputs manually, then add one test or metric that would catch the same issue later.</p>
    </details>
    <div class="lesson-section">
      <h4>Engineering Interview Question</h4>
      <p>${module.interview}</p>
    </div>
    <label class="check-row">
      <input type="checkbox" data-done="${module.id}" ${state.done[module.id] ? "checked" : ""}>
      <span><strong>Evidence gate:</strong> ${module.evidence}</span>
    </label>
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
  const module = course.find((item) => item.id === moduleId);
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
