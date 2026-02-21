# 🔧 Fix MongoDB Connection Timeout

## Issue: Connection timing out

The error shows: `Operation modules.find() buffering timed out`

This usually means:
1. MongoDB Atlas Network Access isn't fully active yet (takes 2-5 minutes)
2. Connection string needs adjustment
3. IP address not properly configured

## ✅ Quick Fix Steps:

### Step 1: Check MongoDB Atlas Network Access

1. Go to: https://cloud.mongodb.com/
2. Click your cluster: **hub-page**
3. Click **"Network Access"** in left sidebar
4. Make sure you see your IP: **121.52.153.98/32** with status **"Active"**
5. If it's not active, wait 2-3 more minutes

### Step 2: Add "Allow from Anywhere" (Easier)

1. In Network Access page
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (shows `0.0.0.0/0`)
4. Click **"Confirm"**
5. Wait 2-3 minutes for it to activate

This allows connection from any IP address.

### Step 3: Verify Connection String

Your `.env` file should have:
```
MONGODB_URI=mongodb+srv://noor03012066_db_user:Gq5UBmH3csVyrq9B@hub-page.pwsvrbh.mongodb.net/codelearnhub?retryWrites=true&w=majority
```

### Step 4: Restart Server

1. Stop server (Ctrl+C)
2. Wait 30 seconds
3. Run: `npm run dev`
4. Check for: `✅ MongoDB Connected`

## Alternative: Use Local MongoDB (For Testing)

If Atlas keeps timing out, you can use local MongoDB:

1. Install MongoDB locally
2. Change `.env` to:
   ```
   MONGODB_URI=mongodb://localhost:27017/codelearnhub
   ```
3. Restart server

## ⏰ Wait Time

MongoDB Atlas network access changes can take **2-5 minutes** to activate. Be patient!

Try "Allow from Anywhere" option - it's easier and works immediately after activation.


