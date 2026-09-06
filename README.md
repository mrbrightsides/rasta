# 🎯 RASTA Petanque (Rasyono Technology Analysis Petanque)

[![Live App](https://img.shields.io/badge/Live_Demo-rasta--petanque.vercel.app-002395?style=for-the-badge&logo=vercel)](https://rasta-petanque.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-mrbrightsides%2Frasta-181717?style=for-the-badge&logo=github)](https://github.com/mrbrightsides/rasta.git)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

> **RASTA Petanque (Rasyono Technology Analysis Petanque)** is a real-time sports performance analysis platform designed for coaches, athletes, tournament officials, and researchers in the sport of pétanque. 
> 
> Grounded in the scientific framework and doctoral research of **Dr. Rasyono** (Universitas Negeri Padang / UNP), RASTA bridges the gap between field observation and empirical performance data.

---

## 🌐 Quick Links

- **Repository**: [https://github.com/mrbrightsides/rasta.git](https://github.com/mrbrightsides/rasta.git)
- **Live Production URL**: [https://rasta-petanque.vercel.app](https://rasta-petanque.vercel.app)

---

## 📖 Scientific Background & Research Motivation

Traditional evaluation in pétanque often relies on post-match recollections, raw final scores, or manual pen-and-paper tallies that fail to capture granular technical breakdowns. Under the doctoral dissertation of **Dr. Rasyono**, the RASTA system addresses key performance criteria:

1. **Binary Micro-Scoring**: Evaluates each boule attempt dynamically ($1$ for success, $0$ for failure) based on situational intent (*Pointing* vs *Shooting*).
2. **Sub-Technique Discrimination** (*Bab II Hal 17–21*):
   - **Pointing**: *Rolling* (gesur / menyusur tanah), *Soft-Lob / Half-Lob* (parabola sedang), and *High-Lob* (parabola tinggi).
   - **Shooting**: *Au Fer* (shot directly on the iron / bola sasaran), *Short Shot* (jatuh 20–30 cm di depan target), and *Ground Shot* (rasant / menyusur tanah).
3. **Distance-Partitioned Profiling**: Tracks performance across official FIPJP target distances from **6m, 7m, 8m, 9m, to 10m**.
4. **Jack Proximity Metric**: Measures continuous distance to the *cochonnet* / jack ($d_{\text{jack}}$ in cm) for high-resolution pointing dispersion analysis.
5. **Carreau Conversion Rate**: Specific tracking of *carreau* (perfect displacement where the thrown boule replaces the target boule in position).

---

## ✨ Key Platform Modules

### 1. 📱 Sideline Mobile Scorer
- **5-Tap Recording Flow**: Team $\rightarrow$ Athlete $\rightarrow$ Action & Sub-Technique $\rightarrow$ Target Distance $\rightarrow$ Outcome.
- **Quota & Turn Enforcement**: Real-time counter of boules thrown per end (e.g. 6 per team in Triples) and strict 2-boule limit tracking per player per end.
- **Centimeter Precision**: Quick-select presets (5cm, 10cm, 20cm, 30cm, 50cm, >1m) or custom input for distance to jack.
- **One-Tap Undo & End Finalizer**: Safe corrections for scorer misclicks and structured end scoring dialog.

### 2. 📊 Live Dashboard
- Real-time scoreboard with dynamic score differential and current end indicator.
- Instant team-level pointing and shooting efficiency gauges.
- Running log of all boules delivered in chronological order.

### 3. 👥 Head-to-Head & Team Full-Time Analysis
- Direct comparison between Team A and Team B across all core performance pillars.
- End-by-end points momentum curve.
- Success rate distribution across different target distances.

### 4. 🎯 Individual Athlete Analytics & Radar Profiling
- Multi-axis Radar Charts (Recharts) evaluating:
  - **Pointing Accuracy**
  - **Shooting Accuracy**
  - **Carreau Rate**
  - **Distance Control**
  - **Overall Match Effectiveness**
- Sub-technique breakdown matrices (*Rolling vs Half-Lob vs High-Lob*, *Au Fer vs Short Shot vs Ground Shot*).
- Distance breakdown tables highlighting athlete strengths and drop-off zones.

### 5. 📑 Excel Performance Sheet (Replika Tabel 1.1 Digital)
- Exact digital replication of the RASTA Petanque physical observation sheet and Excel benchmark format.
- Visual color coding: Blue for Pointing, Rose for Shooting, Emerald for Team Summaries.
- Formula-accurate zero handling (`#DIV/0!` representation for categories with 0 attempts, avoiding misleading 0% ratings).
- One-click CSV export ready for statistical tools (SPSS, R, Python, Microsoft Excel).

### 6. ⚙️ Match Manager
- Create custom match setups (Singles, Doubles, Triples).
- Pre-loaded tournament presets (e.g. Jakarta International Petanque Arena showcase match).
- Persistent state management across browser sessions.

---

## 🧮 Mathematical Formulations

The RASTA computational engine calculates sports analytics metrics using the following standardized formulas:

### 1. Pointing Efficiency
$$\text{Eff}_{\text{point}} = \begin{cases} \left( \frac{\sum P_{\text{success}}}{\sum P_{\text{total}}} \right) \times 100\%, & \text{if } \sum P_{\text{total}} > 0 \\ \text{N/A} \ (\#\text{DIV/0!}), & \text{if } \sum P_{\text{total}} = 0 \end{cases}$$

### 2. Shooting Accuracy
$$\text{Acc}_{\text{shoot}} = \begin{cases} \left( \frac{\sum S_{\text{success}}}{\sum S_{\text{total}}} \right) \times 100\%, & \text{if } \sum S_{\text{total}} > 0 \\ \text{N/A} \ (\#\text{DIV/0!}), & \text{if } \sum S_{\text{total}} = 0 \end{cases}$$

### 3. Carreau Conversion Rate
$$\text{Rate}_{\text{carreau}} = \begin{cases} \left( \frac{\sum S_{\text{carreau}}}{\sum S_{\text{total}}} \right) \times 100\%, & \text{if } \sum S_{\text{total}} > 0 \\ \text{N/A} \ (\#\text{DIV/0!}), & \text{if } \sum S_{\text{total}} = 0 \end{cases}$$

### 4. Mean Jack Proximity (Distance Control)
$$\bar{D}_{\text{jack}} = \frac{1}{N} \sum_{i=1}^{N} d_i \quad (\text{measured in cm})$$

### 5. Overall Match Effectiveness
$$\text{Eff}_{\text{overall}} = \left( \frac{\sum P_{\text{success}} + \sum S_{\text{success}}}{\sum P_{\text{total}} + \sum S_{\text{total}}} \right) \times 100\%$$

---

## 🏆 Performance Benchmark Tiers

Based on national and international tournament thresholds referenced in the research:

| Rating Tier | Overall Effectiveness | Pointing Target | Shooting Target |
|:---|:---:|:---:|:---:|
| 🥇 **Elite / National** | $\ge 80.0\%$ | $\ge 80.0\%$ | $\ge 75.0\%$ |
| 🥈 **Advanced / Pro** | $65.0\% - 79.9\%$ | $65.0\% - 79.9\%$ | $60.0\% - 74.9\%$ |
| 🥉 **Intermediate** | $50.0\% - 64.9\%$ | $50.0\% - 64.9\%$ | $45.0\% - 59.9\%$ |
| ⚠️ **Developmental** | $< 50.0\%$ | $< 50.0\%$ | $< 45.0\%$ |

---

## 💻 Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Charts & Data Visualization**: [Recharts](https://recharts.org/), [Lucide React](https://lucide.dev/)
- **Animations**: [Motion](https://motion.dev/)
- **Backend / Dev Server**: [Express](https://expressjs.com/) with Vite middleware
- **Deployment**: [Vercel](https://vercel.com/) / Cloud Run Container

---

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18.x or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mrbrightsides/rasta.git
   cd rasta
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000` to access the application.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Lint and Type Check**:
   ```bash
   npm run lint
   ```

---

## 📂 Project Structure

```
rasta/
├── public/                     # Static assets & icons
├── src/
│   ├── components/
│   │   ├── Header.tsx                 # Top navigation and match state header
│   │   ├── MobileScorer.tsx           # Sideline touch-first scoring console
│   │   ├── LiveDashboard.tsx          # Real-time game telemetry & end logs
│   │   ├── TeamFullTime.tsx           # Full-time team performance stats
│   │   ├── HeadToHead.tsx             # H2H comparison matrices & momentum
│   │   ├── AthleteAnalytics.tsx       # Individual player metrics & radar view
│   │   ├── StatisticPerEnd.tsx        # Granular end-by-end analytics
│   │   ├── ExcelPerformanceSheet.tsx  # Digital Tabel 1.1 with CSV exporter
│   │   ├── MatchManager.tsx           # Match configuration & presets
│   │   └── RadarChartComp.tsx         # Recharts radar visualizer
│   ├── lib/
│   │   ├── calculations.ts            # Core RASTA sports math & formulas
│   │   └── mockData.ts                # Preset demonstration match data
│   ├── types.ts                       # TypeScript interfaces and domain models
│   ├── App.tsx                        # Master layout and view routing
│   ├── main.tsx                       # React application entry point
│   └── index.css                      # Tailwind CSS root stylesheet
├── index.html                         # HTML entry template
├── package.json                       # Project configuration and dependencies
├── server.ts                          # Express + Vite SSR / API host
└── README.md                          # Platform documentation
```

---

## 📜 Citation & Academic Reference

If you use RASTA Petanque in your research, training program, or sports analytics thesis, please cite:

```bibtex
@phdthesis{rasyono2026rasta,
  title={Pengembangan Model Analisis Kinerja Atlet Petanque Berbasis RASTA (Rasyono Technology Analysis Petanque)},
  author={Rasyono},
  year={2026},
  school={Program Pascasarjana, Universitas Negeri Padang (UNP)},
  type={Doctoral Dissertation},
  address={Padang, Indonesia}
}
```

---

## 📄 License

Developed for academic, coaching, and sporting advancement under the direction of **Dr. Rasyono** & team. © 2026 Rasyono Technology Analysis Petanque. All rights reserved.
