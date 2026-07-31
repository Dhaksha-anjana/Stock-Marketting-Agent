Stock Marketing Agent

[![Python Version](https://img.shields.io/badge/python-3.10%2B-gold.svg)](https://www.python.org/)
[![Framework](https://img.shields.io/badge/Framework-LangGraph%20%7C%20Pydantic-brightgreen.svg)](https://python.langchain.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-success.svg)]()

> An enterprise-grade, multi-agent AI ecosystem combining an **Autonomous 4-Agent Stock Trading Bot Pipeline** with an **Agentic AI Digital Banking Fraud Prevention Engine**. Powered by LangGraph, Scikit-Learn, YFinance, DuckDuckGo, and a luxury **Metallic Gold & Dark Obsidian Web UI**.

---

## 🌟 Key System Features

- 📈 **Interactive Luxury Gold Web Terminal (`http://localhost:8000`)**: Native HTML5 Canvas candlestick & line price charts with live 50/200-SMA, RSI (14), and MACD indicator overlays.
- 🤖 **4 Autonomous Sequential Agents**:
  1. **News & Sentiment Agent**: Scans web headlines via DuckDuckGo to calculate sentiment scores (`-1.0` to `+1.0`).
  2. **Market Predictor Agent**: Analyzes price trends & momentum indicators to predict market direction (`BULLISH`, `BEARISH`, `NEUTRAL`).
  3. **Profit & Loss Risk Agent**: Enforces strict **1% capital risk** ($100 max risk), **2% Stop-Loss**, **6% Take-Profit** (1:3 Risk-to-Reward ratio), and position sizing.
  4. **Execution & Threat Response Agent**: Generates Alpaca paper trading bracket order payloads and emits Explainable AI (XAI) threat alerts.
- 🛡 **Agentic AI Fraud Prevention Engine**: Implements paper formulations (*Bharath Somu, 2024, JoCAAA*) calculating real-time **Fraud Probability Scores ($FPS_i$)**, **Agent Consensus Risk Scores ($ACRS$)**, and **Collaboration Confidence Index ($CCI$)**.
- ⚡ **Alpaca Paper Trading Integration**: Constructs 3-in-1 bracket order schemas with automated stop-loss and limit exit targets.

---

## 🏗 System Architecture Diagram

```text
                                  ┌─────────────────────────────────────────┐
                                  │      TRADER / INVESTOR / BANKING USER   │
                                  └────────────────────┬────────────────────┘
                                                       │
                                                       ▼
                                  ┌─────────────────────────────────────────┐
                                  │      TICKER QUERY / TRANSACTION REQUEST  │
                                  └────────────────────┬────────────────────┘
                                                       │
                                                       ▼
                                  ┌─────────────────────────────────────────┐
                                  │             PLANNER AGENT               │
                                  │     (LangGraph Workflow Orchestrator)   │
                                  └─┬─────────┬─────────┬─────────┬─────────┬─┘
                                    │         │         │         │         │
    ┌─────────────────────────┐     │         │         │         │         │     ┌─────────────────────────┐
    │ DATA INGESTION LAYER    │     │         │         │         │         │     │       DATA LAYER        │
    │                         │     ▼         ▼         ▼         ▼         ▼     │                         │
    │ ┌─────────────────────┐ │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │ ┌─────────────────────┐ │
    │ │ DuckDuckGo News API │ │ │  NEWS   │ │ MARKET  │ │   P&L   │ │ DEVICE/ │ │BEHAVIOR │ │ │ Price Data Storage  │ │
    │ └──────────┬──────────┘ │ │ SENTI-  │ │PREDICTOR│ │  RISK   │ │ NETWORK │ │ ANOMALY │ │ └──────────┬──────────┘ │
    │            │            │ │  MENT   │ │  AGENT  │ │  AGENT  │ │  AGENT  │ │  AGENT  │ │            │            │
    │ ┌──────────▼──────────┐ │ │  AGENT  │ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ │ ┌──────────▼──────────┐ │
    │ │ YFinance Price Data │ │ └────┬────┘      │           │           │           │     │ │ Indicator Processing│ │
    │ └──────────┬──────────┘ │      │           │           │           │           │     │ └──────────┬──────────┘ │
    │            │            │      └───────────┴───────────┼───────────┴───────────┘     │            │            │
    │ ┌──────────▼──────────┐ │                              │                             │ ┌──────────▼──────────┐ │
    │ │ Banking Logs / APIs │ ├──────────────────────────────┘                             │ │ Historical Profiles │ │
    │ └──────────┬──────────┘ │                                                            │ └─────────────────────┘ │
    └────────────┼────────────┘                                                            └─────────────────────────┘
                 │
                 ▼
    ┌─────────────────────────┐
    │   CONNECTIVITY LAYER    │
    │(REST API / WebSockets)  │
    └────────────┬────────────┘
                 │
                 └─────────────────────────────────────┐
                                                       │
                                                       ▼
                                  ┌─────────────────────────────────────────┐
                                  │             VALIDATOR AGENT             │
                                  │(1% Risk Guardrail & Halt Check Manager) │
                                  └────────────────────┬────────────────────┘
                                                       │
                                                       ▼
                                  ┌─────────────────────────────────────────┐
                                  │          EXPLAINABILITY AGENT           │
                                  │ (Explainable AI - XAI Rationale Engine) │
                                  └────────────────────┬────────────────────┘
                                                       │
                                                       ▼
                                  ┌─────────────────────────────────────────┐
                                  │          FINAL RECOMMENDATION           │
                                  │(Approved Trade / Threat Response Action)│
                                  └────────────────────┬────────────────────┘
                                                       │
                                                       ▼
                                  ┌────────────────────┴────────────────────┐
                                  │             OUTPUT CHANNELS             │
                                  │ ┌─────────────────────────────────────┐ │
                                  │ │ Interactive Gold Web UI (Port 8000) │ │
                                  │ ├─────────────────────────────────────┤ │
                                  │ │ Alpaca Paper Trading Brokerage Gateway│ │
                                  │ └─────────────────────────────────────┘ │
                                  └────────────────────┬────────────────────┘
                                                       │
                                                       ▼
                                  ┌─────────────────────────────────────────┐
                                  │                 REPORT                  │
                                  │  (Audit Log & Execution Confirmation)   │
                                  └────────────────────┬────────────────────┘
                                                       │
                                                       ▼
  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │                               SECURITY LAYER - INTERNET OF AGENTS (IoA)                                │
  │                                                                                                         │
  │  ┌───────────────────────────┐   ┌───────────────────────────┐   ┌───────────────────────────────────┐  │
  │  │     ATTACK DETECTION      │   │       DATA PRIVACY        │   │       TRUST SCORE MANAGEMENT      │  │
  │  │(Device Spoofing & VPN Alert) │   │ (Federated Zero PII Leak) │   │(Consensus ACRS & Confidence Index)│  │
  │  └───────────────────────────┘   └───────────────────────────┘   └───────────────────────────────────┘  │
  └─────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 💻 Tech Stack

| Domain | Technologies Used |
| :--- | :--- |
| **Multi-Agent Orchestration** | Python 3.12, LangGraph (`StateGraph`), Pydantic 2.0 |
| **Machine Learning Stack** | Scikit-Learn (Random Forest, Gradient Boosting, Extra Trees, Logistic Regression), Pandas, NumPy |
| **Data Ingestion & APIs** | `yfinance`, `duckduckgo-search`, `alpaca-py` SDK |
| **Frontend UI & Graphics** | Native HTML5 Canvas Engine, Vanilla CSS3 (Luxury Gold Theme), Chart.js, FontAwesome |
| **Web Server** | Python HTTP Server (`serve.py`) |

---

## 🚀 Quick Start & Installation

### 1. Clone Repository & Install Dependencies
```bash
git clone https://github.com/yourusername/aurum-agentic-ai.git
cd aurum-agentic-ai
pip install -r requirements.txt
```

### 2. Launch the Interactive Web Application (Gold UI)
```bash
python serve.py
```
Open your browser and navigate to: **`http://localhost:8000`**

### 3. Run the Autonomous Stock Trading Bot Pipeline (CLI)
```bash
python trading_pipeline.py
```

### 4. Run the Agentic AI Fraud Prevention Machine Learning System
```bash
python fraud_detection_agentic_ai.py
```

---

## 📁 Repository Directory Structure

```text
aurum-agentic-ai/
│
├── index.html                     # Main Web UI HTML layout
├── styles.css                     # Luxury Gold & Dark Obsidian Design System
├── app.js                         # Native HTML5 Canvas Chart & Fraud Simulator Engine
├── trading_pipeline.py            # 4-Agent Autonomous Stock Trading Bot Script
├── fraud_detection_agentic_ai.py  # Multi-Agent Fraud Prevention ML Training Model
├── serve.py                       # Local HTTP Web Server Runner (Port 8000)
├── requirements.txt               # Python package dependencies
└── README.md                      # Project documentation & setup guide
```

---

## 🔬 Research Reference & Citation

The Fraud Prevention Consensus Engine implements the multi-agent equations and federated security framework from:
> **Bharath Somu (2024)**, *"Agentic AI-Enabled Fraud Prevention: Multi-Agent Collaboration Models for Real-Time Threat Detection and Response in Digital Banking"*, Journal of Computational Analysis and Applications (JoCAAA), Vol. 33, No. 8, pp. 4073–4095.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
