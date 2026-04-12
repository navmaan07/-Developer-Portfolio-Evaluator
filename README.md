# 🚀 Developer Portfolio Evaluator

A premium, full-stack MERN application that conducts deep-dive analysis of GitHub profiles. It generates weighted scores across five professional dimensions, providing developers with actionable insights and shareable performance reports.

---

## 💎 Premium Design Overhaul
This version features a complete UI/UX modernization:
*   **Modern Dark Theme**: A sophisticated indigo and purple aesthetic with high-contrast typography.
*   **Glassmorphism**: Elegant semi-transparent layouts with backdrop blurs.
*   **Fluid Animations**: Smooth page transitions and staggered entrance animations powered by **Framer Motion**.
*   **Dynamic Visualizations**: Real-time analytics charts (Radar, Bar, Line) via **Chart.js**.
*   **Iconography**: Professional and consistent icon set from **Lucide React**.

---

## 🏗️ Technical Architecture

### **Frontend (Vite + React)**
- **Framework**: React 18 (Hooks, Functional Components).
- **Styling**: Vanilla CSS with a global design system for maximum performance.
- **Animations**: Framer Motion for 60fps transitions and interactive micro-interactions.
- **Charts**: react-chartjs-2 for data-driven developer insights.

### **Backend (Node.js + Express)**
- **API**: RESTful architecture with structured error handling.
- **Integration**: GitHub REST API via the authenticated **Octokit** client.
- **Security**: CORS-enabled with environment-driven configuration.

### **Database (MongoDB Atlas)**
- **Persistence**: Mongoose ODM for reliable data modeling.
- **Caching Strategy**: High-performance **24-hour TTL caching** which automatically purges expired analysis results.
- **Reliability**: Atomic upsert logic to ensure data consistency during re-analysis.

---

## 📊 The Scoring Algorithm (Deep-Dive)

The evaluator uses a proprietary weighted scoring system to measure developer maturity:

| Metric | Weight | Key Indicators |
| :--- | :--- | :--- |
| **Activity** | 25% | 90-day commit consistency, push events, and streak patterns. |
| **Code Quality** | 20% | Documentation standards, Licensing, Project structure, and Test presence. |
| **Diversity** | 20% | Tech stack breadth, language variety, and topic diversity. |
| **Community** | 20% | Follower counts, repository stars, and fork engagement (logarithmic). |
| **Hiring Readiness** | 15% | Professional bio completeness, social presence, and hiring status. |

---

## 🛠️ Step-by-Step Setup Process

### **1. Prerequisites**
*   **Node.js**: Version 18.x or higher.
*   **MongoDB**: An active MongoDB Atlas cluster.
*   **GitHub Token**: A Personal Access Token (PAT) for authenticated API requests.

### **2. Installation**
This project uses **npm workspaces** to manage the frontend and backend concurrently.

```bash
# Clone the repository
git clone <repository-url>
cd FINAL-day14

# Install all dependencies (Frontend + Backend)
npm install
```

### **3. Environment Configuration**
Create a `.env` file in the **server** directory:

```env
# FINAL-day14/server/.env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GITHUB_TOKEN=your_github_personal_access_token
CLIENT_URL=http://localhost:5173
```

*(Optional) Create a `.env` file in the **client** directory if you need to point to a custom API URL:*
```env
# FINAL-day14/client/.env
VITE_API_URL=http://localhost:5000/api
```

### **4. Running Locally**
Start both the client and server simultaneously using the root development script:

```bash
# From the project root (FINAL-day14)
npm run dev
```

*   **Frontend**: [http://localhost:5173](http://localhost:5173)
*   **Backend Health**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🧪 How to Test

### **Manual Verification Flow**
1.  **Search Test**: Enter a GitHub username on the Home page. Ensure the "Analyzing..." loader appears and resolves.
2.  **Report Verification**: On the Report page, verify that the **Avatar**, **Bio**, and **Score Cards** populate correctly.
3.  **Interactive Charts**: Hover over the Radar chart and Language bar chart to verify tooltips and data values.
4.  **Comparison Test**: Navigate to `/compare`, enter two usernames, and verify the side-by-side benchmarking logic works (winners are highlighted in gold).

### **API Health Check**
Run this command in your terminal to ensure the backend is alive and connected:
```bash
curl http://localhost:5000/api/health
```

---

## 🔧 Troubleshooting

*   **GitHub Rate Limits**: If you see "Network error" or "Quota exhausted", ensure your `GITHUB_TOKEN` is valid and hasn't reached its 5000 req/hr limit.
*   **Duplicate Key Error**: If you encounter an "E11000 duplicate key error", ensure you are using the latest version of the code which utilizes `findOneAndUpdate` for atomic updates.
*   **MongoDB Connection**: Ensure your IP address is whitelisted in the MongoDB Atlas dashboard.

---

**Made with ❤️ for the Developer Community.**
