// Smart Energy Consumption & Utility Management Platform
// CI/CD Pipeline Simulator & Utility Management Logic

const API_URL = "http://localhost:5000/api";

// Local state for initial utility records demo
let utilityRecords = [
    { id: 101, consumer: "Metro Central Grid", utility: "Electricity", consumption: 820.00, unit: "kWh", date: "2026-08-20" },
    { id: 102, consumer: "Northside Water District", utility: "Water", consumption: 410.50, unit: "Gallons", date: "2026-08-21" },
    { id: 103, consumer: "Industrial Zone Gas Depot", utility: "Gas", consumption: 220.00, unit: "Therms", date: "2026-08-21" }
];

let isPipelineRunning = false;

// ==========================================
// 1. TAB NAVIGATION
// ==========================================
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    if (tabName === 'cicd') {
        document.getElementById('tabBtnCicd').classList.add('active');
        document.getElementById('cicdTab').classList.add('active');
    } else {
        document.getElementById('tabBtnUtility').classList.add('active');
        document.getElementById('utilityTab').classList.add('active');
    }
}

// ==========================================
// 2. UTILITY DASHBOARD ENGINE
// ==========================================
async function loadDashboard() {
    try {
        const response = await fetch(`${API_URL}/dashboard`);
        if (response.ok) {
            const data = await response.json();
            document.getElementById("total").textContent = data.total_consumption.toFixed(2);
            document.getElementById("electricity").textContent = data.electricity.toFixed(2);
            document.getElementById("water").textContent = data.water.toFixed(2);
            document.getElementById("gas").textContent = data.gas.toFixed(2);
            return;
        }
    } catch (err) {
        // Fallback to local state calculation if backend API is offline
        calculateLocalUtilityStats();
    }
}

function calculateLocalUtilityStats() {
    let total = 0, electricity = 0, water = 0, gas = 0;
    utilityRecords.forEach(rec => {
        total += Number(rec.consumption);
        if (rec.utility === 'Electricity') electricity += Number(rec.consumption);
        if (rec.utility === 'Water') water += Number(rec.consumption);
        if (rec.utility === 'Gas') gas += Number(rec.consumption);
    });

    document.getElementById("total").textContent = total.toFixed(2);
    document.getElementById("electricity").textContent = electricity.toFixed(2);
    document.getElementById("water").textContent = water.toFixed(2);
    document.getElementById("gas").textContent = gas.toFixed(2);
}

async function loadRecords() {
    try {
        const response = await fetch(`${API_URL}/consumption`);
        if (response.ok) {
            const data = await response.json();
            renderRecordsTable(data);
            return;
        }
    } catch (err) {
        // Fallback to local records
        renderRecordsTable(utilityRecords);
    }
}

