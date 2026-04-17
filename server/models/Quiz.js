import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
    topic: { type: String, required: true },
    language: { type: String, required: true },
    level: { type: Number, required: true },
    questions: [{
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: String, required: true }
    }]
}, { timestamps: true });

export default mongoose.model('Quiz', quizSchema);
