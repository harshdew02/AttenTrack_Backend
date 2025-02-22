const express = require('express');
const { route } = require('./teacher.routes');
const Class = require('../models/class.model.js');  
const { CreateClass , GetList, DeletClass} = require('../controllers/class.controller.js');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('route frome class');
})

// done start
router.post('/create-class', CreateClass); // done
router.delete('/remove/:classId', DeletClass); //done
router.get('/getList/:class_id', GetList); //done
//  done end

module.exports = router



