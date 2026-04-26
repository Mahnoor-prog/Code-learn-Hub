import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

if (!admin.apps.length) {
    admin.initializeApp({
        // For verifying ID tokens, projectId is often sufficient. 
        // For full admin capabilities, you'll need to use credential: admin.credential.cert(serviceAccount)
        projectId: process.env.FIREBASE_PROJECT_ID || 'code-learn-hub'
    });
}

export default admin;
