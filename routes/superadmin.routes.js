const express = require('express');
const { AddTeacheronBulk, AddTeacher } = require('../controllers/superadmin.controller');
const router = express.Router();



router.post('/add-teacher', AddTeacher);
router.post('/add-teachers', AddTeacheronBulk);


module.exports = router