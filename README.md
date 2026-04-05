# Agent Flow Visualization

A real-time visualizer for multi-agent orchestration flows, built with **AG2**, **FastAPI**, and **React Native**.

Watch your AI agents talk to each other — rendered live as an interactive node graph on your mobile device.

---

## Demo

https://github.com/user-attachments/assets/41839b9b-7b99-4505-8483-cc81d413027e

---

## Overview

Agent Flow Visualization bridges the gap between running multi-agent AI workflows and understanding what is actually happening inside them. As agents exchange messages, tool calls, and handoffs, the app renders each participant as a node and each interaction as a directed edge — giving you a live, scrollable graph of the entire conversation.

The project is split into two parts:

| Part | Directory | Purpose |
|---|---|---|
| **Backend** | `app/` | Python server that runs AG2 multi-agent pipelines and streams messages over WebSockets |
| **Frontend** | `agentflow/` | React Native app that connects to the WebSocket stream and renders the agent graph |

---

## Technical Stack

### Backend

| Technology | Role |
|---|---|
| **Python 3** | Runtime |
| **FastAPI** | HTTP API server (port 8000) |
| **Uvicorn** | ASGI server |
| **AG2 (`ag2[openai]`)** | Multi-agent orchestration framework (formerly AutoGen) |
| **AG2 WebSocket IO** | Streams agent message events to connected clients (port 8765) |
| **Azure OpenAI / OpenAI** | LLM backend (`gpt-4o-mini` via Azure OpenAI by default) |

### Frontend

| Technology | Role |
|---|---|
| **React Native 0.79** | Cross-platform mobile UI (iOS & Android) |
| **TypeScript** | Type-safe component and data model layer |
| **React Navigation** | Native stack navigation between Home, Flow, and Chat screens |
| **react-native-svg** | SVG-based graph rendering (nodes, directed edges, arrowheads) |
| **WebSocket API** | Receives real-time agent events from the backend |
| **ngrok** | Exposes the local WebSocket server to a physical device for testing |

---

## Architecture

```
┌──────────────────────────────────────────┐
│              React Native App            │
│                                          │
│  HomeScreen ──► AgentFlow (WebSocketChat)│
│                    │                     │
│          ┌─────────┴──────────┐          │
│          │  Chat View  │  Graph View     │
│          │  (FlatList) │  (AgentFlowGraph│
│          │             │   + SVG)        │
│          └─────────────┘                 │
└────────────────┬─────────────────────────┘
                 │  WebSocket (wss://)
                 │
┌────────────────▼─────────────────────────┐
│          Python Backend                  │
│                                          │
│  FastAPI (port 8000)                     │
│    └─ POST /chat  ──► HTTP agent runner  │
│                                          │
│  AG2 WebSocket Server (port 8765)        │
│    └─ on_connect() ──► agent pipeline    │
└──────────────────────────────────────────┘
```

**Message flow:**
1. The user types a message in the React Native app and it is sent over a WebSocket connection.
2. The Python `on_connect` handler receives the message and triggers an AG2 agent pipeline.
3. As the agents collaborate, AG2 emits structured JSON events (sender, recipient, content, type) back through the WebSocket.
4. The frontend parses each event, builds a `Message[]` array, and feeds it to `generateGraphData`.
5. `generateGraphData` derives a set of `Node` and `Edge` objects (positioned in a circle) from the message history.
6. `AgentFlowGraph` renders the graph live using `react-native-svg` with neon-styled circles and directed arrows.

---

## Project Structure

```
agent-flow-visualization/
├── app/                          # Python backend
│   ├── main.py                   # FastAPI + AG2 WebSocket server entry point
│   ├── core/
│   │   └── config.py             # LLM configuration (Azure OpenAI / OpenAI)
│   ├── api/
│   │   └── api_manager.py        # HTTP /chat route handler
│   └── agents/
│       ├── agentchat_websockets.py   # WebSocket on_connect handler
│       ├── agent_manager.py          # Sequential chat: curriculum planning demo
│       ├── weather_agents.py         # Tool-calling demo (weather forecast)
│       ├── financial_group.py        # Group chat: financial compliance review
│       ├── tech_support_group.py     # Group chat: tech support triage
│       └── heirerarchical_research.py # Hierarchical multi-agent research pipeline
│
├── agentflow/                    # React Native frontend
│   ├── App.tsx                   # Navigation container and stack definition
│   ├── HomeScreen.tsx            # Landing screen with "Visualize" button
│   ├── AgentFlow.tsx             # Main screen: WebSocket client + view toggle
│   ├── AgentFlowGraph.tsx        # SVG graph renderer (nodes + directed edges)
│   ├── GenerateGraphData.tsx     # Derives graph nodes/edges from message history
│   ├── DataModels.tsx            # Shared TypeScript interfaces and enums
│   ├── ViewToggle.tsx            # Toggle button between Chat and Graph views
│   ├── AgentChat.tsx             # HTTP-based agent chat (curriculum planning)
│   └── WebsocketChat.tsx         # WebSocket-based chat with graph integration
│
├── requirements.txt              # Python dependencies
├── create-frontend.sh            # Scaffold script for the React Native project
└── .env                          # Environment variables (API keys)
```

