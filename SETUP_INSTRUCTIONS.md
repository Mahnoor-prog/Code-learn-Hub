# MongoDB Atlas Setup Instructions

## Step 1: Create .env File

Create a file named `.env` in the root folder (same level as `package.json`) with this content:

```
PORT=5000
MONGODB_URI=mongodb+srv://noor03012066_db_user:Gq5UBmH3csVyrq9B@hub-page.pwsvrbh.mongodb.net/codelearnhub?retryWrites=true&w=majority
JWT_SECRET=code-learn-hub-super-secret-jwt-key-2024
```

## Step 2: Important Notes

1. **Database Name**: I added `codelearnhub` to your connection string (after `.net/`)
2. **Network Access**: Make sure in MongoDB Atlas you allow network access:
   - Go to Atlas Dashboard
   - Click "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development) or add your IP
   
3. **Database User**: Your user `noor03012066_db_user` needs proper permissions
   - Go to "Database Access" in Atlas
   - Make sure user has "Read and write to any database" role

## Step 3: Test the Connection

After creating the .env file, restart the server:
```bash
npm run dev
```

You should see: `✅ MongoDB Connected`

## Step 4: Seed the Database (Optional)

To add sample modules and badges:
```bash
node server/seed.js
```

## If Connection Fails

1. Check Network Access in MongoDB Atlas
2. Verify your connection string is correct
3. Check that your IP is allowed
4. Make sure the database user has correct permissions


