import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    codeExample: { type: String },
    exercise: { type: mongoose.Schema.Types.Mixed }, // to support the JSON object requirements from prompt
    language: { type: String, required: true },
    order: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Lesson', lessonSchema);
