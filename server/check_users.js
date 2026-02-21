import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to DB');
        const count = await User.countDocuments();
        console.log(`User count: ${count}`);
        if (count > 0) {
            const users = await User.find({}, 'email name role');
            console.log('Users:', users);
        } else {
            console.log('No users found.');
        }
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
