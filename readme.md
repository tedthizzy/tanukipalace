# 🦝 Tanuki Palace

A whimsical collection of projects celebrating Japanese tanuki folklore — from interactive visualizations to practical web applications.

---

## 📁 Projects

### 🏯 [Palace Visualization](./index.html)
A dreamy, animated single-page visualization of a tanuki palace at night. Features floating tanukis, swaying lanterns, falling sakura petals, and a drunk-o-meter that increases as you click.

**Tech:** Vanilla HTML/CSS/JavaScript  
**Run:** Open `index.html` in a browser or serve with `python3 -m http.server 5001`

---

### 🍶 [Bar Tabs App](./bar-tabs/)
A Next.js Point of Sale system for tracking bar tabs at the Tanuki Palace izakaya. Demonstrates how to convert Excel-style spreadsheets into modern web apps.

**Tech:** Next.js 15, TypeScript, Tailwind CSS, Radix UI, Zustand  
**Run:** See [bar-tabs/README.md](./bar-tabs/README.md) for setup instructions

**Features:**
- 4 Excel-like tabs (Open Tabs, Customers, Sake Menu, Summary)
- 8 sake items with dynamic pricing
- 5 tanuki customers with unique drunk tolerances
- Live calculations and persistent state

---

## 🎓 Learning Purpose

This repository serves as an educational example for:

1. **Converting Excel to Web Apps** — The bar-tabs app shows how to translate spreadsheet concepts (VLOOKUP, formulas, tabs) into React patterns
2. **Modern Frontend Stack** — Next.js + TypeScript + Tailwind is the current industry standard
3. **State Management** — Zustand for simple, effective global state
4. **Creative Coding** — The palace visualization shows CSS animations and interactive effects

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/tanukipalace.git
cd tanukipalace

# For the visualization
open index.html
# or
python3 -m http.server 5001

# For the bar tabs app
cd bar-tabs
npm install
npm run dev
```

---

## 📖 Documentation

- [Bar Tabs README](./bar-tabs/README.md) — Detailed setup, architecture, and learning guide
- [PRD.md](./PRD.md) — Product Requirements Document for the full Tanuki Palace vision

---

## 🦝 What's a Tanuki?

Tanuki (狸) are Japanese raccoon dogs that appear frequently in folklore. They're known for:
- **Shapeshifting** — Disguising as humans, objects (especially tea kettles!)
- **Big bellies** — Which they drum on for magical effects
- **Love of sake** — They're often depicted drinking and merry
- **Mischief** — Playful tricksters, but generally benevolent

Famous tanuki include Pompoko from Studio Ghibli's "Pom Poko" and the statue outside many Japanese restaurants!

---

<p align="center">
  <strong>🍶 ポンポコ! 🍶</strong>
</p>
