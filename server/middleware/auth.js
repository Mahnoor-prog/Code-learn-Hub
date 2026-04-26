import admin from '../firebaseAdmin.js';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  // DEV_BYPASS_AUTH=true in .env lets you skip auth during local testing
  if (process.env.DEV_BYPASS_AUTH === 'true') {
    req.userId = process.env.DEV_USER_ID || '655d8f9b9f1b9b0012345678';
    return next();
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Find the MongoDB user using the Firebase UID
    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    
    if (!user) {
        // If the user hasn't been synced to MongoDB yet, we still let them through?
        // No, they must be registered. But for /api/auth/register, we don't use this middleware anyway.
        return res.status(401).json({ message: 'User not found in database' });
    }

    req.userId = user._id; // Set req.userId to MongoDB _id for compatibility
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: 'Invalid token' });
  }
};
