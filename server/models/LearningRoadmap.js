import mongoose from 'mongoose';

const roadmapStepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  language: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  moduleTitle: { type: String, default: '' },
  estimatedDays: { type: Number, default: 7 },
  dailyPlan: { type: String, default: '' },
  priority: { type: Number, default: 1 }
}, { _id: false });

const learningRoadmapSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  startLanguage: { type: String, default: '' },
  startLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  estimatedCompletionTime: { type: String, default: '' },
  dailyStudyPlan: { type: String, default: '' },
  steps: [roadmapStepSchema],
  aiSummary: { type: String, default: '' },
  generatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('LearningRoadmap', learningRoadmapSchema);
