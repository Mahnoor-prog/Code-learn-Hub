import mongoose from 'mongoose';

const userLearningProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, default: '' },
  ageGroup: {
    type: String,
    enum: ['Under 18', '18-25', '25-35', '35+'],
    default: '18-25'
  },
  experience: {
    type: String,
    enum: ['Complete Beginner', 'Know Basics', 'Intermediate', 'Advanced'],
    default: 'Complete Beginner'
  },
  goal: {
    type: String,
    enum: ['Get a Job', 'Freelancing', 'Build Projects', 'Learn for Fun'],
    default: 'Learn for Fun'
  },
  studyHours: {
    type: String,
    enum: ['30 mins', '1 hour', '2 hours', '3+ hours'],
    default: '1 hour'
  },
  onboardingCompleted: { type: Boolean, default: false },
  onboardingCompletedAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('UserLearningProfile', userLearningProfileSchema);
