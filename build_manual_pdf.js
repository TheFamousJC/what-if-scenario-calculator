import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

async function generateSimulatorManual() {
  console.log('Generating Work Hack #2 (Scenario Simulator) manual PDF...');

  // 1. Locate and encode the 3Sci logo as Base64 so it renders reliably across pages
  let logoBase64 = '';
  const possibleLogoPaths = [
    './templates/logo_white.png',
    './logo_white.png',
    './templates/logo_white_2.png',
    './logo_white_2.png'
  ];

  for (const p of possibleLogoPaths) {
    if (fs.existsSync(p)) {
      const buffer = fs.readFileSync(p);
      logoBase64 = `data:image/png;base64,${buffer.toString('base64')}`;
      break;
    }
  }

  // 2. HTML Document for the Manual
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&family=JetBrains+Mono:wght@400;600&display=swap');

  @page {
    size: A4 portrait;
    margin: 22mm 16mm 22mm 16mm;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #1e293b;
    background: #ffffff;
    line-height: 1.55;
    font-size: 9.8pt;
  }

  .page-break {
    page-break-before: always;
  }

  h1 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 23pt;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.15;
    margin-bottom: 6px;
  }
  .doc-subtitle {
    font-size: 11pt;
    color: #64748b;
    margin-bottom: 16px;
  }

  h2 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 13pt;
    font-weight: 700;
    color: #0f172a;
    margin: 16px 0 8px 0;
    border-bottom: 1.5px solid #e2e8f0;
    padding-bottom: 4px;
  }

  h3 {
    font-size: 10.5pt;
    font-weight: 700;
    color: #0f172a;
    margin: 12px 0 4px 0;
  }

  p {
    margin-bottom: 8px;
    color: #334155;
  }

  /* Feature Highlight Callout */
  .feature-box {
    background: #f0fdf4;
    border: 2px solid #22c55e;
    border-radius: 8px;
    padding: 14px 16px;
    margin: 14px 0;
  }
  .feature-title {
    font-size: 12pt;
    font-weight: 800;
    color: #15803d;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .feature-desc {
    font-size: 9.5pt;
    color: #166534;
    line-height: 1.45;
  }

  .card-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
    margin: 12px 0;
  }
  .card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 10px 12px;
  }
  .card-title {
    font-weight: 700;
    color: #0f172a;
    font-size: 9.5pt;
    margin-bottom: 3px;
  }
  .card-desc {
    font-size: 8.5pt;
    color: #64748b;
    line-height: 1.35;
  }

  .step-box {
    background: #f8fafc;
    border-left: 4px solid #0d9488;
    border-radius: 4px;
    padding: 10px 14px;
    margin-bottom: 10px;
  }
  .step-number {
    font-weight: 800;
    color: #0d9488;
    font-size: 8.5pt;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .step-title {
    font-size: 11pt;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 4px;
  }

  pre {
    background: #0f172a;
    color: #f8fafc;
    font-family: 'JetBrains Mono', monospace;
    font-size: 7.2pt;
    line-height: 1.4;
    padding: 10px 12px;
    border-radius: 6px;
    margin: 6px 0 10px 0;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .code-inline {
    background: #e2e8f0;
    color: #0f172a;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 8.5pt;
    font-family: 'JetBrains Mono', monospace;
  }

  .ai-help-banner {
    background: #f0f9ff;
    border: 1.5px dashed #0284c7;
    border-radius: 6px;
    padding: 12px 14px;
    margin: 16px 0 12px 0;
  }
  .ai-help-title {
    font-size: 11pt;
    font-weight: 800;
    color: #0369a1;
    margin-bottom: 3px;
  }
  .ai-help-desc {
    font-size: 9pt;
    color: #0c4a6e;
    line-height: 1.4;
  }

  .legal-box {
    margin-top: 14px;
    padding: 10px 12px;
    background: #f8fafc;
    border-top: 1.5px solid #cbd5e1;
    font-size: 7.5pt;
    color: #64748b;
    line-height: 1.4;
  }
  .legal-box strong {
    color: #334155;
  }
</style>
</head>
<body>

  <!-- PAGE 1 -->
  <h1>Interactive "What-If" Scenario Simulator</h1>
  <div class="doc-subtitle">A straightforward, non-technical manual for stress-testing pricing, client churn, break-even thresholds, and cash runway for free.</div>

  <!-- THE CORE VALUE -->
  <div class="feature-box">
    <div class="feature-title">📊 Zero-SaaS, 100% Client-Side Business Intelligence</div>
    <div class="feature-desc">
      Static spreadsheets break the moment you tweak a formula, and enterprise forecasting software requires expensive monthly subscriptions. This tool lives in a single, lightweight HTML file on your laptop. You double-click it, drag the sliders, and immediately see how pricing adjustments, churn, and operational overhead impact your 12-month net profit curve in real time.
    </div>
  </div>

  <h2>1. Overview: How It Works</h2>
  <p>There are no complex installations, databases, or cloud servers. The entire simulator operates locally in any modern browser (Chrome, Edge, Safari, Firefox):</p>

  <div class="card-grid">
    <div class="card">
      <div class="card-title">🎛️ The Controls (Inputs)</div>
      <div class="card-desc">Sliders for Retainer/Price, Starting Clients, New Sales/Month, Churn Rate %, Fixed OpEx, and Direct Costs (COGS).</div>
    </div>
    <div class="card">
      <div class="card-title">📈 Real-Time KPIs</div>
      <div class="card-desc">Instantly computes your Break-Even Client Count, Net Unit Margin ($/client), and Month 1 vs. Month 12 Net Profits.</div>
    </div>
    <div class="card">
      <div class="card-title">📉 Dynamic Trajectory Chart</div>
      <div class="card-desc">Draws a 12-month visual curve comparing Gross Revenue, Total Expenses, and Net Monthly Profit.</div>
    </div>
    <div class="card">
      <div class="card-title">🔒 100% Privacy & Zero Cost</div>
      <div class="card-desc">No data ever leaves your computer. No cookies, no telemetry, and zero subscription charges.</div>
    </div>
  </div>

  <h2>2. How to Set Up in 30 Seconds</h2>
  <div class="step-box">
    <div class="step-number">Step 1</div>
    <div class="step-title">Create the File</div>
    <p>Open <strong>Notepad</strong> on your computer, paste the complete code from Section 3, and save it as <span class="code-inline">calculator.html</span>.</p>
  </div>

  <div class="step-box">
    <div class="step-number">Step 2</div>
    <div class="step-title">Open in Your Browser</div>
    <p>Double-click <span class="code-inline">calculator.html</span>. It will instantly launch in your browser with interactive sliders and real-time Chart.js graphics.</p>
  </div>

  <div class="page-break"></div>

  <!-- PAGE 2 -->
  <h2>3. The Complete Source Code (<span class="code-inline">calculator.html</span>)</h2>
  <p>Copy and paste this entire code into a blank text document and name it <span class="code-inline">calculator.html</span>:</p>

  <pre>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;title&gt;What-If Scenario Simulator | 3Sci Open Source Work Hack&lt;/title&gt;
  &lt;script src="https://cdn.jsdelivr.net/npm/chart.js"&gt;&lt;/script&gt;
  &lt;link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet"&gt;
  &lt;style&gt;
    :root { --bg: #090f17; --card-bg: #111a26; --card-border: #1e2c3d; --accent: #00d2b4; --accent-dim: rgba(0,210,180,0.15); --text: #f1f5f9; --text-muted: #94a3b8; --profit: #10b981; --costs: #ef4444; --rev: #38bdf8; }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
    body { background-color: var(--bg); color: var(--text); padding: 30px 40px; min-height: 100vh; }
    header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--card-border); padding-bottom: 16px; margin-bottom: 24px; }
    .brand-group { display: flex; align-items: center; gap: 16px; }
    .brand-logo { height: 48px; width: auto; object-fit: contain; }
    .brand-title { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 700; color: var(--accent); }
    .badge { background: var(--accent-dim); color: var(--accent); border: 1px solid var(--accent); padding: 6px 14px; border-radius: 6px; font-size: 13px; font-weight: 700; }
    .grid-container { display: grid; grid-template-columns: 420px 1fr; gap: 24px; }
    .panel { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 12px; padding: 24px; }
    .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid var(--card-border); padding-bottom: 10px; }
    .presets { display: flex; gap: 6px; }
    .btn-preset { background: #1c2b3d; color: #cbd5e1; border: 1px solid #2d3f55; padding: 4px 8px; font-size: 11px; font-weight: 700; border-radius: 4px; cursor: pointer; }
    .control-group { margin-bottom: 18px; }
    .control-label { display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; color: var(--text-muted); margin-bottom: 8px; }
    .control-val { color: #fff; font-size: 15px; font-weight: 800; }
    input[type=range] { width: 100%; height: 6px; background: #233448; border-radius: 3px; outline: none; -webkit-appearance: none; }
    input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: var(--accent); cursor: pointer; }
    .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .kpi-card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 10px; padding: 16px 20px; }
    .kpi-label { font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); }
    .kpi-val { font-size: 26px; font-weight: 800; margin: 8px 0 4px 0; font-family: 'Space Grotesk', sans-serif; }
    .kpi-val.good { color: var(--profit); } .kpi-val.rev { color: var(--rev); } .kpi-val.alert { color: var(--costs); }
    .chart-box { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 12px; padding: 24px; height: 480px; display: flex; flex-direction: column; }
    footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--card-border); margin-top: 28px; padding-top: 14px; font-size: 13px; color: var(--text-muted); }
    .footer-link { color: var(--accent); text-decoration: none; font-weight: 700; }
  &lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;header&gt;
    &lt;div class="brand-group"&gt;
      &lt;img src="templates/logo_white.png" class="brand-logo" alt="3Sci Logo" onerror="this.style.display='none'"&gt;
      &lt;div&gt;
        &lt;div class="brand-title"&gt;3SCI SCENARIO SIMULATOR&lt;/div&gt;
        &lt;div style="font-size: 13px; color: var(--text-muted);"&gt;Interactive What-If Cash Flow, Break-Even & Unit Economics Engine&lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
    &lt;div class="badge"&gt;Open Source Hack #2&lt;/div&gt;
  &lt;/header&gt;

  &lt;div class="grid-container"&gt;
    &lt;div class="panel"&gt;
      &lt;div class="panel-header"&gt;
        &lt;span style="font-weight:800; color:var(--accent);"&gt;PARAMETERS&lt;/span&gt;
        &lt;div class="presets"&gt;
          &lt;button class="btn-preset" onclick="setPreset('conservative')"&gt;Cautious&lt;/button&gt;
          &lt;button class="btn-preset" onclick="setPreset('base')"&gt;Base&lt;/button&gt;
          &lt;button class="btn-preset" onclick="setPreset('aggressive')"&gt;Growth&lt;/button&gt;
        &lt;/div&gt;
      &lt;/div&gt;
      &lt;div class="control-group"&gt;
        &lt;div class="control-label"&gt;&lt;span&gt;Monthly Price&lt;/span&gt;&lt;span class="control-val" id="val-price"&gt;$250&lt;/span&gt;&lt;/div&gt;
        &lt;input type="range" id="param-price" min="50" max="1500" step="25" value="250" oninput="updateModel()"&gt;
      &lt;/div&gt;
      &lt;div class="control-group"&gt;
        &lt;div class="control-label"&gt;&lt;span&gt;Active Clients&lt;/span&gt;&lt;span class="control-val" id="val-clients"&gt;30&lt;/span&gt;&lt;/div&gt;
        &lt;input type="range" id="param-clients" min="1" max="150" step="1" value="30" oninput="updateModel()"&gt;
      &lt;/div&gt;
      &lt;div class="control-group"&gt;
        &lt;div class="control-label"&gt;&lt;span&gt;New Clients / Mo&lt;/span&gt;&lt;span class="control-val" id="val-new-clients"&gt;5&lt;/span&gt;&lt;/div&gt;
        &lt;input type="range" id="param-new-clients" min="0" max="30" step="1" value="5" oninput="updateModel()"&gt;
      &lt;/div&gt;
      &lt;div class="control-group"&gt;
        &lt;div class="control-label"&gt;&lt;span&gt;Monthly Churn Rate&lt;/span&gt;&lt;span class="control-val" id="val-churn"&gt;5.0%&lt;/span&gt;&lt;/div&gt;
        &lt;input type="range" id="param-churn" min="0" max="25" step="0.5" value="5.0" oninput="updateModel()"&gt;
      &lt;/div&gt;
      &lt;div class="control-group"&gt;
        &lt;div class="control-label"&gt;&lt;span&gt;Fixed OpEx / Mo&lt;/span&gt;&lt;span class="control-val" id="val-fixed"&gt;$5,000&lt;/span&gt;&lt;/div&gt;
        &lt;input type="range" id="param-fixed" min="500" max="25000" step="250" value="5000" oninput="updateModel()"&gt;
      &lt;/div&gt;
      &lt;div class="control-group"&gt;
        &lt;div class="control-label"&gt;&lt;span&gt;COGS per Client&lt;/span&gt;&lt;span class="control-val" id="val-cogs"&gt;$30&lt;/span&gt;&lt;/div&gt;
        &lt;input type="range" id="param-cogs" min="0" max="300" step="5" value="30" oninput="updateModel()"&gt;
      &lt;/div&gt;
    &lt;/div&gt;

    &lt;div&gt;
      &lt;div class="kpi-row"&gt;
        &lt;div class="kpi-card"&gt;&lt;span class="kpi-label"&gt;Break-Even Volume&lt;/span&gt;&lt;div class="kpi-val" id="kpi-breakeven-clients"&gt;23&lt;/div&gt;&lt;span id="kpi-breakeven-rev" style="font-size:12px;color:var(--text-muted);"&gt;$5,750 / mo threshold&lt;/span&gt;&lt;/div&gt;
        &lt;div class="kpi-card"&gt;&lt;span class="kpi-label"&gt;Unit Margin&lt;/span&gt;&lt;div class="kpi-val good" id="kpi-unit-margin"&gt;$220&lt;/div&gt;&lt;span id="kpi-margin-pct" style="font-size:12px;color:var(--text-muted);"&gt;88.0% margin&lt;/span&gt;&lt;/div&gt;
        &lt;div class="kpi-card"&gt;&lt;span class="kpi-label"&gt;Month 1 Profit&lt;/span&gt;&lt;div class="kpi-val good" id="kpi-m1-profit"&gt;$2,260&lt;/div&gt;&lt;span id="kpi-m1-rev" style="font-size:12px;color:var(--text-muted);"&gt;From $8,250 rev&lt;/span&gt;&lt;/div&gt;
        &lt;div class="kpi-card"&gt;&lt;span class="kpi-label"&gt;Month 12 Run-Rate&lt;/span&gt;&lt;div class="kpi-val rev" id="kpi-m12-profit"&gt;$8,420&lt;/div&gt;&lt;span id="kpi-m12-clients" style="font-size:12px;color:var(--text-muted);"&gt;61 active clients&lt;/span&gt;&lt;/div&gt;
      &lt;/div&gt;
      &lt;div class="chart-box"&gt;&lt;div style="margin-bottom:12px;font-weight:700;color:var(--text-muted);"&gt;12-MONTH PROJECTIONS (REVENUE VS EXPENSES VS PROFIT)&lt;/div&gt;&lt;div style="flex-grow:1;position:relative;"&gt;&lt;canvas id="scenarioChart"&gt;&lt;/canvas&gt;&lt;/div&gt;&lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;

  &lt;footer&gt;
    &lt;div&gt;&lt;a href="https://3sci.com" target="_blank" class="footer-link"&gt;3sci.com&lt;/a&gt; • Open Source Tools for Founders&lt;/div&gt;
    &lt;span&gt;100% Client-Side • Zero Telemetry&lt;/span&gt;
  &lt;/footer&gt;

  &lt;script&gt;
    let chartInstance = null;
    const PRESETS = {
      conservative: { price: 200, clients: 20, newClients: 2, churn: 8.0, fixed: 4500, cogs: 35 },
      base: { price: 250, clients: 30, newClients: 5, churn: 5.0, fixed: 5000, cogs: 30 },
      aggressive: { price: 300, clients: 35, newClients: 9, churn: 3.5, fixed: 6500, cogs: 25 }
    };
    function setPreset(key) {
      const p = PRESETS[key];
      ['price','clients','newClients','churn','fixed','cogs'].forEach(k => {
        const id = k === 'newClients' ? 'param-new-clients' : 'param-' + k;
        document.getElementById(id).value = p[k];
      });
      updateModel();
    }
    function updateModel() {
      const price = parseFloat(document.getElementById('param-price').value);
      const starting = parseInt(document.getElementById('param-clients').value);
      const added = parseInt(document.getElementById('param-new-clients').value);
      const churn = parseFloat(document.getElementById('param-churn').value) / 100;
      const fixed = parseFloat(document.getElementById('param-fixed').value);
      const cogs = parseFloat(document.getElementById('param-cogs').value);

      document.getElementById('val-price').innerText = '$' + price.toLocaleString();
      document.getElementById('val-clients').innerText = starting;
      document.getElementById('val-new-clients').innerText = added;
      document.getElementById('val-churn').innerText = (churn * 100).toFixed(1) + '%';
      document.getElementById('val-fixed').innerText = '$' + fixed.toLocaleString();
      document.getElementById('val-cogs').innerText = '$' + cogs.toLocaleString();

      const unitMargin = price - cogs;
      const marginPct = (unitMargin / price) * 100;
      const beClients = unitMargin > 0 ? Math.ceil(fixed / unitMargin) : '∞';

      document.getElementById('kpi-breakeven-clients').innerText = beClients;
      document.getElementById('kpi-breakeven-rev').innerText = unitMargin > 0 ? '$' + (beClients * price).toLocaleString() + ' / mo' : 'Unprofitable';
      document.getElementById('kpi-unit-margin').innerText = '$' + unitMargin.toLocaleString();
      document.getElementById('kpi-margin-pct').innerText = marginPct.toFixed(1) + '% contribution';

      let current = starting, labels = [], revData = [], costData = [], profitData = [];
      for (let m = 1; m <= 12; m++) {
        labels.push('M' + m);
        current = Math.max(0, current - Math.round(current * churn) + added);
        const rev = current * price, cost = fixed + (current * cogs), profit = rev - cost;
        revData.push(rev); costData.push(cost); profitData.push(profit);
        if (m === 1) {
          document.getElementById('kpi-m1-profit').innerText = '$' + profit.toLocaleString();
          document.getElementById('kpi-m1-rev').innerText = 'From $' + rev.toLocaleString() + ' rev';
        }
        if (m === 12) {
          document.getElementById('kpi-m12-profit').innerText = '$' + profit.toLocaleString();
          document.getElementById('kpi-m12-clients').innerText = current + ' clients ($' + rev.toLocaleString() + ' rev)';
        }
      }
      renderChart(labels, revData, costData, profitData);
    }
    function renderChart(labels, revData, costData, profitData) {
      const ctx = document.getElementById('scenarioChart').getContext('2d');
      if (chartInstance) chartInstance.destroy();
      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            { label: 'Gross Revenue', data: revData, borderColor: '#38bdf8', borderWidth: 3, tension: 0.3, fill: false },
            { label: 'Total Costs', data: costData, borderColor: '#ef4444', borderDash: [5,5], borderWidth: 2, tension: 0.3, fill: false },
            { label: 'Net Profit', data: profitData, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.15)', borderWidth: 3, tension: 0.3, fill: true }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { labels: { color: '#cbd5e1' } } },
          scales: {
            x: { grid: { color: '#1e2c3d' }, ticks: { color: '#94a3b8' } },
            y: { grid: { color: '#1e2c3d' }, ticks: { color: '#94a3b8', callback: v => '$' + v.toLocaleString() } }
          }
        }
      });
    }
    window.onload = updateModel;
  &lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</pre>

  <div class="page-break"></div>

  <!-- PAGE 3 -->
  <h2>4. How to Customize Parameters for Different Business Models</h2>
  <p>You can adapt this tool for consulting agencies, SaaS subscriptions, boutique coaching, or e-commerce memberships without writing custom software.</p>

  <div class="step-box">
    <div class="step-number">Rule 1</div>
    <div class="step-title">Changing Slider Minimums & Maximums</div>
    <p>Open <span class="code-inline">calculator.html</span> in Notepad and find the slider inputs. For example, if you sell high-ticket retainers instead of small subscriptions, change the price slider:</p>
    <pre>&lt;input type="range" id="param-price" min="1000" max="10000" step="250" value="3500" oninput="updateModel()"&gt;</pre>
    <p>This expands your slider to evaluate retainers between $1,000 and $10,000 in $250 steps.</p>
  </div>

  <div class="step-box">
    <div class="step-number">Rule 2</div>
    <div class="step-title">Modifying Default Presets</div>
    <p>In the script tag, locate the <span class="code-inline">PRESETS</span> object. You can replace the default scenarios with your firm's actual historical numbers:</p>
    <pre>const PRESETS = {
  conservative: { price: 3000, clients: 5, newClients: 1, churn: 5.0, fixed: 8000, cogs: 400 },
  base:         { price: 4500, clients: 8, newClients: 2, churn: 3.0, fixed: 10000, cogs: 350 },
  aggressive:   { price: 6000, clients: 12, newClients: 4, churn: 2.0, fixed: 14000, cogs: 300 }
};</pre>
  </div>

  <!-- AI PLATFORM ASSISTANCE -->
  <div class="ai-help-banner">
    <div class="ai-help-title">✨ Always ask your preferred AI platform if you need help updating code!</div>
    <div class="ai-help-desc">
      You don't need to be a web developer to customize this simulator. If you want to add employee capacity limits, convert the currency to Euros or Pounds, or change the color palette, simply paste the code of <span class="code-inline">calculator.html</span> into ChatGPT, Claude, or Gemini with this prompt:<br><br>
      <em>"Here is my calculator.html file. Please preserve all existing functionality and Chart.js logic, but update the currency to [EUR/GBP] and add an extra slider for [Your New Parameter]."</em><br><br>
      Your AI platform will provide the complete, updated code block ready for you to copy and paste.
    </div>
  </div>

  <!-- INDEMNITY CLAUSE -->
  <div class="legal-box">
    <strong>INDEMNITY & LIMITATION OF LIABILITY:</strong> This software, interactive templates, financial simulation algorithms, and accompanying documentation are provided on an "as is" and "as available" basis for general informational, educational, and workflow automation purposes only. 3Sci, its authors, and contributors make no representations or warranties of any kind, express or implied, regarding forecasting accuracy, financial performance, legal compliance, or suitability for commercial underwriting. In no event shall 3Sci, its founders, or contributors be held liable for any direct, indirect, incidental, special, or consequential damages, commercial losses, bankruptcy, operational downtime, or strategic miscalculations resulting from the use or customization of this codebase. Users assume sole responsibility for validating all calculations with a certified financial professional prior to making binding financial decisions.
  </div>

