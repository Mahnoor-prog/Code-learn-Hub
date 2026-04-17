import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  language: { type: String, required: true },
  level: { type: Number, default: 1 },
  lessonsCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  quizScores: [{
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    score: Number
  }],
  exercisesDone: { type: Number, default: 0 },
  streakDays: { type: Number, default: 0 },
  badges: [{ type: String }],
  lastActive: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Progress', progressSchema);
