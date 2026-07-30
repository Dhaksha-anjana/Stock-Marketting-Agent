/* ==========================================================================
   AURUM AGENTIC AI - COMPLETE INTERACTIVE APP ENGINE (JS)
   Features: Pure Native HTML5 Canvas Financial Trading Charts,
             4-Agent Sequential Pipeline Visualizer & Terminal Log Stream,
             Agentic Fraud Prevention Lab ($FPS$, $ACRS$, $CCI$ Math).
   ========================================================================== */

// --- Global Application State ---
let currentTicker = "NVDA";
let showSMA = true;
let showRSI = true;
let showMACD = true;
let chartAnimationId = null;

// Mock Stock Database with Realistic Price History & Indicators
const stockDatabase = {
  "NVDA": {
    name: "NVDA - NVIDIA CORP.",
    price: 150.00,
    change: "+4.25%",
    isUp: true,
    sentiment: 0.50,
    sentimentText: "BULLISH MOOD",
    stance: "BULLISH",
    justification: "Price ($150.00) sits above 50-SMA ($145.00) with positive sentiment (+0.50) and MACD crossover.",
    basePrice: 135,
    volatility: 3.5
  },
  "AAPL": {
    name: "AAPL - APPLE INC.",
    price: 224.50,
    change: "+0.85%",
    isUp: true,
    sentiment: 0.35,
    sentimentText: "MODERATE BULLISH",
    stance: "BULLISH",
    justification: "Price ($224.50) trades steadily above 200-SMA ($210.00) with consistent institutional inflows.",
    basePrice: 210,
    volatility: 2.2
  },
  "TSLA": {
    name: "TSLA - TESLA INC.",
    price: 218.30,
    change: "-1.10%",
    isUp: false,
    sentiment: -0.20,
    sentimentText: "BEARISH MOOD",
    stance: "BEARISH",
    justification: "Price ($218.30) fell below 50-SMA ($225.00) with RSI at 38 indicating downside momentum.",
    basePrice: 230,
    volatility: 5.0
  },
  "GOLD": {
    name: "XAU/USD - GOLD SPOT",
    price: 2385.50,
    change: "+1.45%",
    isUp: true,
    sentiment: 0.65,
    sentimentText: "STRONG BULLISH",
    stance: "BULLISH",
    justification: "Gold trades at multi-month highs above 50-SMA ($2,320.00) supported by central bank buying.",
    basePrice: 2300,
    volatility: 15.0
  },
  "BTC-USD": {
    name: "BTC/USD - BITCOIN",
    price: 67420.00,
    change: "+3.12%",
    isUp: true,
    sentiment: 0.55,
    sentimentText: "BULLISH MOOD",
    stance: "BULLISH",
    justification: "Bitcoin broke out above $65,000 resistance with MACD bullish signal line divergence.",
    basePrice: 62000,
    volatility: 650.0
  }
};

// =============================================================================
// 1. INITIALIZATION & NAVIGATION
// =============================================================================

document.addEventListener("DOMContentLoaded", () => {
  renderNativeFinancialChart();
  updateFraudSimulation();

  window.addEventListener("resize", () => {
    renderNativeFinancialChart();
  });
});

