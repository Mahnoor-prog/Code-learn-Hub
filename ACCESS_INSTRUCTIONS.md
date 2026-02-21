# How to Access Your Website Anywhere

To access your website from other devices or share it with others, you have a few options.

## Option 1: Temporary Access (LocalTunnel)
This method allows you to share your currently running local website temporarily.

1.  **Start your website** normally:
    ```bash
    npm run dev
    ```
2.  **Open a new terminal** and run:
    ```bash
    npx localtunnel --port 5173
    ```
3.  Copy the URL provided (e.g., `https://cold-table-99.loca.lt`) and share it.
4.  **Note**: The first time someone visits the link, they may need to click "Click to Continue" on the LocalTunnel warning page.

## Option 2: Permanent Deployment (Recommended)
For a permanent "real" website, you should deploy to a hosting provider.

### Frontend (Vercel/Netlify)
1.  Push your code to GitHub.
2.  Import your repository to Vercel or Netlify.
3.  Set the build command to `npm run build` and output directory to `dist`.

### Backend (Render/Heroku/Railway)
1.  Push your code to GitHub.
2.  Create a new Web Service on Render/Railway.
3.  Set the build command to `npm install` and start command to `node server/index.js`.
4.  Add your Environment Variables (`MONGODB_URI`, etc.) in the dashboard.

### Update Frontend Configuration
Once deployed, you must update the `server/index.js` CORS settings to allow your new frontend domain, and update the frontend `src/utils/api.js` (or `.env`) to point to your new backend URL instead of `localhost`.
