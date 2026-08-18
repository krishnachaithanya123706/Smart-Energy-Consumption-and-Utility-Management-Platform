# Smart Energy Consumption and Utility Management Platform

A web-based platform for monitoring electricity, water and gas consumption.

## Features

- User management
- Utility consumption tracking
- Dashboard
- Electricity monitoring
- Water monitoring
- Gas monitoring
- Anomaly detection
- SQLite database
- REST API
- Docker support
- Automated testing

## Project Structure

backend/
frontend/
data/
tests/
docs/
Dockerfile
requirements.txt
README.md
.gitignore

## Installation

Create a virtual environment:

python -m venv venv

Activate it on Windows:

venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

## Run Application

python backend/app.py

Open:

http://localhost:5000

## Run Tests

pytest

## Docker

Build image:

docker build -t smart-energy-platform .

Run container:

docker run -p 5000:5000 smart-energy-platform

Open:

http://localhost:5000