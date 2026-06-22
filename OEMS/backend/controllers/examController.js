const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');

const recalculateTotalMarks = async (examId) => {
  const questions = await Question.find({ examId });
  const totalMarks = questions.reduce((sum, question) => sum + question.marks, 0);
  await Exam.findByIdAndUpdate(examId, { totalMarks });
  return totalMarks;
};

const availableExams = async (req, res) => {
  const exams = await Exam.find({ isActive: true }).populate('createdBy', 'name').sort({ createdAt: -1 });
  res.json(exams);
};

const getExam = async (req, res) => {
  const exam = await Exam.findById(req.params.id).populate('createdBy', 'name');
  if (!exam) return res.status(404).json({ message: 'Exam not found' });

  const query = Question.find({ examId: exam._id });
  const questions = req.user.role === 'student' ? await query.select('-correctOptionIndex') : await query;
  res.json({ exam, questions });
};

const createExam = async (req, res) => {
  const { title, description, subject, durationMinutes, isActive } = req.body;
  const exam = await Exam.create({
    title,
    description,
    subject,
    durationMinutes,
    isActive,
    createdBy: req.user._id
  });
  res.status(201).json(exam);
};

const updateExam = async (req, res) => {
  const exam = await Exam.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!exam) return res.status(404).json({ message: 'Exam not found' });
  res.json(exam);
};

const deleteExam = async (req, res) => {
  const exam = await Exam.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
  if (!exam) return res.status(404).json({ message: 'Exam not found' });
  await Question.deleteMany({ examId: exam._id });
  await Attempt.deleteMany({ examId: exam._id });
  res.json({ message: 'Exam deleted' });
};

const myExams = async (req, res) => {
  const exams = await Exam.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
  res.json(exams);
};

const addQuestion = async (req, res) => {
  const exam = await Exam.findOne({ _id: req.params.id, createdBy: req.user._id });
  if (!exam) return res.status(404).json({ message: 'Exam not found' });

  const question = await Question.create({ ...req.body, examId: exam._id });
  await recalculateTotalMarks(exam._id);
  res.status(201).json(question);
};

const updateQuestion = async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (!question) return res.status(404).json({ message: 'Question not found' });

  const exam = await Exam.findOne({ _id: question.examId, createdBy: req.user._id });
  if (!exam) return res.status(403).json({ message: 'Access denied' });

  Object.assign(question, req.body);
  await question.save();
  await recalculateTotalMarks(question.examId);
  res.json(question);
};

const deleteQuestion = async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (!question) return res.status(404).json({ message: 'Question not found' });

  const exam = await Exam.findOne({ _id: question.examId, createdBy: req.user._id });
  if (!exam) return res.status(403).json({ message: 'Access denied' });

  await question.deleteOne();
  await recalculateTotalMarks(question.examId);
  res.json({ message: 'Question deleted' });
};

const submitExam = async (req, res) => {
  const exam = await Exam.findOne({ _id: req.params.id, isActive: true });
  if (!exam) return res.status(404).json({ message: 'Active exam not found' });

  const questions = await Question.find({ examId: exam._id });
  const answerMap = new Map((req.body.answers || []).map((a) => [String(a.questionId), Number(a.selectedOptionIndex)]));
  let score = 0;
  let totalMarks = 0;

  questions.forEach((question) => {
    totalMarks += question.marks;
    if (answerMap.get(String(question._id)) === question.correctOptionIndex) {
      score += question.marks;
    }
  });

  const attempt = await Attempt.create({
    studentId: req.user._id,
    examId: exam._id,
    answers: req.body.answers || [],
    score,
    totalMarks
  });

  res.status(201).json({
    attemptId: attempt._id,
    score,
    totalMarks,
    status: score >= totalMarks / 2 ? 'Passed' : 'Needs Improvement'
  });
};

const examResults = async (req, res) => {
  const exam = await Exam.findOne({ _id: req.params.id, createdBy: req.user._id });
  if (!exam) return res.status(404).json({ message: 'Exam not found' });

  const attempts = await Attempt.find({ examId: exam._id })
    .populate('studentId', 'name email')
    .sort({ submittedAt: -1 });
  res.json(attempts);
};

module.exports = {
  availableExams,
  getExam,
  createExam,
  updateExam,
  deleteExam,
  myExams,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  submitExam,
  examResults
};
