"""
===============================================================================
AGENTIC AI FRAUD PREVENTION SYSTEM
Multi-Agent Collaboration Models for Real-Time Threat Detection in Digital Banking
Based on Research Paper: Bharath Somu (2024), JoCAAA Vol 33, No 8, pp. 4073-4095
===============================================================================
Key Paper Formulas Implemented:
  1. Fraud Probability Score (FPS_i): FPS_i = sigmoid(sum(w_j * f_ij))   [Equ 1, Page 4]
  2. Agent Consensus Risk Score (ACRS): ACRS = (1/k) * sum(FPS_a)        [Equ 2, Page 8]
  3. Collaboration Confidence Index (CCI): CCI = sum(delta_a * r_a) / sum(r_a) [Equ 3, Page 13]
===============================================================================
4 Specialized Autonomous Agents:
  Agent 1: TransactionVelocityAgent     (Transaction Amount, Velocity & Frequency Monitor)
  Agent 2: BehavioralAnomalyAgent       (Login Failures, Session Length & Habit Monitor)
  Agent 3: DeviceNetworkSecurityAgent   (Device ID Spoofing, Proxy & Geolocation Monitor)
  Agent 4: ThreatResponseActionAgent    (Explainable AI Consensus, Rule Enforcement & Response)
===============================================================================
"""

import sys
import os
import math
from typing import Dict, Any, List, Optional
import numpy as np
import pandas as pd

# Standardize output encoding for Windows CLI
if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Scikit-Learn Machine Learning Stack
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, ExtraTreesClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, average_precision_score, confusion_matrix
)


# =============================================================================
# 1. SYNTHETIC BANKING TRANSACTION DATASET GENERATOR
# =============================================================================

def generate_digital_banking_dataset(n_samples: int = 10000, fraud_ratio: float = 0.01, random_state: int = 42) -> pd.DataFrame:
    """
    Generates a realistic, imbalanced digital banking transaction dataset mimicking real-world
    account fraud, SIM swaps, credential stuffing, and device ID spoofing.
    """
    np.random.seed(random_state)
    n_fraud = int(n_samples * fraud_ratio)
    n_legit = n_samples - n_fraud

    # --- LEGITIMATE TRANSACTIONS (99%) ---
    legit_data = {
        "amount_usd": np.random.exponential(scale=75.0, size=n_legit) + 5.0,
        "amount_zscore": np.random.normal(loc=0.0, scale=0.8, size=n_legit),
        "velocity_1h": np.random.poisson(lam=1.1, size=n_legit),
        "time_of_day_hours": np.random.randint(6, 23, size=n_legit),
        "login_failure_count": np.random.choice([0, 1, 2], p=[0.92, 0.06, 0.02], size=n_legit),
        "session_duration_sec": np.random.gamma(shape=3.0, scale=40.0, size=n_legit) + 10.0,
        "device_id_change": np.random.choice([0, 1], p=[0.95, 0.05], size=n_legit),
        "ip_proxy_vpn": np.random.choice([0, 1], p=[0.97, 0.03], size=n_legit),
        "location_dist_km": np.random.exponential(scale=15.0, size=n_legit),
        "is_international": np.random.choice([0, 1], p=[0.96, 0.04], size=n_legit),
        "is_fraud": np.zeros(n_legit, dtype=int)
    }

    # --- FRAUDULENT TRANSACTIONS (1%) ---
    fraud_data = {
        "amount_usd": np.random.exponential(scale=800.0, size=n_fraud) + 250.0,
        "amount_zscore": np.random.normal(loc=3.2, scale=1.2, size=n_fraud),
        "velocity_1h": np.random.poisson(lam=5.5, size=n_fraud) + 2,
        "time_of_day_hours": np.random.choice([1, 2, 3, 4, 23], size=n_fraud),
        "login_failure_count": np.random.choice([0, 1, 2, 3, 4, 5], p=[0.1, 0.1, 0.2, 0.3, 0.2, 0.1], size=n_fraud),
        "session_duration_sec": np.random.exponential(scale=15.0, size=n_fraud) + 2.0,
        "device_id_change": np.random.choice([0, 1], p=[0.20, 0.80], size=n_fraud),
        "ip_proxy_vpn": np.random.choice([0, 1], p=[0.25, 0.75], size=n_fraud),
        "location_dist_km": np.random.exponential(scale=850.0, size=n_fraud) + 100.0,
        "is_international": np.random.choice([0, 1], p=[0.40, 0.60], size=n_fraud),
        "is_fraud": np.ones(n_fraud, dtype=int)
    }

    df_legit = pd.DataFrame(legit_data)
    df_fraud = pd.DataFrame(fraud_data)
    df = pd.concat([df_legit, df_fraud], ignore_index=True)
    df = df.sample(frac=1.0, random_state=random_state).reset_index(drop=True)
    
    df["amount_usd"] = df["amount_usd"].round(2)
    df["amount_zscore"] = df["amount_zscore"].round(2)
    df["location_dist_km"] = df["location_dist_km"].round(1)
    df["session_duration_sec"] = df["session_duration_sec"].round(1)
    return df


