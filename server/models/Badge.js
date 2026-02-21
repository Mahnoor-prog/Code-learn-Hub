import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '🏆'
  },
  criteria: {
    type: {
      type: String,
      enum: ['lessons_completed', 'streak', 'points', 'modules_completed', 'perfect_score'],
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  },
  pointsReward: {
    type: Number,
    default: 100
  }
}, {
  timestamps: true
});

export default mongoose.model('Badge', badgeSchema);


