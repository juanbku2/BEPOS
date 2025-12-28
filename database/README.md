# BEPOS – Database

## Overview
This folder contains **database-related resources** for the BEPOS system.

The database runs locally alongside the backend and stores:
- Products
- Inventory movements
- Sales
- Cash closings
- Users and roles

---

## Database Engine
**PostgreSQL (recommended)**

Reasons:
- Free for commercial use
- No licensing risk
- No size limitations
- Stable and well-supported

---

## Alternatives
- MariaDB / MySQL (acceptable)
- SQL Server Express (limited to 10GB)

❌ Oracle Database is avoided due to licensing risks.

---

## Planned Contents
- Database schema
- Initialization scripts
- Backup scripts
- Docker Compose (optional)

---

## Backup Strategy
Minimum:
- Daily automated database backup

Backup destinations:
- USB drive
- Cloud storage (Google Drive, S3, or OCI Free Tier)

---

## Status
🚧 Empty for now  
This folder will later contain SQL scripts and/or Docker configuration.
