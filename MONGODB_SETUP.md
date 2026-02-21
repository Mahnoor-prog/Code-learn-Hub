# 🚀 MongoDB Atlas Setup - Step by Step Guide

## You have your connection string! Here's what to do next:

### Step 1: Create `.env` file

1. In your project root folder (`e:\trywebsite`), create a new file named `.env`
2. Copy and paste this EXACT content:

```
PORT=5000
MONGODB_URI=mongodb+srv://noor03012066_db_user:Gq5UBmH3csVyrq9B@hub-page.pwsvrbh.mongodb.net/codelearnhub?retryWrites=true&w=majority
JWT_SECRET=code-learn-hub-super-secret-jwt-key-2024
```

**Important:** I added `/codelearnhub` after `.net/` - this is your database name!

### Step 2: Configure MongoDB Atlas Network Access

1. Go to https://cloud.mongodb.com/ and login
2. Click on your cluster (hub-page)
3. Click **"Network Access"** in the left sidebar
4. Click **"Add IP Address"** button
5. Click **"Allow Access from Anywhere"** (shows as `0.0.0.0/0`)
   - OR add your current IP address
6. Click **"Confirm"**

### Step 3: Verify Database User Permissions

1. In MongoDB Atlas, click **"Database Access"** in left sidebar
2. Find your user: `noor03012066_db_user`
3. Click **"Edit"**
4. Make sure it has **"Read and write to any database"** role
5. Click **"Update User"**

### Step 4: Restart Your Server

1. Stop the current server (Ctrl+C in terminal)
2. Run again:
   ```bash
   npm run dev
   ```

You should see: `✅ MongoDB Connected`

### Step 5: Seed Database (Optional but Recommended)

Add sample modules and badges:
```bash
node server/seed.js
```

## ✅ That's it! Your backend is now connected to MongoDB Atlas!

If you see any errors, check:
- Network Access is configured correctly
- Connection string in .env file is correct
- User has proper permissions


