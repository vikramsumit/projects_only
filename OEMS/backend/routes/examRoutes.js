const express = require('express');
const {
  availableExams,
  getExam,
  createExam,
  updateExam,
  deleteExam,
  myExams,
  addQuestion,
  submitExam,
  examResults
} = require('../controllers/examController');
const { protect, allowRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/available', protect, allowRoles('student'), availableExams);
router.get('/my-exams', protect, allowRoles('teacher'), myExams);
router.post('/', protect, allowRoles('teacher'), createExam);
router.put('/:id', protect, allowRoles('teacher'), updateExam);
router.delete('/:id', protect, allowRoles('teacher'), deleteExam);
router.post('/:id/questions', protect, allowRoles('teacher'), addQuestion);
router.get('/:id/results', protect, allowRoles('teacher'), examResults);
router.get('/:id', protect, allowRoles('student', 'teacher', 'admin'), getExam);
router.post('/:id/submit', protect, allowRoles('student'), submitExam);

module.exports = router;