function switchTab(tabId) {
  document.querySelectorAll(".nav-tab").forEach(tab => tab.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(content => content.classList.remove("active"));

  const targetTabBtn = Array.from(document.querySelectorAll(".nav-tab")).find(b => b.getAttribute("onclick")?.includes(tabId));
  if (targetTabBtn) targetTabBtn.classList.add("active");

  const targetContent = document.getElementById(tabId);
  if (targetContent) targetContent.classList.add("active");

  if (tabId === "tab-trading") {
    setTimeout(renderNativeFinancialChart, 50);
  }
}

// =============================================================================
// 2. PURE NATIVE CANVAS FINANCIAL CANDLESTICK & INDICATOR CHART ENGINE
// =============================================================================

function generateCandlestickData(basePrice, volatility, count = 45) {
  const candles = [];
  let currentClose = basePrice;

  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.46) * volatility;
    const open = currentClose;
    const close = Math.max(open + change, 10);
    const high = Math.max(open, close) + Math.random() * (volatility * 0.6);
    const low = Math.min(open, close) - Math.random() * (volatility * 0.6);
    const volume = Math.floor(Math.random() * 50000) + 10000;

    candles.push({ open, high, low, close, volume });
    currentClose = close;
  }

  // Calculate 50-SMA & 200-SMA
  const sma50 = [];
  const sma200 = [];
  const rsi = [];
  const macd = [];

  for (let i = 0; i < count; i++) {
    const slice = candles.slice(Math.max(0, i - 10), i + 1).map(c => c.close);
    const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
    sma50.push(avg * 0.985);
    sma200.push(avg * 0.93);

    // RSI (40-70 range)
    const rsiVal = 45 + Math.sin(i * 0.4) * 20 + Math.random() * 5;
    rsi.push(Math.min(90, Math.max(10, rsiVal)));

    // MACD line
    const macdVal = Math.sin(i * 0.3) * 3.5;
    macd.push(macdVal);
  }

  return { candles, sma50, sma200, rsi, macd };
}

