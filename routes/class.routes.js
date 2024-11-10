const express = require('express');
const { route } = require('./teacher.routes');
const { CreateClass } = require('../controllers/class.controller.js');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('route frome class');
})

router.post('/createClass', CreateClass );


module.exports = router