# =============================================================================
# 2. SPECIALIZED AGENT CLASSIFIER MODULES (AGENTS 1 - 4)
# =============================================================================

class TransactionVelocityAgent:
    """
    Agent 1: Specialized in transaction amounts, velocity spikes, and frequency anomalies.
    Equ 1 (FPS_1): FPS_1 = sigmoid(w_1 * f_1)
    """
    def __init__(self):
        self.name = "Agent_1_TransactionVelocity"
        self.features = ["amount_usd", "amount_zscore", "velocity_1h", "time_of_day_hours", "is_international"]
        self.model = RandomForestClassifier(n_estimators=100, max_depth=8, class_weight="balanced", random_state=42)
        self.scaler = StandardScaler()
        self.reliability_score = 0.5

    def fit(self, X_train: pd.DataFrame, y_train: pd.Series):
        X_scaled = self.scaler.fit_transform(X_train[self.features])
        self.model.fit(X_scaled, y_train)

    def predict_fps(self, X: pd.DataFrame) -> np.ndarray:
        X_scaled = self.scaler.transform(X[self.features])
        probs = self.model.predict_proba(X_scaled)[:, 1]
        return probs


class BehavioralAnomalyAgent:
    """
    Agent 2: Specialized in login failure bursts, brief session duration, and user habit deviations.
    Equ 1 (FPS_2): FPS_2 = sigmoid(w_2 * f_2)
    """
    def __init__(self):
        self.name = "Agent_2_BehavioralAnomaly"
        self.features = ["login_failure_count", "session_duration_sec", "amount_zscore", "velocity_1h"]
        self.model = GradientBoostingClassifier(n_estimators=100, max_depth=4, random_state=42)
        self.scaler = StandardScaler()
        self.reliability_score = 0.5

    def fit(self, X_train: pd.DataFrame, y_train: pd.Series):
        X_scaled = self.scaler.fit_transform(X_train[self.features])
        self.model.fit(X_scaled, y_train)

    def predict_fps(self, X: pd.DataFrame) -> np.ndarray:
        X_scaled = self.scaler.transform(X[self.features])
        probs = self.model.predict_proba(X_scaled)[:, 1]
        return probs


class DeviceNetworkSecurityAgent:
    """
    Agent 3: Specialized in device ID spoofing, proxy/VPN detection, and geolocation jumps.
    Equ 1 (FPS_3): FPS_3 = sigmoid(w_3 * f_3)
    """
    def __init__(self):
        self.name = "Agent_3_DeviceNetwork"
        self.features = ["device_id_change", "ip_proxy_vpn", "location_dist_km", "is_international"]
        self.model = LogisticRegression(class_weight="balanced", random_state=42)
        self.scaler = StandardScaler()
        self.reliability_score = 0.5

    def fit(self, X_train: pd.DataFrame, y_train: pd.Series):
        X_scaled = self.scaler.fit_transform(X_train[self.features])
        self.model.fit(X_scaled, y_train)

    def predict_fps(self, X: pd.DataFrame) -> np.ndarray:
        X_scaled = self.scaler.transform(X[self.features])
        probs = self.model.predict_proba(X_scaled)[:, 1]
        return probs


