import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
    topic: { type: String, required: true },
    language: { type: String, required: true },
    level: { type: Number, required: true },
    content: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Lesson', lessonSchema);
