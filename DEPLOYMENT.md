# Deployment Guide 🚀

## GitHub Upload ✅

Code successfully uploaded to: https://github.com/samiulhassan-stack/internshiptask4

---

## Live Deployment Options

### Option 1: Vercel (Recommended - Easy & Free)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Deploy
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? (Select your account)
- Link to existing project? **N**
- Project name? **internshiptask4**
- Directory? **./
- Override settings? **N**

#### Step 4: Get Your Live URL
Vercel will provide a URL like: `https://internshiptask4.vercel.app`

---

### Option 2: Netlify + Railway

#### Frontend (Netlify - Free)

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Select repository: `internshiptask4`
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variable:
   - Key: `VITE_BACKEND_URL`
   - Value: (Your Railway backend URL)
7. Deploy!

#### Backend (Railway - Free tier)

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select repository: `internshiptask4`
4. Add variables:
   - Root directory: `server`
   - Start command: `node index.js`
5. Deploy!
6. Copy the Railway URL (e.g., `https://your-app.railway.app`)
7. Add this URL to Netlify environment variables

---

### Option 3: Render (All-in-One - Free)

#### Deploy Backend:
1. Go to https://render.com
2. Click "New" → "Web Service"
3. Connect GitHub repository
4. Settings:
   - Name: `internshiptask4-backend`
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `node index.js`
5. Create Web Service

#### Deploy Frontend:
1. Click "New" → "Static Site"
2. Select same repository
3. Settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
4. Environment Variables:
   - `VITE_BACKEND_URL`: (Your backend URL from above)
5. Create Static Site

---

## Quick Deploy with Vercel (Easiest Method)

### If you don't want CLI, use Vercel Dashboard:

1. **Go to:** https://vercel.com/new
2. **Import** your GitHub repository
3. **Configure:**
   - Framework Preset: Vite
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variables:** (Optional for now)
   - `VITE_BACKEND_URL`: (Use Vercel's backend URL after deploying)
5. **Click Deploy**
6. Wait 1-2 minutes
7. **Get your live URL!**

---

## Important Notes for Production

### 1. File Uploads Issue
⚠️ Vercel serverless functions are stateless - uploaded files won't persist!

**Solutions:**
- Use **Cloudinary** for image uploads (recommended)
- Use **AWS S3** or **Google Cloud Storage**
- Use a separate file hosting service

### 2. Environment Variables
Make sure to set:
- `VITE_BACKEND_URL` - Frontend needs to know backend URL

### 3. CORS
Backend already has CORS enabled in `server/index.js`:
```javascript
app.use(cors());
```

---

## Testing Your Live Site

After deployment:

1. **Visit your live URL**
2. **Fill the form** with valid data
3. **Submit** and check if it works
4. **Test validation** with invalid data

---

## Troubleshooting

### Frontend can't connect to backend?
- Check `VITE_BACKEND_URL` environment variable
- Make sure backend is deployed and running
- Check browser console for errors

### File upload not working?
- Vercel serverless doesn't support file storage
- Switch to Cloudinary or S3 for production

### Backend crashes?
- Check Railway/Render logs
- Make sure all npm packages are in `dependencies` (not `devDependencies`)

---

## Current Setup

✅ **GitHub:** https://github.com/samiulhassan-stack/internshiptask4
⏳ **Live URL:** (Deploy karne ke baad yahan add karo)

---

## Recommended Stack for Full Production:

- **Frontend:** Vercel or Netlify
- **Backend:** Railway or Render
- **File Storage:** Cloudinary (free tier: 25GB)
- **Database:** MongoDB Atlas (if needed later)

---

**Need help with deployment? Follow the Vercel option - it's the easiest!** 🚀
