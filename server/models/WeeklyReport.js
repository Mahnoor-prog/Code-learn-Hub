import mongoose from 'mongoose';

const weeklyReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weekStart: { type: Date, required: true },
  weekEnd: { type: Date, required: true },
  totalLessonsCompleted: { type: Number, default: 0 },
  averageQuizScore: { type: Number, default: 0 },
  strongestTopic: { type: String, default: '' },
  weakestTopic: { type: String, default: '' },
  recommendedFocus: { type: String, default: '' },
  motivationalMessage: { type: String, default: '' },
  predictedCompletionDate: { type: String, default: '' }
}, { timestamps: true });

weeklyReportSchema.index({ userId: 1, weekStart: 1 }, { unique: true });

export default mongoose.model('WeeklyReport', weeklyReportSchema);
