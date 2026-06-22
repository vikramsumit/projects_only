const Attempt = require('../models/Attempt');

const myResults = async (req, res) => {
  const results = await Attempt.find({ studentId: req.user._id })
    .populate('examId', 'title subject totalMarks')
    .sort({ submittedAt: -1 });
  res.json(results);
};

const getResult = async (req, res) => {
  const result = await Attempt.findOne({ _id: req.params.id, studentId: req.user._id })
    .populate('examId', 'title subject')
    .populate('answers.questionId', 'questionText options');
  if (!result) return res.status(404).json({ message: 'Result not found' });
  res.json(result);
};

module.exports = { myResults, getResult };
