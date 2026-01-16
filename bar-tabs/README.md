# 🦝 狸御殿 Bar Tabs

**Tanuki Palace Point of Sale System** — A whimsical bar tab tracker for sake-loving tanuki customers, built as a learning example of how to convert Excel-style spreadsheets into modern web apps.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwindcss)
![Radix UI](https://img.shields.io/badge/Radix_UI-Tabs-purple?style=flat-square)
![Zustand](https://img.shields.io/badge/Zustand-State-orange?style=flat-square)

---

## 🎯 What Is This?

This project demonstrates how to **recreate an Excel-based scoping/tracking document as a web app**. Instead of a boring spreadsheet, we built a themed Point of Sale system for a fictional Japanese izakaya (tavern) run by tanuki (Japanese raccoon dogs from folklore).

**Key Excel concepts translated to React:**
| Excel Feature | Web App Equivalent |
|--------------|-------------------|
| Multiple sheets/tabs | Radix UI Tabs component |
| VLOOKUP formulas | TypeScript lookup functions |
| Cell calculations | React state + computed values |
| Data tables | JSON/TypeScript data files |
| Dropdowns | HTML `<select>` with React Hook Form |
| Real-time updates | `useEffect` + Zustand state |

---

## ✨ Features

- 📋 **4 Excel-like tabs**: Open Tabs, Customers, Sake Menu, Summary
- 🍶 **8 sake items** with prices (¥800–¥10,000) and "drunk points"
- 🦝 **5 tanuki customers** with unique personalities and alcohol tolerances
- 🥴 **Dynamic drunk level system**: Sober → Tipsy → Merry → Drunk → Plastered → Blacked Out
- 💰 **Live pricing calculations**: Subtotal, discounts, tips, totals
- 💾 **Persistent state**: Tabs survive page refresh (localStorage)
- 🌐 **Bilingual**: Japanese + English names throughout

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed on your computer:

- **Node.js** (version 18 or higher) — [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **Bun** — [Install Bun](https://bun.sh/)
- **Git** — [Download here](https://git-scm.com/)

> 💡 **New to this?** Node.js is a JavaScript runtime that lets you run JavaScript outside a browser. npm is a package manager that installs libraries your project needs.

### Step 1: Clone the Repository

Open your terminal (Command Prompt on Windows, Terminal on Mac/Linux) and run:

```bash
git clone https://github.com/YOUR_USERNAME/tanukipalace.git
cd tanukipalace/bar-tabs
```

### Step 2: Install Dependencies

This downloads all the libraries the project needs:

```bash
npm install
```

> 💡 **What's happening?** This reads `package.json` and downloads ~400 packages into a `node_modules` folder. This is normal and may take 1-2 minutes.

### Step 3: Start the Development Server

```bash
npm run dev
```

You should see output like:
```
▲ Next.js 15.x
- Local: http://localhost:3000
```

### Step 4: Open in Your Browser

Go to **http://localhost:3000** and you'll see the Tanuki Palace Bar Tabs app!

---

## 📁 Project Structure

```
bar-tabs/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Main page with all 4 tabs
│   │   ├── layout.tsx         # Root layout (fonts, metadata)
│   │   └── globals.css        # Global styles + theme
│   │
│   ├── data/                   # 📊 Data files (like Excel sheets)
│   │   ├── sake.ts            # Sake menu with prices
│   │   └── tanukis.ts         # Customer list with drunk thresholds
│   │
│   ├── store/                  # 🗄️ State management
│   │   └── tabStore.ts        # Zustand store for bar tabs
│   │
│   └── lib/                    # 🔧 Utility functions
│       └── utils.ts           # Currency formatting, etc.
│
├── package.json               # Project dependencies
├── tailwind.config.ts         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

---

## 🧠 How It Works (For Learners)

### 1. Data as Code (Replacing Excel Sheets)

Instead of Excel cells, we store data in TypeScript files:

```typescript
// src/data/sake.ts
export const sakeMenu: Sake[] = [
  {
    id: 'house-junmai',
    name: 'House Junmai',
    nameJp: '純米酒',
    price: 800,
    drunkPoints: 1,
  },
  // ... more items
];
```

> 💡 **Why TypeScript?** It adds type checking, so you get autocomplete and catch errors before running code. The `Sake` type ensures every sake has the required fields.

### 2. VLOOKUP → JavaScript Functions

Excel's `VLOOKUP(A2, Sheet2!A:B, 2, FALSE)` becomes:

```typescript
// src/data/sake.ts
export const getSakeById = (id: string): Sake | undefined => {
  return sakeMenu.find((s) => s.id === id);
};

export const getSakePrice = (id: string, quantity: number): number => {
  const sake = getSakeById(id);
  return sake ? sake.price * quantity : 0;
};
```

> 💡 **How it works:** `Array.find()` searches the array and returns the first match—just like VLOOKUP searches a column.

### 3. State Management with Zustand

Instead of cell references, we use a **store** to share data across components:

```typescript
// src/store/tabStore.ts
import { create } from 'zustand';

export const useTabStore = create((set, get) => ({
  tabs: [],
  
  addOrder: (tanukiId, sakeId, quantity) => {
    set((state) => ({
      tabs: state.tabs.map((t) =>
        t.tanukiId === tanukiId
          ? { ...t, orders: [...t.orders, { sakeId, quantity }] }
          : t
      ),
    }));
  },
  
  getTabTotal: (tanukiId) => {
    const tab = get().tabs.find((t) => t.tanukiId === tanukiId);
    return tab?.orders.reduce(
      (sum, order) => sum + getSakePrice(order.sakeId, order.quantity),
      0
    ) ?? 0;
  },
}));
```

> 💡 **Why Zustand?** It's the simplest state library for React. Unlike Redux, there's no boilerplate. Call `useTabStore()` in any component to read/write state.

### 4. Tabs with Radix UI

Excel's sheet tabs become React components:

```tsx
// src/app/page.tsx
import * as Tabs from '@radix-ui/react-tabs';

<Tabs.Root defaultValue="tabs">
  <Tabs.List>
    <Tabs.Trigger value="tabs">Open Tabs</Tabs.Trigger>
    <Tabs.Trigger value="menu">Sake Menu</Tabs.Trigger>
  </Tabs.List>
  
  <Tabs.Content value="tabs">
    {/* Tab content here */}
  </Tabs.Content>
  
  <Tabs.Content value="menu">
    {/* Menu content here */}
  </Tabs.Content>
</Tabs.Root>
```

> 💡 **Why Radix UI?** It handles keyboard navigation, focus management, and accessibility automatically. You focus on styling, not behavior.

### 5. Live Calculations with React

Instead of Excel formulas auto-updating, we use React's reactivity:

```tsx
// When state changes, React re-renders components
const total = useTabStore((state) => state.getTabTotal(tanukiId));

return <div>Total: ¥{total.toLocaleString()}</div>;
```

> 💡 **How React works:** When `tabs` state changes, Zustand notifies React, which re-calculates `total` and updates the DOM. It's automatic!

---

## 🛠️ Tech Stack Explained

| Technology | What It Does | Why We Chose It |
|-----------|--------------|-----------------|
| **Next.js 15** | React framework with routing | Industry standard, great DX, easy deployment |
| **TypeScript** | JavaScript with types | Catches bugs early, better autocomplete |
| **Tailwind CSS** | Utility-first CSS | Rapid styling without writing CSS files |
| **Radix UI** | Unstyled accessible components | Tabs, selects, dialogs that just work |
| **Zustand** | State management | Simplest option for sharing data |
| **Lucide React** | Icon library | Clean, consistent icons |

---

## 📖 Learning Resources

Want to build something similar? Here's where to learn:

### Fundamentals
- [React Official Tutorial](https://react.dev/learn) — Start here if new to React
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/) — Learn types
- [Tailwind CSS Docs](https://tailwindcss.com/docs) — Utility classes reference

### This Stack
- [Next.js App Router Docs](https://nextjs.org/docs/app) — File-based routing
- [Zustand GitHub](https://github.com/pmndrs/zustand) — State management patterns
- [Radix UI Primitives](https://www.radix-ui.com/primitives) — Component APIs

### Video Tutorials
- [Theo's T3 Stack Tutorial](https://www.youtube.com/c/TheoBrowne1017) — Modern React patterns
- [Jack Herrington](https://www.youtube.com/c/JackHerrington) — Advanced React/Next.js

---

## 🎨 Customizing the Theme

The color scheme is defined in `src/app/globals.css`:

```css
:root {
  --night-deep: #0a0a1a;      /* Background */
  --palace-gold: #d4a853;      /* Primary accent */
  --lantern-glow: #ff6b35;     /* Secondary accent */
  --tanuki-cream: #f5e6c8;     /* Text color */
}
```

Change these values to create your own theme!

---

## 🔧 Common Issues

### "npm: command not found"
Install Node.js from https://nodejs.org/

### "Port 3000 is already in use"
Either stop the other process or use a different port:
```bash
npm run dev -- -p 3001
```

### "Module not found" errors
Delete `node_modules` and reinstall:
```bash
rm -rf node_modules
npm install
```

---

## 📦 Building for Production

To create an optimized build:

```bash
npm run build
npm start
```

To deploy, push to GitHub and connect to [Vercel](https://vercel.com) (free tier available).

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b my-feature`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin my-feature`
5. Open a Pull Request

---

## 📜 License

MIT License — feel free to use this for learning, modify it, or build upon it!

---

## 🦝 About Tanuki

Tanuki (狸) are Japanese raccoon dogs famous in folklore for their mischievous nature, shapeshifting abilities, and love of sake. They're often depicted with big bellies they drum on for magical effects. This project celebrates their whimsy!

---

<p align="center">
  <strong>Built with 🍶 by sake-loving developers</strong><br>
  <em>Part of the Tanuki Palace project</em>
</p>
