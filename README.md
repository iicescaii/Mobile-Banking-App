# ZenBank 🏦

**CS ELECTIVE 4 | BSCS - 3B** **Submitted to:** Prof. Ariel Tomagan

---

## 👥 The Team

| Role | Name |
| --- | --- |
| **Leader** | Togonon, Francesca |
| **Members** | Capuz, Prince Aaron M. |
|  | Domingo, Princess Jade |
|  | Elle, Clarise Mae B. |
|  | Perez, Maria Angela Mae |

---

## 📌 Project Overview

**ZenBank** is a mobile banking application designed to provide secure, efficient access to banking services while reducing reliance on physical bank branches. It features real-time fund transfers, biometric authentication, and bill payments using a custom backend without external APIs.

### 🛠 Tech Stack

* **Frontend:** React Native (TypeScript / TSX)
* **Backend:** Node.js, Express.js (CommonJS / JavaScript)
* **Database:** MySQL
* **Design:** Figma
* **Security:** AES-256 Encryption & SSL

---

## 📄 Phase I: Planning

### 1.1 Project Goals

* **Accessibility:** Secure mobile banking for new and existing customers.
* **Security:** Biometric (Fingerprint/FaceID) and PIN-based authentication.
* **Transactions:** Instant fund transfers and utility bill payments.

### 1.2 Project Scope & Limitations

| Feature | Included |
| --- | --- |
| Biometric Login | ✅ |
| Internal Fund Transfer | ✅ |
| Bill Payments | ✅ |
| Interbank Transfer | ❌ |
| Offline Mode | ❌ |

---

## 🔍 Phase II: Requirements & Analysis

### 2.1 Technical Implementation

The backend is built with **Node.js** using the **CommonJS** pattern to manage MySQL connections via a connection pool.

**Example Backend Route (`routes/accounts.js`):**

```javascript
const express = require("express");
const Account = require("../model/accounts");
const pool = require("../config");
const router = express.Router();

// Fetch account details
router.get("/details/:id", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM accounts WHERE id = ?", [req.params.id]);
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

```

### 2.2 Timeline

---

## 🎙️ Research & Interviews

<details>
<summary><b>Click to view Interview with Security Bank Officer</b></summary>

**Interviewee:** Sir Erman Miguel H. Hecita

**Position:** Customer Engagement Officer

* **Key Findings:** Most complaints stem from branch queuing and downtime during cutoffs.
* **Automation Needs:** QR codes and online bill payments are the highest-demand features.
* **Security Insight:** Large withdrawals (>500k) require manual verification under PDIC and AMLA regulations.

</details>

<details>
<summary><b>Click to view Customer Survey Results</b></summary>

* **User 1:** Prefers "Lock Card" features and real-time notifications.
* **User 2:** Values fingerprint login and easy QR code generation.
* **User 3:** Checks transaction history daily; expects issues to be resolved within hours.

</details>

---

## 🚀 Installation & Setup

### Prerequisites

* Node.js (v16+)
* MySQL Server
* Android Studio / Emulator

### Steps

1. **Clone the Repository**
```bash
git clone https://github.com/YourUsername/ZenBank.git

```


2. **Backend Setup**
```bash
cd backend
npm install
# Configure your config.js with MySQL credentials
npm start

```


3. **Mobile Setup**
```bash
cd frontend
npm install
npx react-native run-android

```