function renderRecordsTable(records) {
    const table = document.getElementById("records");
    table.innerHTML = "";

    records.forEach(record => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>#${record.id}</td>
            <td><strong>${record.consumer}</strong></td>
            <td><span class="badge-branch">${record.utility}</span></td>
            <td>${record.consumption}</td>
            <td>${record.unit}</td>
            <td>${record.date}</td>
        `;
        table.appendChild(row);
    });
}

document.getElementById("consumptionForm")?.addEventListener("submit", async function(event) {
    event.preventDefault();

    const newRecord = {
        id: Math.floor(100 + Math.random() * 900),
        consumer: document.getElementById("consumer").value,
        utility: document.getElementById("utility").value,
        consumption: parseFloat(document.getElementById("consumption").value),
        unit: document.getElementById("unit").value,
        date: document.getElementById("date").value
    };

    try {
        const response = await fetch(`${API_URL}/consumption`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newRecord)
        });

        if (response.ok) {
            alert("Consumption record added successfully");
            this.reset();
            loadDashboard();
            loadRecords();
            return;
        }
    } catch (err) {
        // Local state addition fallback
        utilityRecords.unshift(newRecord);
        alert("Consumption record added successfully (Local)");
        this.reset();
        calculateLocalUtilityStats();
        renderRecordsTable(utilityRecords);
    }
});

// ==========================================
// 3. INTERACTIVE CI/CD PIPELINE SIMULATOR
// ==========================================

const stageScripts = [
    {
        stageId: 1,
        title: "Source Code Management",
        logs: [
            "[SCM] Triggered on push to 'main' (#sha89f2a).",
            "[SCM] Checking out repository source code...",
            "[SCM] Running pre-commit hooks (detect-secrets v1.4.0)...",
            "[SCM] No unencrypted API keys or passwords detected.",
            "[SCM] Running ESLint v9.0 static code check...",
            "[SCM] PASS: 0 lint errors, 0 warnings."
        ]
    },
    {
        stageId: 2,
        title: "Build Stage",
        logs: [
            "[BUILD] Restoring Node.js npm dependency cache...",
            "[BUILD] Dependencies resolved in 1.4s (cached).",
            "[BUILD] Executing web frontend bundle compilation...",
            "[BUILD] Generated static assets in dist/ directory (1.2 MB).",
            "[BUILD] Artifact 'compiled-build-artifact' uploaded successfully."
        ]
    },
    {
        stageId: 3,
        title: "Testing Stage",
        logs: [
            "[TEST] Executing Jest Unit & Integration Test Suite...",
            "[TEST] PASS: Energy Calculation Engine Test (14ms)",
            "[TEST] PASS: Utility Normalization Middleware Test (22ms)",
            "[TEST] PASS: Consumer Record Validation Test (8ms)",
            "[TEST] Coverage Report: 89.4% statements, 86.2% branches.",
            "[TEST] Cobertura XML report exported to coverage/cobertura-coverage.xml."
        ]
    },
    {
        stageId: 4,
        title: "Code Quality & SAST",
        logs: [
            "[QUALITY] Connecting to SonarQube Scanner v5.0...",
            "[QUALITY] Analyzing codebase for OWASP Top 10 vulnerabilities...",
            "[QUALITY] SonarQube Analysis: 0 Bugs, 0 Vulnerabilities, 0 Security Hotspots.",
            "[QUALITY] Running Trivy Filesystem Dependency Scanner...",
            "[QUALITY] Trivy Report: 0 Critical, 0 High vulnerabilities.",
            "[QUALITY] SonarQube Quality Gate Status: PASSED (Maintainability Rating 'A')."
        ]
    },
    {
        stageId: 5,
        title: "Packaging Stage",
        logs: [
            "[PACKAGE] Initializing Docker Buildx multi-stage builder...",
            "[PACKAGE] Building OCI image using frontend/Dockerfile...",
            "[PACKAGE] Container hardened with non-root user 'node'.",
            "[PACKAGE] Tagging image: ghcr.io/smart-energy/platform:v1.2.4-sha89f2",
            "[PACKAGE] Image pushed to Container Registry GHCR (Image size: 42.1 MB)."
        ]
    },
    {
        stageId: 6,
        title: "Deployment Stage",
        logs: [
            "[DEPLOY] Initiating deployment to STAGING environment...",
            "[DEPLOY] Executing: docker compose -f me/docker-compose.yml up -d",
            "[DEPLOY] STAGING Health Check: GET http://staging.smartenergy.local/healthz -> 200 OK",
            "[DEPLOY] Smoke testing passed on Staging.",
            "[DEPLOY] Promoting release to PRODUCTION environment (Blue/Green strategy)...",
            "[DEPLOY] Production health checks 100% GREEN.",
            "[RELEASE] CI/CD Pipeline Workflow Executed Successfully!"
        ]
    }
];

function logTerminal(message, type = "info") {
    const terminal = document.getElementById("terminalLogBody");
    if (!terminal) return;

    const time = new Date().toLocaleTimeString();
    const line = document.createElement("div");
    line.className = `log-line ${type}`;
    line.textContent = `[${time}] ${message}`;

    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
}

function clearTerminalLogs() {
    const terminal = document.getElementById("terminalLogBody");
    if (terminal) {
        terminal.innerHTML = `<div class="log-line info">[SYS] Logs cleared by user. Waiting for pipeline trigger...</div>`;
    }
}

function resetPipelineUI() {
    for (let i = 1; i <= 6; i++) {
        const card = document.getElementById(`stageCard-${i}`);
        const status = document.getElementById(`stageStatus-${i}`);
        if (card) {
            card.className = "stage-card stage-pending";
        }
        if (status) {
            status.textContent = "Waiting";
        }
    }
    document.getElementById("pipelineProgressBar").style.width = "0%";
    const statusPill = document.getElementById("pipelineGlobalStatus");
    if (statusPill) {
        statusPill.className = "status-pill status-idle";
        statusPill.textContent = "IDLE";
    }
}

async function startPipelineRun() {
    if (isPipelineRunning) return;
    isPipelineRunning = true;

    resetPipelineUI();
    clearTerminalLogs();

    const statusPill = document.getElementById("pipelineGlobalStatus");
    if (statusPill) {
        statusPill.className = "status-pill status-running";
        statusPill.textContent = "RUNNING";
    }

    logTerminal("Triggering CI/CD Pipeline Run on branch 'main'...", "highlight");

    for (let index = 0; index < stageScripts.length; index++) {
        const stage = stageScripts[index];
        const stageNum = stage.stageId;
        const card = document.getElementById(`stageCard-${stageNum}`);
        const status = document.getElementById(`stageStatus-${stageNum}`);

        // Set Stage Active
        if (card) card.className = "stage-card stage-running";
        if (status) status.textContent = "Running";

        // Update progress bar
        const progress = Math.round(((stageNum - 0.5) / 6) * 100);
        document.getElementById("pipelineProgressBar").style.width = `${progress}%`;

        logTerminal(`---> Starting Stage ${stageNum}: ${stage.title}`, "highlight");

        // Log stage lines
        for (const logMsg of stage.logs) {
            await new Promise(r => setTimeout(r, 350));
            logTerminal(logMsg, logMsg.includes("PASSED") || logMsg.includes("SUCCESS") || logMsg.includes("GREEN") ? "success" : "info");
        }

        // Set Stage Complete
        if (card) card.className = "stage-card stage-success";
        if (status) status.textContent = "Passed";

        document.getElementById("pipelineProgressBar").style.width = `${Math.round((stageNum / 6) * 100)}%`;
        await new Promise(r => setTimeout(r, 400));
    }

    // Pipeline Complete
    if (statusPill) {
        statusPill.className = "status-pill status-success";
        statusPill.textContent = "SUCCESS";
    }

    // Update live metrics & tags
    document.getElementById("metricQualityGate").textContent = "PASSED (A)";
    document.getElementById("metricCoverage").textContent = "89.4%";
    document.getElementById("metricSecurity").textContent = "0 Vulnerabilities";
    document.getElementById("metricImageTag").textContent = `v1.2.4-sha${Math.floor(Math.random()*8999+1000)}`;

    document.getElementById("stagingStatusBadge").textContent = "HEALTHY (v1.2.4)";
    document.getElementById("stagingStatusBadge").className = "status-pill status-success";
    document.getElementById("prodStatusBadge").textContent = "HEALTHY (v1.2.4)";
    document.getElementById("prodStatusBadge").className = "status-pill status-success";

    logTerminal("🎉 CI/CD Pipeline workflow executed cleanly across all 6 stages!", "success");
    isPipelineRunning = false;
}

function triggerDirectDeploy(envName) {
    const envUpper = envName.toUpperCase();
    logTerminal(`[MANUAL TRIGGER] Dispatching direct deployment request to ${envUpper}...`, "warn");
    setTimeout(() => {
        logTerminal(`[${envUpper}] Rolling update completed. HTTP 200 Health check verified.`, "success");
        if (envName === 'staging') {
            document.getElementById("stagingStatusBadge").textContent = "DEPLOYED NOW";
        } else {
            document.getElementById("prodStatusBadge").textContent = "DEPLOYED NOW";
        }
    }, 1200);
}

// Initial initialization
document.addEventListener("DOMContentLoaded", () => {
    loadDashboard();
    loadRecords();
});