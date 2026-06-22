const express = require('express');
const { updateQuestion, deleteQuestion } = require('../controllers/examController');
const { protect, allowRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.put('/:id', protect, allowRoles('teacher'), updateQuestion);
router.delete('/:id', protect, allowRoles('teacher'), deleteQuestion);

module.exports = router;
