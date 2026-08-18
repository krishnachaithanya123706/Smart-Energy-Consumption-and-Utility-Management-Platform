function showSection(sectionId){

    document.querySelectorAll(".section").forEach(section => {
        section.classList.add("hidden");
    });

    document.getElementById(sectionId).classList.remove("hidden");

    if(sectionId === "dashboard"){
        loadDashboard();
    }

    if(sectionId === "users"){
        loadUsers();
    }

    if(sectionId === "consumption"){
        loadConsumption();
    }

    if(sectionId === "anomalies"){
        loadAnomalies();
    }
}

async function loadDashboard(){

    const response = await fetch("/api/dashboard");
    const data = await response.json();

    document.getElementById("totalUsers").textContent =
        data.total_users;

    document.getElementById("totalConsumption").textContent =
        data.total_consumption.toFixed(2);

    document.getElementById("electricity").textContent =
        data.electricity.toFixed(2);

    document.getElementById("water").textContent =
        data.water.toFixed(2);

    document.getElementById("gas").textContent =
        data.gas.toFixed(2);
}

async function loadUsers(){

    const response = await fetch("/api/users");
    const users = await response.json();

    const table = document.getElementById("userTable");

    table.innerHTML = "";

    users.forEach(user => {

        table.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.utility_type}</td>
            </tr>
        `;

    });
}

document.getElementById("userForm").addEventListener(
    "submit",
    async function(event){

        event.preventDefault();

        const user = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            utility_type:
                document.getElementById("utilityType").value
        };

        const response = await fetch("/api/users", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(user)
        });

        const data = await response.json();

        alert(data.message || data.error);

        if(response.ok){
            this.reset();
            loadUsers();
            loadDashboard();
        }
    }
);

async function loadConsumption(){

    const response = await fetch("/api/consumption");
    const records = await response.json();

    const table =
        document.getElementById("consumptionTable");

    table.innerHTML = "";

    records.forEach(record => {

        table.innerHTML += `
            <tr>
                <td>${record.name || "Unknown"}</td>
                <td>${record.utility_type}</td>
                <td>${record.consumption}</td>
                <td>${record.date}</td>
            </tr>
        `;

    });
}

document.getElementById("consumptionForm").addEventListener(
    "submit",
    async function(event){

        event.preventDefault();

        const record = {
            user_id:
                document.getElementById("userId").value,

            utility_type:
                document.getElementById("consumptionType").value,

            consumption:
                document.getElementById("consumptionValue").value,

            date:
                document.getElementById("consumptionDate").value
        };

        const response = await fetch("/api/consumption", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(record)
        });

        const data = await response.json();

        alert(data.message || data.error);

        if(response.ok){
            this.reset();
            loadConsumption();
            loadDashboard();
        }
    }
);

async function loadAnomalies(){

    const response = await fetch("/api/anomalies");
    const anomalies = await response.json();

    const result =
        document.getElementById("anomalyResults");

    result.innerHTML = "";

    if(anomalies.length === 0){

        result.innerHTML =
            "<p>No abnormal consumption detected.</p>";

        return;
    }

    anomalies.forEach(item => {

        result.innerHTML += `
            <div class="anomaly">
                <strong>Abnormal Consumption Detected</strong>
                <p>User: ${item.name || "Unknown"}</p>
                <p>Utility: ${item.utility_type}</p>
                <p>Consumption: ${item.consumption}</p>
                <p>Date: ${item.date}</p>
            </div>
        `;

    });
}

loadDashboard();