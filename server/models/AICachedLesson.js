import mongoose from 'mongoose';

const aiCachedLessonSchema = new mongoose.Schema({
    topic: { type: String, required: true },
    language: { type: String, required: true },
    level: { type: Number, required: true },
    content: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

export default mongoose.model('AICachedLesson', aiCachedLessonSchema);
