# 👜 Krapao (กระเป๋า)

### *Your Digital Wallet that Actually Helps You Save.*

**Krapao** คือเว็บแอปพลิเคชันจัดการการเงินส่วนบุคคลแบบ Open Source ที่ออกแบบมาเพื่อคนทั่วไป โดยเน้นความง่าย (Simplicity) และความเป็นส่วนตัว (Privacy) ช่วยให้คุณจัดระเบียบ "กระเป๋า" ของคุณได้ในไม่กี่คลิก พร้อมระบบ AI ช่วยวิเคราะห์และสแกนใบเสร็จที่แม่นยำ

**[🌐 ลองใช้งาน Demo](https://krapao.vercel.app/)** | **[📖 วิธีการติดตั้ง](#-getting-started)** | **[🐞 แจ้งปัญหา](https://github.com/ChunWarayut/Krapao/issues)**

---

## ✨ Features (ทำไมต้อง Krapao?)

*   **👛 Multi-Pocket System:** แยกกระเป๋าเงินเก็บ เงินกิน และเงินเที่ยวออกจากกันอย่างชัดเจน พร้อมติดตามยอดเงินแบบ Real-time
*   **⚡ Magic Scan (OCR):** บันทึกรายจ่ายเร็วฟ้าผ่าด้วยระบบสแกนใบเสร็จ ดึงยอดเงินอัตโนมัติ (Powered by Tesseract.js)
*   **🏷️ Smart Tagging:** จัดหมวดหมู่ค่าใช้จ่ายอัจฉริยะ ช่วยให้คุณรู้ว่าเงินหายไปกับอะไรมากที่สุด
*   **📊 Insightful Dashboard:** สรุปภาพรวมการเงินด้วยกราฟที่สวยงามและเข้าใจง่าย (Powered by Recharts)
*   **🎯 Goal Tracker:** วางแผนและติดตามเป้าหมายการออมเงินด้วยระบบ Visual Progress
*   **🔒 Privacy First:** ข้อมูลของคุณถูกเก็บอย่างปลอดภัยด้วย Supabase และมีโหมดซ่อนยอดเงิน (Privacy Mode) สำหรับใช้ในที่สาธารณะ
*   **🌓 Premium Dark Theme:** ดีไซน์แบบ Glassmorphism ที่ทันสมัย สวยงาม และถนอมสายตา

---

## 🛠️ Tech Stack

โปรเจกต์นี้เลือกใช้เทคโนโลยีที่ทันสมัยที่สุด เพื่อประสิทธิภาพและความลื่นไหล:

*   **Frontend:** [Next.js 15](https://nextjs.org/) (App Router & Turbopack)
*   **State Management:** [Zustand](https://docs.pmnd.rs/zustand/) (Offline-first architecture)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS (Custom Glassmorphism)
*   **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL + RLS)
*   **Utility:** Tesseract.js (OCR), Lucide React (Icons), jsPDF (Report generation)

---

## 🚀 Getting Started

หากต้องการรันโปรเจกต์นี้ในเครื่องของคุณเอง:

1. **Clone the repository**
   ```bash
   git clone https://github.com/ChunWarayut/Krapao.git
   cd Krapao
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   สร้างไฟล์ `.env` และใส่ API Keys จาก Supabase ของคุณ:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

---

## 📸 Screenshots

| Dashboard Overview | Smart Features |
| :---: | :---: |
| ![Dashboard](https://raw.githubusercontent.com/ChunWarayut/Krapao/refs/heads/main/public/image.png) | ![Features](https://raw.githubusercontent.com/ChunWarayut/Krapao/refs/heads/main/public/logo.png) |

---

## 🤝 Contributing

โปรเจกต์นี้เป็น Open Source! หากคุณมีไอเดียเจ๋งๆ หรืออยากช่วยแก้ Bug สามารถส่ง **Pull Request** มาได้เลยครับ เรายินดีต้อนรับทุกการสนับสนุน!

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

### 💡 About the Project

Krapao ถูกสร้างขึ้นด้วยความใส่ใจในเรื่อง **User Experience** และ **Privacy** โดยมีเป้าหมายเพื่อทำให้การบันทึกรายจ่ายเป็นเรื่องสนุกและไม่น่าเบื่ออีกต่อไป หากคุณชอบโปรเจกต์นี้ อย่าลืมกด ⭐️ บน GitHub เพื่อเป็นกำลังใจให้ด้วยนะครับ!
