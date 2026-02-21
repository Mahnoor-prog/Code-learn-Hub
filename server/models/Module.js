import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    required: true,
    enum: ['Python', 'C++', 'C#', 'Java', 'React']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  icon: {
    type: String,
    default: '📚'
  },
  lessons: [{
    title: String,
    content: String,
    videoUrl: String, 
    examples: [String],
    order: Number
  }],
  quiz: [{
    question: String,
    options: [String],
    correctAnswer: Number,
    explanation: String,
    order: Number
  }],
  totalLessons: {
    type: Number,
    default: 0
  },
  estimatedHours: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Module', moduleSchema);


