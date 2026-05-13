# 💬 TUNGCHATBOX
> made by: the one and only AJ himself ✨

A full-featured chat platform built with React + Vite.

---

## 🚀 Quick Start (Run Locally)

### 1. Install dependencies
```bash
npm install
```

### 2. Start the dev server
```bash
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## 🌐 Deploy as a Website

### Option A — Netlify (Easiest, Free)
1. Go to [netlify.com](https://netlify.com) and sign up
2. Click **"Add new site" → "Deploy manually"**
3. Run `npm run build` — this creates a `dist/` folder
4. Drag and drop the `dist/` folder onto Netlify
5. Done — you get a live URL instantly!

### Option B — Vercel (Also Free)
1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) and sign up
3. Click **"New Project"** → import your GitHub repo
4. Vercel auto-detects Vite — just click Deploy
5. Done!

### Option C — GitHub Pages
```bash
npm install --save-dev gh-pages
```
Add to `package.json` scripts:
```json
"deploy": "gh-pages -d dist"
```
Then:
```bash
npm run build
npm run deploy
```

---

## 🔑 Owner Account
- **Username:** `A0X0J`
- **Password:** `67G0DOWNER`

Log in with this to get the 👑 OWNER crown and full Admin Panel access.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 Auth | Register/login with username + password (no email needed) |
| 🚫 Username filter | Blocks inappropriate names automatically |
| 🌐 Multiple servers | Create your own servers, join others |
| 💬 Channels | Text channels per server, read-only support |
| 📎 Media | Send images & videos inline, click to zoom |
| 👑 Roles | Owner → Co-Owner → Admin → Mod → Member |
| ⚙️ Admin Panel | Ban, unban, mute, unmute, kick users by username |
| ➕ Add members | Invite registered users to your server |
| 💾 Persistence | Everything saves to localStorage |

---

## 📁 Project Structure

```
tungchatbox/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx          ← React entry point
    ├── App.jsx           ← Root state & logic
    ├── App.css           ← All styles
    ├── constants.js      ← Seed data & config
    ├── utils/
    │   ├── helpers.js    ← Role logic, formatting
    │   └── storage.js    ← localStorage wrapper
    └── components/
        ├── LoadingScreen.jsx
        ├── AuthScreen.jsx
        ├── ServerSelect.jsx
        ├── ChatRoom.jsx
        ├── AdminPanel.jsx
        ├── Avatar.jsx
        └── RoleBadge.jsx
```

---

## 🛠️ Build for Production
```bash
npm run build
```
Output goes to the `dist/` folder — ready to upload anywhere.
