import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema({
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  timeSpentSeconds: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now }
}, { _id: false });

const lessonPerformanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  lessonId: { type: String, required: true },
  lessonTitle: { type: String, default: '' },
  language: { type: String, default: '' },
  level: { type: String, default: 'Beginner' },
  attempts: [attemptSchema],
  bestScore: { type: Number, default: 0 },
  totalRetakes: { type: Number, default: 0 },
  failStreak: { type: Number, default: 0 },
  weakTopic: { type: Boolean, default: false },
  strongTopic: { type: Boolean, default: false }
}, { timestamps: true });

lessonPerformanceSchema.index({ userId: 1, moduleId: 1, lessonId: 1 }, { unique: true });

export default mongoose.model('LessonPerformance', lessonPerformanceSchema);
