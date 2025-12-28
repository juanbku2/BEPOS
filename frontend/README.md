# BEPOS – Frontend

## Overview
This folder contains the **web frontend** for the BEPOS (Tiendita POS) system.

The frontend is a **responsive web application** designed to run in a browser on:
- Android tablets
- iPads
- Desktop PCs

No native mobile app is required.

---

## Responsibilities
- Point of Sale (POS) user interface
- Product search and barcode input
- Sales flow (open sale, add items, payment, cancel)
- Inventory visualization
- Basic reports and daily cash closing (corte de caja)

---

## Technology (Planned)
- React (preferred) or server-side templates (TBD)
- Responsive UI (Bootstrap or equivalent)
- REST API integration with Spring Boot backend
- Bluetooth barcode scanners (keyboard emulation)

---

## Barcode Scanning
- Barcode scanners connect via **Bluetooth**
- Scanner works as a keyboard
- Browser input fields capture barcode values
- Compatible with Android and iOS browsers

---

## Notes
- Must work offline on local network
- Internet is optional (used only for backups or updates)
- UI should be simple and optimized for non-technical users

---

## Status
🚧 Not initialized yet  
This folder will later contain the React project structure.