class ThreatResponseActionAgent:
    """
    Agent 4: Explainable AI Threat Response & Automated Action Enforcement Agent.
    Role: Evaluates holistic risk across all features, calculates XAI threat scores (FPS_4),
          enforces policy rules, and executes real-time response actions (BLOCK, CHALLENGE_MFA, ALLOW).
    Equ 1 (FPS_4): FPS_4 = sigmoid(w_4 * f_all)
    """
    def __init__(self):
        self.name = "Agent_4_ThreatResponseAction"
        self.features = [
            "amount_usd", "amount_zscore", "velocity_1h", "login_failure_count",
            "device_id_change", "ip_proxy_vpn", "location_dist_km", "is_international"
        ]
        self.model = ExtraTreesClassifier(n_estimators=100, max_depth=6, class_weight="balanced", random_state=42)
        self.scaler = StandardScaler()
        self.reliability_score = 0.5

    def fit(self, X_train: pd.DataFrame, y_train: pd.Series):
        X_scaled = self.scaler.fit_transform(X_train[self.features])
        self.model.fit(X_scaled, y_train)

    def predict_fps(self, X: pd.DataFrame) -> np.ndarray:
        X_scaled = self.scaler.transform(X[self.features])
        probs = self.model.predict_proba(X_scaled)[:, 1]
        return probs

    def generate_xai_decision(self, transaction_row: pd.Series, acrs: float, cci: float, fps_list: list) -> Dict[str, Any]:
        """
        Agent 4 generates Explainable AI (XAI) threat response and alert classification.
        Rules:
          - ACRS >= 0.65 -> BLOCK_TRANSACTION (Red Alert)
          - 0.35 <= ACRS < 0.65 -> STEP_UP_MFA (Yellow Alert)
          - ACRS < 0.35 -> ALLOW (Green Alert)
        """
        if acrs >= 0.65:
            decision = "BLOCK_TRANSACTION"
            action_code = "RED_ALERT"
        elif acrs >= 0.35:
            decision = "STEP_UP_MFA"
            action_code = "YELLOW_ALERT"
        else:
            decision = "ALLOW"
            action_code = "GREEN_ALERT"

        explanation = (
            f"Consensus Risk (ACRS): {acrs:.4f} | Confidence Index (CCI): {cci:.4f} | "
            f"Agent Scores -> Transaction: {fps_list[0]:.3f}, Behavioral: {fps_list[1]:.3f}, "
            f"Device/Net: {fps_list[2]:.3f}, ThreatResponse: {fps_list[3]:.3f}"
        )

        return {
            "decision": decision,
            "action_code": action_code,
            "acrs": round(acrs, 4),
            "cci": round(cci, 4),
            "explanation": explanation
        }


# =============================================================================
# 3. CONSENSUS & THREAT RESPONSE MANAGER (ACRS & CCI)
# =============================================================================

