const express = require('express');
const { getUsers, changeUserRole, getExams, summary } = require('../controllers/adminController');
const { protect, allowRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, allowRoles('admin'));
router.get('/users', getUsers);
router.patch('/users/:id/role', changeUserRole);
router.get('/exams', getExams);
router.get('/reports/summary', summary);

module.exports = router;
