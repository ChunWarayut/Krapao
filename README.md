# 🌿 Krapao (กระเป๋า)

### Essential Digital Wallet for Minimalist Living

Krapao is a mobile-first, privacy-focused financial tracker designed for speed and simplicity. Built with Next.js 15 and Tailwind CSS, it features a premium glassmorphism dark theme and robust cloud synchronization.

![Dashboard Preview](https://raw.githubusercontent.com/ChunWarayut/Krapao/refs/heads/main/public/image.png)

## ✨ Key Features

- **⚡ Magic Scan (OCR)**: Instantly extract totals from receipts using Tesseract.js.
- **🏷️ Smart Tagging**: AI-inspired categorization for your spending.
- **👛 Multi-Pocket**: Manage Cash, Bank, and Savings with real-time balance tracking.
- **🎯 Goal Tracker**: Visual, interactive progress tracking for your financial goals.
- **🕵️ Privacy Mode**: Instantly blur all balances for safe use in public.
- **📊 Professional Reports**: Export monthly budget summaries to beautifully styled PDFs.
- **☁️ Cloud Sync**: Real-time backup and multi-device synchronization with Supabase.
- **🌑 Pure Dark Theme**: Optimized glassmorphism UI designed for high-end aesthetics.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router / Turbopack)
- **Database/Auth**: Supabase (PostgreSQL + RLS)
- **State**: Zustand (Offline-first architecture)
- **Styling**: Vanilla CSS + Tailwind + Lucide Icons
- **Utility**: Date-fns, Tesseract.js, jsPDF
- **Design**: Premium Glassmorphism with HSL tailored color palettes

## 🛠️ Getting Started

1. **Install Dependencies**:

   ```bash
   npm install
   ```
2. **Setup Environment**:
   Create a `.env` file with your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_key
   ```
3. **Database Setup**:
   Run the SQL script provided in the documentation to initialize tables and Row Level Security (RLS) policies.
4. **Run Project**:

   ```bash
   npm run dev  # Development
   npm run build # Production Build
   ```

## 🔐 Security & Privacy

Krapao implements an **Offline-First** strategy. Data is visible instantly through optimistic UI updates and synchronized securely in the background. Each user's data is isolated using **Row Level Security (RLS)**, ensuring that your financial records are only accessible to you.

## 📱 Mobile-First Design

The entire UI is built with a **Bottom-Heavy Navigation** strategy, ensuring all critical actions are within reach of your thumb.

---

*Created with ❤️ for simple, secure finance.*
