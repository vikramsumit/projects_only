const express = require('express');
const { myResults, getResult } = require('../controllers/resultController');
const { protect, allowRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/my-results', protect, allowRoles('student'), myResults);
router.get('/:id', protect, allowRoles('student'), getResult);

module.exports = router;
