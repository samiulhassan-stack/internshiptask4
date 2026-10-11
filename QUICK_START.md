# Quick Start Guide 🚀

## Option 1: Easy Start (Windows Batch File)
Just double-click:
```
start.bat
```

This will:
1. Install all dependencies
2. Start both frontend and backend servers
3. Open automatically in your browser

---

## Option 2: Manual Commands

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Both Servers (Recommended)
```bash
npm run dev
```

This starts:
- ✅ Frontend: http://localhost:3000
- ✅ Backend: http://localhost:5000

### Step 3: Open Your Browser
Navigate to: **http://localhost:3000**

---

## Option 3: Run Servers Separately

**Terminal 1 - Start Frontend:**
```bash
npm run dev:client
```
Runs on: http://localhost:3000

**Terminal 2 - Start Backend:**
```bash
npm run dev:server
```
Runs on: http://localhost:5000

---

## ⚡ Quick Test

Once running, try this:

### Valid Submission Test:
1. Full Name: `John Doe`
2. Email: `john@example.com`
3. Phone: `+1 555-123-4567`
4. Event Type: Select `Workshop`
5. Event Date: Pick tomorrow
6. Message: `I'm excited to learn and network at this event!`
7. Profile Image: Upload any JPG/PNG
8. Click **Register for Event**
9. ✅ See success toast!

### Invalid Submission Test:
1. Leave all fields empty
2. Click **Register for Event**
3. ❌ See validation errors!

---

## 📁 Project URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Main form interface |
| Backend | http://localhost:5000 | API server |
| Health Check | http://localhost:5000/api/health | Server status |
| View Registrations | http://localhost:5000/api/registrations | See all submissions |

---

## 🛑 Stop Servers

Press `Ctrl + C` in the terminal running the servers.

---

## 📂 Project Structure

```
task4/
├── src/                    # Frontend code
│   ├── App.jsx            # Main form component
│   ├── components/
│   │   └── Toast.jsx      # Notification system
│   └── index.css          # Styles
├── server/                 # Backend code
│   ├── index.js           # Express server
│   └── uploads/           # Uploaded images
├── package.json           # Dependencies
├── start.bat              # Quick start script
└── README.md              # Full documentation
```

---

## 🎥 Ready to Record?

See **TESTING_GUIDE.md** for detailed video recording instructions!

---

## ❓ Troubleshooting

### Port Already in Use
If you see "Port 3000 is already in use":
```bash
# Windows - Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rmdir /s /q node_modules
npm install
```

### Server Not Starting
Make sure you're in the project directory:
```bash
cd task4
npm run dev
```

---

## 📞 Quick Command Reference

| Task | Command |
|------|---------|
| Install | `npm install` |
| Start both | `npm run dev` |
| Start frontend only | `npm run dev:client` |
| Start backend only | `npm run dev:server` |
| Build for production | `npm run build` |
| Preview production build | `npm run preview` |

---

## ✅ Verify Installation

After running `npm install`, check that you see:
- ✅ `node_modules/` folder created
- ✅ `package-lock.json` file created
- ✅ No error messages in terminal

---

## 🎯 Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Start servers: `npm run dev`
3. ✅ Test the form: http://localhost:3000
4. 📹 Record demo video (see TESTING_GUIDE.md)
5. 📱 Post on LinkedIn (see README.md for template)

---

**Everything is ready! Start the servers and begin testing! 🚀**
