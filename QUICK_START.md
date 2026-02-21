# ⚡ QUICK START GUIDE - Get Your Website Running!

## 🎯 You already have MongoDB Atlas! Follow these 3 steps:

### STEP 1: Create `.env` file

1. In your project folder (`e:\trywebsite`), **create a new file** called `.env`
   - Right-click in the folder → New → Text Document
   - Rename it to `.env` (remove .txt extension)

2. **Open the file** and paste this:

```
PORT=5000
MONGODB_URI=mongodb+srv://noor03012066_db_user:Gq5UBmH3csVyrq9B@hub-page.pwsvrbh.mongodb.net/codelearnhub?retryWrites=true&w=majority
JWT_SECRET=code-learn-hub-secret-key-2024
```

3. **Save the file**

### STEP 2: Allow Network Access in MongoDB Atlas

1. Go to: https://cloud.mongodb.com/
2. Login with your account
3. Click on your cluster: **hub-page**
4. Click **"Network Access"** (left sidebar)
5. Click **"Add IP Address"** button
6. Select **"Allow Access from Anywhere"** (this adds `0.0.0.0/0`)
7. Click **"Confirm"**

**Wait 2-3 minutes** for it to activate!

### STEP 3: Start Your Website

Open terminal in your project folder and run:

```bash
npm run dev
```

You should see:
- ✅ MongoDB Connected
- 🚀 Server running on http://localhost:5000
- Frontend running on http://localhost:5173

### STEP 4 (Optional): Add Sample Data

Open a NEW terminal window and run:

```bash
node server/seed.js
```

This adds:
- 10 modules (Python, C++, C#, Java, React)
- 5 badges

## 🎉 Done! Your website is now FULLY FUNCTIONAL!

Open your browser: **http://localhost:5173**

---

## ❌ Having Issues?

**Error: MongoDB Connection Failed?**
- Check Network Access is set to `0.0.0.0/0` (Allow from anywhere)
- Wait 2-3 minutes after changing Network Access
- Check `.env` file exists and has correct connection string

**Error: Cannot find .env file?**
- Make sure file is named exactly `.env` (no .txt extension)
- File should be in root folder (same level as package.json)


