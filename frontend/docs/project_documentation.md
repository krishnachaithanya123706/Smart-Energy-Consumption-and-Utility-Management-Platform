# Smart Energy Consumption and Utility Management Platform

## Project Overview

The Smart Energy Consumption and Utility Management Platform is a web-based system designed to monitor and manage electricity, water and gas consumption.

## Objectives

- Monitor utility consumption.
- Manage consumer accounts.
- Store consumption records.
- Detect abnormal consumption.
- Provide dashboard-based analytics.
- Generate utility usage information.

## Technologies

- Python
- Flask
- SQLite
- HTML
- CSS
- JavaScript
- Docker
- Pytest

## Main Modules

### User Management

Allows users to be registered with their name, email and utility type.

### Consumption Management

Records electricity, water and gas consumption.

### Dashboard

Displays total users and utility consumption.

### Anomaly Detection

Identifies unusually high consumption based on predefined thresholds.

## API Endpoints

GET /api/users

POST /api/users

GET /api/consumption

POST /api/consumption

GET /api/anomalies

GET /api/dashboard

## Anomaly Thresholds

Electricity: greater than 500

Water: greater than 1000

Gas: greater than 300