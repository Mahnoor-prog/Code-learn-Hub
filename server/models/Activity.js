import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true }, // e.g., "Lesson Completed", "Badge Earned", "Module Started"
    item: { type: String, required: true }, // The specific item name like "Python Basics"
    icon: { type: String } // Visual icon e.g., "✅", "🎓"
}, { timestamps: true });

export default mongoose.model('Activity', activitySchema);
