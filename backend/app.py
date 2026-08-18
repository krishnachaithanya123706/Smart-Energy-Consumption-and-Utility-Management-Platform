from flask import Flask, jsonify, request, send_from_directory
import sqlite3
import os

app = Flask(__name__, static_folder="../frontend")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "database", "utility.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = get_db()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            utility_type TEXT NOT NULL
        )
    """)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS consumption(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            utility_type TEXT NOT NULL,
            consumption REAL NOT NULL,
            date TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """)

    conn.commit()
    conn.close()

init_db()

@app.route("/")
def home():
    return send_from_directory("../frontend", "index.html")

@app.route("/api/users", methods=["GET"])
def get_users():
    conn = get_db()
    users = conn.execute("SELECT * FROM users").fetchall()
    conn.close()

    return jsonify([dict(user) for user in users])

@app.route("/api/users", methods=["POST"])
def add_user():
    data = request.json

    if not data:
        return jsonify({"error": "Invalid data"}), 400

    try:
        conn = get_db()

        conn.execute(
            "INSERT INTO users(name,email,utility_type) VALUES(?,?,?)",
            (
                data["name"],
                data["email"],
                data["utility_type"]
            )
        )

        conn.commit()
        conn.close()

        return jsonify({"message": "User added successfully"}), 201

    except sqlite3.IntegrityError:
        return jsonify({"error": "Email already exists"}), 400

@app.route("/api/consumption", methods=["GET"])
def get_consumption():
    conn = get_db()

    records = conn.execute("""
        SELECT consumption.*, users.name
        FROM consumption
        LEFT JOIN users ON consumption.user_id = users.id
        ORDER BY consumption.date DESC
    """).fetchall()

    conn.close()

    return jsonify([dict(record) for record in records])

@app.route("/api/consumption", methods=["POST"])
def add_consumption():
    data = request.json

    try:
        conn = get_db()

        conn.execute("""
            INSERT INTO consumption
            (user_id, utility_type, consumption, date)
            VALUES (?, ?, ?, ?)
        """, (
            data["user_id"],
            data["utility_type"],
            data["consumption"],
            data["date"]
        ))

        conn.commit()
        conn.close()

        return jsonify({"message": "Consumption recorded"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/api/anomalies", methods=["GET"])
def get_anomalies():
    conn = get_db()

    records = conn.execute("""
        SELECT consumption.*, users.name
        FROM consumption
        LEFT JOIN users ON consumption.user_id = users.id
    """).fetchall()

    conn.close()

    anomalies = []

    for record in records:
        value = record["consumption"]

        if record["utility_type"] == "Electricity" and value > 500:
            anomalies.append(dict(record))

        elif record["utility_type"] == "Water" and value > 1000:
            anomalies.append(dict(record))

        elif record["utility_type"] == "Gas" and value > 300:
            anomalies.append(dict(record))

    return jsonify(anomalies)

@app.route("/api/dashboard", methods=["GET"])
def dashboard():
    conn = get_db()

    total_users = conn.execute(
        "SELECT COUNT(*) FROM users"
    ).fetchone()[0]

    total_consumption = conn.execute(
        "SELECT COALESCE(SUM(consumption),0) FROM consumption"
    ).fetchone()[0]

    electricity = conn.execute("""
        SELECT COALESCE(SUM(consumption),0)
        FROM consumption
        WHERE utility_type='Electricity'
    """).fetchone()[0]

    water = conn.execute("""
        SELECT COALESCE(SUM(consumption),0)
        FROM consumption
        WHERE utility_type='Water'
    """).fetchone()[0]

    gas = conn.execute("""
        SELECT COALESCE(SUM(consumption),0)
        FROM consumption
        WHERE utility_type='Gas'
    """).fetchone()[0]

    conn.close()

    return jsonify({
        "total_users": total_users,
        "total_consumption": total_consumption,
        "electricity": electricity,
        "water": water,
        "gas": gas
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)