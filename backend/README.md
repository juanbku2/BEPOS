# BEPOS – Backend

## Overview
This folder contains the **Spring Boot backend** for the BEPOS (Tiendita POS) system.

The backend runs as a **single local service** and provides:
- Business logic
- Security
- REST APIs (or server-side rendering)
- Database access

---

## Architecture
- **Modular monolith**
- Clear domain separation (easy to split later if needed)
- Runs on a single local PC (Windows or Linux)

---

## Technology Stack
- Java 17+
- Spring Boot
- Spring Data JPA (Hibernate)
- Spring Security
  - Role-based access (ADMIN, CASHIER)
  - Session-based or JWT (TBD)

---

## Core Functional Modules (V1)

### 1. Authentication
- Roles: ADMIN, CASHIER
- Simple login or PIN-based access

### 2. Products & Inventory
- Products with barcode, name, brand, prices
- Stock control
- Inventory movements (IN / OUT / ADJUST)
- Low-stock alerts

### 3. Sales / POS (Core)
- Open sale
- Scan barcode
- Manual override (admin only)
- Cash / card payment
- Change calculation
- Cancel sale
- Daily corte de caja

### 4. Clients & Suppliers (Optional)
- Suppliers (Bimbo, Coca-Cola, etc.)
- Customer credit (fiado)
- Balance and payments

### 5. Reports
- Daily sales
- Product sales summary
- Low inventory
- CSV export

---

## Deployment
- Runs as a single Spring Boot JAR
- Accessible only on local network
- Optional HTTPS (self-signed)

---

## Status
🚧 Not initialized yet  
Spring Boot project will be created inside this folder.
