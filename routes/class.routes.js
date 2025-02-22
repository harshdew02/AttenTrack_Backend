const express = require('express');
const { route } = require('./teacher.routes');
const Class = require('../models/class.model.js');  
const { CreateClass , GetList, DeletClass} = require('../controllers/class.controller.js');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('route frome class');
})

router.post('/create-class', CreateClass);

router.delete('/remove/:classId', DeletClass);

router.get('/getList/:class_id', GetList);

module.exports = router