class AgenticConsensusEngine:
    """
    Implements Equations 2 and 3 from paper:
    - Agent Consensus Risk Score (ACRS): ACRS = (1/k) * sum(FPS_a)
    - Collaboration Confidence Index (CCI): CCI = sum(delta_a * r_a) / sum(r_a)
    """

    def __init__(self, agents: List[Any]):
        self.agents = agents
        self.k = len(agents)

    def evaluate_reliability(self, X_val: pd.DataFrame, y_val: pd.Series):
        """Calibrates historical reliability score (r_a) for each agent using ROC-AUC."""
        for agent in self.agents:
            fps = agent.predict_fps(X_val)
            auc = roc_auc_score(y_val, fps)
            agent.reliability_score = max(auc, 0.5)

    def predict_consensus(self, X: pd.DataFrame, agreement_threshold: float = 0.25) -> Dict[str, np.ndarray]:
        """
        Computes ACRS and CCI for a batch of transactions X across all k=4 agents.
        """
        n = len(X)
        fps_matrix = np.zeros((n, self.k))

        for idx, agent in enumerate(self.agents):
            fps_matrix[:, idx] = agent.predict_fps(X)

        # 1. Equation 2: Agent Consensus Risk Score (ACRS)
        acrs = np.mean(fps_matrix, axis=1)

        # 2. Equation 3: Collaboration Confidence Index (CCI)
        reliability_weights = np.array([agent.reliability_score for agent in self.agents])
        sum_weights = np.sum(reliability_weights)

        cci = np.zeros(n)
        for i in range(n):
            deltas = (np.abs(fps_matrix[i, :] - acrs[i]) < agreement_threshold).astype(float)
            cci[i] = np.sum(deltas * reliability_weights) / sum_weights

        return {
            "acrs": acrs,
            "cci": cci,
            "fps_matrix": fps_matrix
        }


# =============================================================================
# 4. MODEL TRAINING & BENCHMARK EVALUATION PIPELINE
# =============================================================================

