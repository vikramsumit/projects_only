const User = require('../models/User');
const Exam = require('../models/Exam');
const Attempt = require('../models/Attempt');

const getUsers = async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
};

const changeUserRole = async (req, res) => {
  const { role } = req.body;
  if (!['student', 'teacher', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

const getExams = async (req, res) => {
  const exams = await Exam.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
  res.json(exams);
};

const summary = async (req, res) => {
  const [totalUsers, totalExams, totalAttempts, recentSubmissions] = await Promise.all([
    User.countDocuments(),
    Exam.countDocuments(),
    Attempt.countDocuments(),
    Attempt.find()
      .populate('studentId', 'name')
      .populate('examId', 'title')
      .sort({ submittedAt: -1 })
      .limit(5)
  ]);

  res.json({ totalUsers, totalExams, totalAttempts, recentSubmissions });
};

module.exports = { getUsers, changeUserRole, getExams, summary };