</body>
</html>
  `;

  // 3. Launch Puppeteer and render PDF with logo on every page header & custom footer
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

  const pdfPath = path.join('./', '3Sci_Work_Hack_2_Scenario_Simulator_Manual.pdf');

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    // HEADER TEMPLATE: Logo + Title on EVERY page
    headerTemplate: `
      <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 8pt; width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 0 16mm; color: #64748b; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; box-sizing: border-box;">
        <div style="display: flex; align-items: center; gap: 8px;">
          ${logoBase64 ? `<img src="${logoBase64}" style="height: 18px; width: auto; filter: invert(1);" alt="3Sci Logo">` : ''}
          <span style="font-weight: 800; color: #0f172a; letter-spacing: 0.5px;">3Sci Intelligence Systems</span>
        </div>
        <span style="text-transform: uppercase; font-size: 7pt; letter-spacing: 1px; color: #0d9488; font-weight: 700;">Open Source Workflow Manual</span>
      </div>
    `,
    // FOOTER TEMPLATE: 3sci.com URL, Page X of Y, and 3Sci Open Source Work Hack
    footerTemplate: `
      <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 8pt; width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 0 16mm; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 4px; box-sizing: border-box;">
        <span><strong>3sci.com</strong></span>
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        <span>3Sci Open Source Work Hack #2</span>
      </div>
    `,
    margin: {
      top: '18mm',
      bottom: '18mm',
      left: '16mm',
      right: '16mm'
    }
  });

  await browser.close();
  console.log(`\nManual PDF generated successfully: ${path.resolve(pdfPath)}`);
}

generateSimulatorManual();