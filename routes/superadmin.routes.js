const express = require('express');
const { AddTeacheronBulk, AddTeacher } = require('../controllers/superadmin.controller');
const router = express.Router();

// done start
router.post('/add-teacher', AddTeacher);
router.post('/add-teachers', AddTeacheronBulk);
// done end

module.exports = router