def train_and_evaluate_system():
    print("=" * 85)
    print("      AGENTIC AI FRAUD PREVENTION: MULTI-AGENT COLLABORATION TRAINING PIPELINE")
    print("      Reference: Bharath Somu (2024), JoCAAA Vol 33, No 8, pp. 4073-4095")
    print("=" * 85)

    # 1. Generate Synthetic Banking Transaction Dataset
    print("\n[Step 1] Generating digital banking transaction dataset (10,000 transactions)...")
    df = generate_digital_banking_dataset(n_samples=10000, fraud_ratio=0.01, random_state=42)
    
    n_total = len(df)
    n_fraud = df["is_fraud"].sum()
    n_legit = n_total - n_fraud
    print(f"         ✔ Dataset shape: {df.shape}")
    print(f"         ✔ Legitimate Transactions: {n_legit} ({n_legit/n_total*100:.2f}%)")
    print(f"         ✔ Fraudulent Transactions : {n_fraud} ({n_fraud/n_total*100:.2f}%)")

    # 2. Train / Test Split
    X = df.drop(columns=["is_fraud"])
    y = df["is_fraud"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42, stratify=y)
    X_tr, X_val, y_tr, y_val = train_test_split(X_train, y_train, test_size=0.25, random_state=42, stratify=y_train)

    print(f"         ✔ Train Split: {len(X_tr)} samples | Val Split: {len(X_val)} samples | Test Split: {len(X_test)} samples")

    # 3. Instantiate & Train 4 Specialized Agents
    print("\n[Step 2] Training 4 Specialized Multi-Agent Intelligence Modules...")
    agent1 = TransactionVelocityAgent()
    agent2 = BehavioralAnomalyAgent()
    agent3 = DeviceNetworkSecurityAgent()
    agent4 = ThreatResponseActionAgent()

    agents = [agent1, agent2, agent3, agent4]

    for agent in agents:
        agent.fit(X_tr, y_tr)
        print(f"         ✔ Trained: {agent.name}")

    # 4. Calibrate Agent Reliability Weights (Equ 3)
    consensus_engine = AgenticConsensusEngine(agents)
    consensus_engine.evaluate_reliability(X_val, y_val)
    print("\n[Step 3] Calibrating Agent Reliability Scores (r_a) for CCI Equation:")
    for agent in agents:
        print(f"         • {agent.name:<32} Reliability Weight (r_a): {agent.reliability_score:.4f}")

    # 5. Evaluate Test Benchmarks: 4 Agents vs Multi-Agent Consensus (ACRS)
    print("\n[Step 4] Evaluating Performance Benchmarks on Hold-Out Test Set (2,000 Transactions)...")
    print("-" * 85)

    results = []

    for agent in agents:
        fps = agent.predict_fps(X_test)
        y_pred = (fps >= 0.50).astype(int)
        
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, zero_division=0)
        rec = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        roc_auc = roc_auc_score(y_test, fps)
        pr_auc = average_precision_score(y_test, fps)

        results.append({
            "Model / Engine": agent.name,
            "ROC-AUC": roc_auc,
            "PR-AUC": pr_auc,
            "Precision": prec,
            "Recall": rec,
            "F1-Score": f1,
            "Accuracy": acc
        })

    # Multi-Agent Consensus (ACRS)
    consensus_out = consensus_engine.predict_consensus(X_test)
    acrs_scores = consensus_out["acrs"]
    y_pred_consensus = (acrs_scores >= 0.50).astype(int)

    acc = accuracy_score(y_test, y_pred_consensus)
    prec = precision_score(y_test, y_pred_consensus, zero_division=0)
    rec = recall_score(y_test, y_pred_consensus, zero_division=0)
    f1 = f1_score(y_test, y_pred_consensus, zero_division=0)
    roc_auc = roc_auc_score(y_test, acrs_scores)
    pr_auc = average_precision_score(y_test, acrs_scores)

    results.append({
        "Model / Engine": "🌟 MULTI-AGENT CONSENSUS (ACRS)",
        "ROC-AUC": roc_auc,
        "PR-AUC": pr_auc,
        "Precision": prec,
        "Recall": rec,
        "F1-Score": f1,
        "Accuracy": acc
    })

    results_df = pd.DataFrame(results)
    print(results_df.to_string(index=False, float_format=lambda x: f"{x:.4f}"))
    print("-" * 85)

    # Confusion Matrix for ACRS Consensus
    cm = confusion_matrix(y_test, y_pred_consensus)
    tn, fp, fn, tp = cm.ravel()
    print("\n[Confusion Matrix - Multi-Agent ACRS Consensus]")
    print(f"  • True Negatives  (Legitimate Allowed) : {tn}")
    print(f"  • False Positives (False Alarms)       : {fp}")
    print(f"  • False Negatives (Missed Fraud)       : {fn}")
    print(f"  • True Positives  (Fraud Blocked)      : {tp}")

    # 6. Real-Time Transaction Inference Simulation with Agent 4 XAI Decisions
    print("\n[Step 5] Simulating Real-Time Transaction Threat Analysis & XAI Decision Alerts...")
    print("=" * 85)

    fraud_indices = y_test[y_test == 1].index[:2].tolist()
    legit_indices = y_test[y_test == 0].index[:1].tolist()
    sample_indices = fraud_indices + legit_indices

    for i, idx in enumerate(sample_indices, 1):
        row = X_test.loc[idx]
        actual_label = "FRAUD" if y_test.loc[idx] == 1 else "LEGITIMATE"
        
        sample_df = pd.DataFrame([row])
        out = consensus_engine.predict_consensus(sample_df)
        acrs_val = float(out["acrs"][0])
        cci_val = float(out["cci"][0])
        fps_list = out["fps_matrix"][0].tolist()

        xai = agent4.generate_xai_decision(row, acrs_val, cci_val, fps_list)

        print(f"\nTransaction Sample #{i} [Actual Ground Truth: {actual_label}]")
        print(f"  • Amount: ${row['amount_usd']} | Z-Score: {row['amount_zscore']} | Velocity 1h: {int(row['velocity_1h'])}")
        print(f"  • Failed Logins: {int(row['login_failure_count'])} | Device Change: {bool(row['device_id_change'])} | VPN/Proxy: {bool(row['ip_proxy_vpn'])}")
        print(f"  • Decision Alert      : [{xai['action_code']}] -> {xai['decision']}")
        print(f"  • Agent Consensus ACRS: {xai['acrs']} (Equation 2)")
        print(f"  • Confidence Index CCI: {xai['cci']} (Equation 3)")
        print(f"  • Explanation         : {xai['explanation']}")

    print("\n" + "=" * 85)
    print("✔ MODEL TRAINING & EVALUATION COMPLETED SUCCESSFULLY!")
    print("=" * 85 + "\n")


if __name__ == "__main__":
    train_and_evaluate_system()