---

## Agent Pipelines

The backend ships with several ready-to-run agent patterns that demonstrate different AG2 orchestration styles.

### 1. Sequential Chat — Curriculum Planning (`agent_manager.py`)
A teacher agent orchestrates three sequential conversations: a curriculum agent picks a topic, a planner agent writes a lesson plan (with one revision round), and a formatter agent outputs the final structured result. Demonstrates AG2's `initiate_chats` with summary passing.

### 2. Tool-Calling Agents — Weather (`weather_agents.py`)
A chatbot agent and a user proxy collaborate to answer weather questions. The chatbot calls a registered `weather_forecast(city)` function via tool use, and the result is routed back. Demonstrates function registration and `UserProxyAgent` execution.

### 3. Group Chat — Financial Compliance (`financial_group.py`)
A `finance_bot` reviews randomly generated transactions and either approves or flags them. A `summary_bot` then produces a markdown table of results. Uses AG2's `AutoPattern` and `initiate_group_chat`.

### 4. Group Chat — Tech Support (`tech_support_group.py`)
A multi-agent tech support triage pipeline that routes user issues through specialized agents using AG2's group chat pattern.

### 5. Hierarchical Research (`heirerarchical_research.py`)
A three-level hierarchy — Executive → Managers (A, B, C) → Specialists — that researches renewable energy technologies. Specialists submit findings via structured `ReplyResult` targets, managers consolidate team output, and the executive produces a final report. Demonstrates AG2's `DefaultPattern` with `ContextVariables`, `OnCondition`, and `AgentTarget` routing.

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- Xcode (for iOS) or Android Studio (for Android)
- An OpenAI or Azure OpenAI API key

### Backend Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Set your API key
export OPENAI_API_KEY=your_key_here

# Start the server
uvicorn app.main:app --reload
```

The FastAPI server starts on `http://127.0.0.1:8000` and the AG2 WebSocket server starts on `ws://127.0.0.1:8765`.

> **Note:** To test on a physical device, use [ngrok](https://ngrok.com) to expose the WebSocket port:
> ```bash
> ngrok http 8765
> ```
> Then update `WS_URL` in `agentflow/AgentFlow.tsx` with the generated `wss://` URL.

### Frontend Setup

```bash
cd agentflow

# Install dependencies
npm install

# iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

### LLM Configuration

Edit `app/core/config.py` to point at your preferred LLM provider:

```python
# Azure OpenAI (default)
llm_config = LLMConfig(
    config_list=[{
        "api_type": "azure",
        "api_key": os.environ["OPENAI_API_KEY"],
        "api_version": "2024-12-01-preview",
        "base_url": "https://<your-resource>.openai.azure.com/",
        "model": "gpt-4o-mini",
    }],
    temperature=0.7
)

# OpenAI (alternative)
llm_config = LLMConfig(
    config_list=[{
        "api_type": "openai",
        "api_key": os.environ["OPENAI_API_KEY"],
        "model": "gpt-4o-mini",
    }],
    temperature=0.7
)
```

---

## How the Graph Works

The graph is built entirely from the WebSocket message stream — no additional metadata required.

1. **`GenerateGraphData.tsx`** iterates over all received `Message` objects and builds a `Map<id, Node>`. Each unique `sender` and `recipient` becomes a node. Nodes are positioned evenly around a circle whose radius scales with the number of participants.
2. **Node types** are inferred from the agent name: names starting with `"tool"` render as 🛠️, all others as 🤖.
3. **Edges** are added for every `sender → recipient` message. Tool response messages generate a reverse edge `recipient → sender` to show the return path.
4. **`AgentFlowGraph.tsx`** renders the graph using `react-native-svg`. Lines are drawn between node centers, and an arrowhead polygon is placed at each edge tip. Tapping a node opens a modal showing the agent's name, type, and last message output.
5. The graph re-renders on every new message, so the visualization grows incrementally as the conversation progresses.

---

## Switching Agent Pipelines

To run a different agent pattern, edit `app/agents/agentchat_websockets.py` and uncomment the desired pipeline:

```python
def on_connect(iostream: IOWebsockets) -> None:
    initial_msg = iostream.input()
    # run_weather_agents(llm_config, initial_msg)   # Weather tool demo
    # run_group(llm_config)                          # Financial compliance
    tech_support_group(llm_config, initial_msg)      # Tech support (active)
    # research_group(llm_config, initial_msg)        # Hierarchical research
```

---

## License

See [LICENSE](LICENSE).