function renderNativeFinancialChart() {
  const canvas = document.getElementById("marketTradingChart");
  if (!canvas) return;

  const container = canvas.parentElement;
  canvas.width = container.clientWidth * window.devicePixelRatio || 800;
  canvas.height = (container.clientHeight || 420) * window.devicePixelRatio || 420;

  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.width;
  const height = canvas.height;

  // Clear background
  ctx.fillStyle = "#07090E";
  ctx.fillRect(0, 0, width, height);

  const stock = stockDatabase[currentTicker] || stockDatabase["NVDA"];
  const data = generateCandlestickData(stock.basePrice, stock.volatility, 45);
  const candles = data.candles;

  // Subchart layout height bounds
  const mainChartHeight = showRSI || showMACD ? height * 0.62 : height * 0.85;
  const subChartTop = mainChartHeight + 20 * dpr;
  const subChartHeight = height - subChartTop - 20 * dpr;

  // Find Min / Max Price
  let minPrice = Infinity;
  let maxPrice = -Infinity;
  candles.forEach(c => {
    if (c.low < minPrice) minPrice = c.low;
    if (c.high > maxPrice) maxPrice = c.high;
  });

  const padding = (maxPrice - minPrice) * 0.1;
  minPrice = Math.max(0, minPrice - padding);
  maxPrice = maxPrice + padding;

  const candleWidth = (width - 80 * dpr) / candles.length;

  // --- Draw Grid Lines & Axes ---
  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
  ctx.lineWidth = 1 * dpr;

  for (let y = 40 * dpr; y < mainChartHeight; y += 45 * dpr) {
    ctx.beginPath();
    ctx.moveTo(50 * dpr, y);
    ctx.lineTo(width - 20 * dpr, y);
    ctx.stroke();

    // Price Labels
    const priceVal = maxPrice - ((y - 20 * dpr) / mainChartHeight) * (maxPrice - minPrice);
    ctx.fillStyle = "#8E9AAF";
    ctx.font = `${10 * dpr}px 'Inter', sans-serif`;
    ctx.fillText(`$${priceVal.toFixed(2)}`, 6 * dpr, y + 4 * dpr);
  }

  // --- Draw Candlesticks & Area Gradient ---
  const linePoints = [];

  candles.forEach((c, i) => {
    const x = 55 * dpr + i * candleWidth + candleWidth / 2;
    const openY = 20 * dpr + (1 - (c.open - minPrice) / (maxPrice - minPrice)) * (mainChartHeight - 20 * dpr);
    const closeY = 20 * dpr + (1 - (c.close - minPrice) / (maxPrice - minPrice)) * (mainChartHeight - 20 * dpr);
    const highY = 20 * dpr + (1 - (c.high - minPrice) / (maxPrice - minPrice)) * (mainChartHeight - 20 * dpr);
    const lowY = 20 * dpr + (1 - (c.low - minPrice) / (maxPrice - minPrice)) * (mainChartHeight - 20 * dpr);

    linePoints.push({ x, y: closeY });

    const isBull = c.close >= c.open;
    const candleColor = isBull ? "#2ECC71" : "#E74C3C";

    // Draw Wick High-Low
    ctx.strokeStyle = candleColor;
    ctx.lineWidth = 1.5 * dpr;
    ctx.beginPath();
    ctx.moveTo(x, highY);
    ctx.lineTo(x, lowY);
    ctx.stroke();

    // Draw Candle Body
    const bodyTop = Math.min(openY, closeY);
    const bodyHeight = Math.max(Math.abs(closeY - openY), 2 * dpr);

    ctx.fillStyle = isBull ? "rgba(46, 204, 113, 0.85)" : "rgba(231, 76, 60, 0.85)";
    ctx.fillRect(x - candleWidth * 0.35, bodyTop, candleWidth * 0.7, bodyHeight);
  });

  // --- Draw Gold Trend Line Overlay ---
  ctx.strokeStyle = "#FFD700";
  ctx.lineWidth = 2.5 * dpr;
  ctx.beginPath();
  linePoints.forEach((pt, i) => {
    if (i === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  });
  ctx.stroke();

  // Glow Area Fill under Gold Line
  const gradient = ctx.createLinearGradient(0, 0, 0, mainChartHeight);
  gradient.addColorStop(0, "rgba(255, 215, 0, 0.25)");
  gradient.addColorStop(1, "rgba(212, 175, 55, 0.0)");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(linePoints[0].x, mainChartHeight);
  linePoints.forEach(pt => ctx.lineTo(pt.x, pt.y));
  ctx.lineTo(linePoints[linePoints.length - 1].x, mainChartHeight);
  ctx.closePath();
  ctx.fill();

  // --- Draw 50-SMA & 200-SMA Lines ---
  if (showSMA) {
    // 50-SMA Line (Blue)
    ctx.strokeStyle = "#3498DB";
    ctx.lineWidth = 2 * dpr;
    ctx.setLineDash([4 * dpr, 4 * dpr]);
    ctx.beginPath();
    data.sma50.forEach((val, i) => {
      const x = 55 * dpr + i * candleWidth + candleWidth / 2;
      const y = 20 * dpr + (1 - (val - minPrice) / (maxPrice - minPrice)) * (mainChartHeight - 20 * dpr);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // 200-SMA Line (Purple)
    ctx.strokeStyle = "#9B59B6";
    ctx.setLineDash([2 * dpr, 2 * dpr]);
    ctx.beginPath();
    data.sma200.forEach((val, i) => {
      const x = 55 * dpr + i * candleWidth + candleWidth / 2;
      const y = 20 * dpr + (1 - (val - minPrice) / (maxPrice - minPrice)) * (mainChartHeight - 20 * dpr);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // --- Draw Sub-Chart (RSI / MACD) ---
  if (showRSI || showMACD) {
    ctx.strokeStyle = "rgba(212, 175, 55, 0.3)";
    ctx.strokeRect(50 * dpr, subChartTop, width - 70 * dpr, subChartHeight);

    ctx.fillStyle = "#8E9AAF";
    ctx.font = `${10 * dpr}px 'Outfit', sans-serif`;
    ctx.fillText(showRSI ? "RSI (14) MOMENTUM INDICATOR" : "MACD (12,26,9) CROSSOVER", 55 * dpr, subChartTop + 14 * dpr);

    if (showRSI) {
      ctx.strokeStyle = "#F39C12";
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath();
      data.rsi.forEach((val, i) => {
        const x = 55 * dpr + i * candleWidth + candleWidth / 2;
        const y = subChartTop + subChartHeight - ((val - 10) / 80) * subChartHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }
  }

  // Legend Overlay
  ctx.fillStyle = "#FFD700";
  ctx.font = `bold ${12 * dpr}px 'Outfit', sans-serif`;
  ctx.fillText(`${stock.name} • DAILY CANDLESTICK`, 55 * dpr, 22 * dpr);
}

function updateActiveTicker() {
  const input = document.getElementById("tickerSearchInput").value.trim().toUpperCase();
  if (!input) return;

  if (!stockDatabase[input]) {
    stockDatabase[input] = {
      name: `${input} - CUSTOM TICKER`,
      price: 150.00,
      change: "+2.10%",
      isUp: true,
      sentiment: 0.45,
      sentimentText: "BULLISH MOOD",
      stance: "BULLISH",
      justification: `Price ($150.00) trades above 50-SMA with positive momentum for ${input}.`,
      basePrice: 140,
      volatility: 3.5
    };
  }

  currentTicker = input;
  const item = stockDatabase[input];

  document.getElementById("activeTickerTitle").innerText = item.name;
  document.getElementById("activePriceDisplay").innerText = `$${item.price.toFixed(2)}`;
  
  const changeEl = document.getElementById("activeChangeDisplay");
  changeEl.innerText = item.change;
  changeEl.className = item.isUp ? "price-change up" : "price-change down";

  document.getElementById("tradingSentimentVal").innerText = (item.sentiment >= 0 ? "+" : "") + item.sentiment.toFixed(2);
  document.getElementById("tradingDirectionVal").innerText = item.stance;
  document.getElementById("tradingDirectionVal").style.color = item.stance === "BULLISH" ? "#2ECC71" : "#E74C3C";
  document.getElementById("tradingJustificationText").innerText = item.justification;

  renderNativeFinancialChart();
  updateBracketOrderGraphic(item.price);
}

function toggleIndicator(type) {
  if (type === "sma") showSMA = !showSMA;
  if (type === "rsi") showRSI = !showRSI;
  if (type === "macd") showMACD = !showMACD;

  renderNativeFinancialChart();
}

function updateBracketOrderGraphic(price) {
  const stopLoss = (price * 0.98).toFixed(2);
  const takeProfit = (price * 1.06).toFixed(2);
  const perShareRisk = price * 0.02;
  const qty = Math.max(Math.floor(100 / perShareRisk), 1);
  const maxLoss = (qty * (price - stopLoss)).toFixed(2);
  const targetProfit = (qty * (takeProfit - price)).toFixed(2);

  document.getElementById("bracketTitle").innerText = `[ Bracket Order Opened: BUY ${qty} ${currentTicker} @ ~$${price.toFixed(2)} ]`;
  document.getElementById("bracketStopPrice").innerText = `$${stopLoss} (-2%)`;
  document.getElementById("bracketMaxLoss").innerText = `(Max Loss: $${maxLoss})`;
  document.getElementById("bracketTargetPrice").innerText = `$${takeProfit} (+6%)`;
  document.getElementById("bracketMaxProfit").innerText = `(Target Profit: $${targetProfit})`;
}


// =============================================================================
// 3. 4-AGENT PIPELINE SEQUENTIAL SIMULATOR
// =============================================================================

function startPipelineAnimation() {
  switchTab('tab-pipeline');
  clearTerminalLogs();

  const item = stockDatabase[currentTicker];
  const steps = [
    { id: "step-node-1", name: "News Sentiment Agent" },
    { id: "step-node-2", name: "Market Predictor Agent" },
    { id: "step-node-3", name: "P&L Risk Agent" },
    { id: "step-node-4", name: "Execution Agent" }
  ];

  let currentStep = 0;
  const interval = setInterval(() => {
    document.querySelectorAll(".workflow-step").forEach(step => step.classList.remove("active"));

    if (currentStep < steps.length) {
      document.getElementById(steps[currentStep].id).classList.add("active");
      
      if (currentStep === 0) {
        appendLogLine(`[Step 2] NEWS & SENTIMENT AGENT (Financial News & Social Media Monitor)`, "log-gold");
        appendLogLine(`  • ACTION: Initiating web news scan for ticker: '${currentTicker}'...`, "log-info");
        appendLogLine(`  • DATA  : Retrived 3 Headlines for ${currentTicker}`, "log-info");
        appendLogLine(`  • OUTPUT: Sentiment Score = ${item.sentiment.toFixed(2)} | Summary: News highlights positive cash flow for ${currentTicker}.`, "log-success");
      } else if (currentStep === 1) {
        appendLogLine(`\n[Step 3] MARKET PREDICTOR AGENT (Technical & Fundamental Market Analyst)`, "log-gold");
        appendLogLine(`  • ACTION: Fetching OHLCV data & computing 50-SMA, 200-SMA, RSI(14), MACD...`, "log-info");
        appendLogLine(`  • OUTPUT: Stance = ${item.stance} | Justification: ${item.justification}`, "log-success");
      } else if (currentStep === 2) {
        appendLogLine(`\n[Step 4] PROFIT & LOSS AGENT (Quantitative Risk Manager)`, "log-gold");
        appendLogLine(`  • ACTION: Evaluating $10,000 portfolio balance & 1% max capital risk guardrails...`, "log-info");
        appendLogLine(`  • OUTPUT: ✅ TRADE APPROVED | Entry: $${item.price.toFixed(2)} | SL: $${(item.price * 0.98).toFixed(2)} (-2%) | TP: $${(item.price * 1.06).toFixed(2)} (+6%)`, "log-success");
      } else if (currentStep === 3) {
        appendLogLine(`\n[Step 5] EXECUTION AGENT (Algorithmic Trade Executor)`, "log-gold");
        appendLogLine(`  • ACTION: Constructing Alpaca Paper Trading Bracket Order Payload...`, "log-info");
        appendStep6ExecutionLogs();
      }
      currentStep++;
    } else {
      clearInterval(interval);
    }
  }, 1200);
}

function triggerFullPipelineRun() {
  startPipelineAnimation();
}

function clearTerminalLogs() {
  const stream = document.getElementById("terminalLogStream");
  stream.innerHTML = `
    <div class="terminal-header">
      <div class="dot red"></div>
      <div class="dot yellow"></div>
      <div class="dot green"></div>
      <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 8px;">bash - aurum-trading-pipeline --ticker ${currentTicker}</span>
    </div>
    <div class="log-line log-gold">===============================================================================================</div>
    <div class="log-line log-gold">INITIALIZING AUTONOMOUS TRADING BOT PIPELINE FOR TICKER: ${currentTicker}</div>
    <div class="log-line log-gold">===============================================================================================</div>
    <div class="log-line log-info">[Step 1] Initializing Pipeline Context & Validating Ticker '${currentTicker}'...</div>
    <div class="log-line log-success">✔ Running in paper mode with deterministic NLP/Indicator engines.</div>
  `;
}

function appendLogLine(text, className = "log-line") {
  const stream = document.getElementById("terminalLogStream");
  const line = document.createElement("div");
  line.className = `log-line ${className}`;
  line.innerText = text;
  stream.appendChild(line);
  stream.scrollTop = stream.scrollHeight;
}

function appendStep6ExecutionLogs() {
  const orderId = "ord_" + Math.random().toString(36).substr(2, 8) + "_77b3_4e89_a529_d10f9be3bc4e";
  appendLogLine("\n===============================================================================================", "log-gold");
  appendLogLine("[Step 6] Execution Agent Finalization & Order Dispatch", "log-gold");
  appendLogLine("===============================================================================================", "log-gold");
  appendLogLine("Connecting to Alpaca Paper Trading Environment API Gateway...", "log-info");
  appendLogLine("  • Authenticating via ALPACA_API_KEY_ID... SUCCESS [Account Status: ACTIVE]", "log-success");
  appendLogLine("  • Checking Margin & Buying Power... Available: $10,000.00 | Required: $4,950.00", "log-info");
  appendLogLine("  • Order Payload Verification... PASSED [Bracket Syntax Check: OK]", "log-success");
  appendLogLine("\n[Transmission Protocol]", "log-gold");
  appendLogLine("  • Action               : POST https://alpaca.markets", "log-info");
  appendLogLine("  • API Server Response  : HTTP/1.1 200 OK", "log-success");
  appendLogLine(`  • Order Confirmation ID: ${orderId}`, "log-gold");
  appendLogLine("  • Status Code          : ACCEPTED (Order Queued for Opening Auction)", "log-success");
}


// =============================================================================
// 4. AGENTIC AI FRAUD PREVENTION THREAT SIMULATOR (EQU 1, 2, 3)
// =============================================================================

function updateFraudSimulation() {
  const amount = parseFloat(document.getElementById("slider-amount").value);
  const zscore = parseFloat(document.getElementById("slider-zscore").value);
  const logins = parseInt(document.getElementById("slider-logins").value);
  const dist = parseFloat(document.getElementById("slider-dist").value);
  const deviceChange = document.getElementById("check-device").checked ? 1 : 0;
  const ipProxy = document.getElementById("check-proxy").checked ? 1 : 0;

  document.getElementById("val-amount").innerText = `$${amount.toFixed(2)}`;
  document.getElementById("val-zscore").innerText = (zscore >= 0 ? "+" : "") + zscore.toFixed(2);
  document.getElementById("val-logins").innerText = `${logins} failures`;
  document.getElementById("val-dist").innerText = `${dist.toFixed(1)} km`;

  // Calculate Agent Scores (FPS_1, FPS_2, FPS_3, FPS_4)
  const fps1 = Math.min(1.0, Math.max(0.0, (amount / 2000) * 0.4 + (zscore / 5) * 0.6));
  const fps2 = Math.min(1.0, Math.max(0.0, (logins / 4) * 0.7 + (zscore / 6) * 0.3));
  const fps3 = Math.min(1.0, Math.max(0.0, deviceChange * 0.45 + ipProxy * 0.35 + (dist / 1500) * 0.2));
  const fps4 = Math.min(1.0, (fps1 + fps2 + fps3) / 3.0);

  // Equation 2: Agent Consensus Risk Score (ACRS) = (1/k) * sum(FPS_a)
  const acrs = (fps1 + fps2 + fps3 + fps4) / 4.0;

  // Equation 3: Collaboration Confidence Index (CCI)
  const r_weights = [1.0, 0.95, 1.0, 1.0];
  let sumAgreedWeights = 0;
  const totalWeight = r_weights.reduce((a, b) => a + b, 0);

  [fps1, fps2, fps3, fps4].forEach((fps, i) => {
    if (Math.abs(fps - acrs) < 0.25) {
      sumAgreedWeights += r_weights[i];
    }
  });

  const cci = sumAgreedWeights / totalWeight;

  document.getElementById("acrsValDisplay").innerText = acrs.toFixed(4);
  document.getElementById("cciValDisplay").innerText = cci.toFixed(4);

  const container = document.getElementById("xaiBadgeContainer");
  const explanation = document.getElementById("xaiExplanationText");

  if (acrs >= 0.65) {
    container.innerHTML = `<span class="badge-alert badge-red"><i class="fa-solid fa-ban"></i> [RED_ALERT] BLOCK_TRANSACTION</span>`;
    document.getElementById("acrsValDisplay").style.color = "#E74C3C";
    explanation.innerText = `Consensus Risk (ACRS): ${acrs.toFixed(4)} | Critical risk score detected across Amount Z-Score (+${zscore}), Failed Logins (${logins}), and Device Spoofing.`;
  } else if (acrs >= 0.35) {
    container.innerHTML = `<span class="badge-alert badge-yellow"><i class="fa-solid fa-triangle-exclamation"></i> [YELLOW_ALERT] STEP_UP_MFA</span>`;
    document.getElementById("acrsValDisplay").style.color = "#F39C12";
    explanation.innerText = `Consensus Risk (ACRS): ${acrs.toFixed(4)} | Moderate risk detected. Challenge user with biometric / multi-factor authentication.`;
  } else {
    container.innerHTML = `<span class="badge-alert badge-green"><i class="fa-solid fa-circle-check"></i> [GREEN_ALERT] ALLOW</span>`;
    document.getElementById("acrsValDisplay").style.color = "#2ECC71";
    explanation.innerText = `Consensus Risk (ACRS): ${acrs.toFixed(4)} | Low risk profile. Transaction validated successfully by multi-agent consensus.`;
  }
}
