# 🔍 ForenChain – Blockchain Powered Digital Evidence Verification System

ForenChain is a **tamper-proof digital evidence verification platform** that uses **SHA-256 cryptographic hashing, blockchain immutability, automated forensic camera capture, GPS metadata, and PDF report generation** to prove the authenticity of digital documents.

This ensures **Proof of Authenticity, Proof of Time, Proof of Location, and Proof of Non-Tampering** — critical in **legal, forensic, academic, and insurance workflows.**

---

## 🚀 Features

| Feature | Description |
|--------|-------------|
| **Document Hashing (SHA-256)** | Generates unique fingerprint for every file |
| **Blockchain Verification** | Stores and verifies document integrity on-chain |
| **Automatic Camera Capture** | Captures real-time evidence when tampering is detected |
| **Metadata Forensics** | Captures browser fingerprint, device info & camera resolution |
| **GPS Location** | (If permitted) records where the evidence was captured |
| **PDF Evidence Report** | Generates legally admissible forensic report |
| **QR Code Verification** | Public verification link for third-party validation |
| **Local Storage Privacy** | Original document never leaves the user device |

---

## 🧠 How It Works

1. **Upload a File**
2. System computes its **SHA-256 hash**
3. Hash is **matched against blockchain record**
4. If:
   - ✅ **Match → Document is Authentic**
   - ❌ **Mismatch → Document is Tampered**
     - System **automatically opens camera**
     - Captures **photo evidence + metadata**
5. Generates a **PDF report + QR verification link**

---

## 📄 Example Evidence Report Includes:

- File Details & Hash Values
- Blockchain Verification Result
- Timestamp of Verification
- Device + Browser Metadata
- GPS Coordinates (optional)
- Captured Evidence Image
- **QR Code to Online Verification Page**

---

## 🛠️ Tech Stack

| Layer | Technologies |
|------|--------------|
| Frontend | Next.js (App Router), React, Tailwind CSS |
| Blockchain | Solidity / EVM Compatible Chain |
| Storage | Local Storage / Optional IPFS |
| Hashing | SHA-256 Web Crypto API |
| Identity | MetaMask / Wallet Connect |
| PDF Export | jsPDF |
| QR Code | qrcode.js |

---

## 🏗️ Installation

```bash
git clone your-repo-url
cd forenchain
pnpm install
pnpm dev
