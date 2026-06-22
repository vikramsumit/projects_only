const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  questionText: { type: String, required: true, trim: true },
  options: {
    type: [String],
    validate: {
      validator: (options) => options.length === 4,
      message: 'Exactly four options are required'
    }
  },
  correctOptionIndex: { type: Number, required: true, min: 0, max: 3 },
  marks: { type: Number, default: 1, min: 1 }
});

module.exports = mongoose.model('Question', questionSchema);
