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

## 🛠️ Build Your Own App Like This

Want to create a similar project? Here's the modern stack we used and how to get started:

### Recommended Stack
| Tool | Purpose | Why |
|------|---------|-----|
| **[Bun](https://bun.sh)** | Package manager + runtime | 3x faster than npm, built-in TypeScript |
| **[Next.js](https://nextjs.org)** | React framework | Routing, SSR, best practices baked in |
| **[TypeScript](https://typescriptlang.org)** | Typed JavaScript | Catch bugs early, better autocomplete |
| **[Tailwind CSS](https://tailwindcss.com)** | Styling | Rapid UI development |
| **[Zustand](https://github.com/pmndrs/zustand)** | State management | Simplest option for React |
| **[Radix UI](https://radix-ui.com)** | Components | Accessible tabs, selects, dialogs |
| **[Git](https://git-scm.com)** | Version control | Track changes, collaborate |
| **[Vercel](https://vercel.com)** | Deployment | Free hosting, auto-deploys from Git |

### Quick Start (5 minutes)

```bash
# 1. Install Bun (if you don't have it)
curl -fsSL https://bun.sh/install | bash

# 2. Create a new Next.js app
bun create next-app my-app --typescript --tailwind --app --eslint

# 3. Enter the project and install extras
cd my-app
bun add zustand @radix-ui/react-tabs @radix-ui/react-select lucide-react

# 4. Start developing
bun run dev
```

### Deploy to Vercel (2 minutes)

```bash
# 1. Initialize Git and push to GitHub
git init
git add .
git commit -m "Initial commit"
gh repo create my-app --public --push  # or create manually on github.com

# 2. Deploy
# Go to vercel.com → New Project → Import your GitHub repo → Deploy
# That's it! Vercel auto-deploys on every push.
```

### Project Structure Pattern

```
my-app/
├── src/
│   ├── app/           # Pages (file-based routing)
│   ├── components/    # Reusable UI components
│   ├── data/          # Static data (JSON/TS files)
│   ├── store/         # Zustand stores
│   └── lib/           # Utility functions
```

### Key Concepts

1. **Data as Code** — Store your "Excel sheets" as TypeScript arrays/objects in `/data`
2. **Lookup Functions** — Replace VLOOKUP with `Array.find()` and `Array.filter()`
3. **Reactive State** — Use Zustand to share data across components; React auto-updates UI
4. **Tabs as Routes** — Use Radix Tabs for single-page or Next.js routes for multi-page

See the [bar-tabs README](./bar-tabs/README.md) for detailed code examples and explanations!

---

## 🐼🤝🏿🐼 Contributing

We welcome contributions from developers of all skill levels!

### Quick Contribution Guide

```bash
# 1. Fork & clone
git clone https://github.com/YOUR_USERNAME/tanukipalace.git
cd tanukipalace

# 2. Create a branch
git checkout -b feature/your-feature-name

# 3. Make changes, then commit
git add .
git commit -m "feat: describe your change"

# 4. Push and open a PR
git push origin feature/your-feature-name
```

### Where to Contribute

| Project | Good For | Difficulty |
|---------|----------|------------|
| `index.html` | CSS animations, visual effects | 🟢 Beginner |
| `bar-tabs/src/data/` | Adding new sake/tanuki | 🟢 Beginner |
| `bar-tabs/src/components/` | React components, UI | 🟡 Intermediate |
| `bar-tabs/src/store/` | State logic, calculations | 🟡 Intermediate |

### Detailed Guide

For step-by-step instructions on:
- Setting up your development environment
- Making and testing changes
- Submitting pull requests
- Code style guidelines

See the **[Bar Tabs Contributing Guide](./bar-tabs/README.md#-contributing)**

### Ideas for First Contributions

- 🍶 Add a new sake type (edit `bar-tabs/src/data/sake.ts`)
- 🦝 Create a new tanuki character (edit `bar-tabs/src/data/tanukis.ts`)
- 🎨 Improve CSS animations
- 📝 Fix typos or improve documentation
- 🐛 Report bugs by opening an issue

---

## 📜 License

MIT License — free to use, modify, and distribute. See [LICENSE](./LICENSE) for details.

---

<p align="center">
  <strong>🍶 ポンポコ! 🍶</strong><br>
  <em>Built with sake and good vibes</em>
</p>
