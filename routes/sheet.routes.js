const express = require('express');
const { route } = require('./sheet.routes.js');
const { CreateSheet } = require('../controllers/sheet.controller.js');
// const { CreateClass } = require('../controllers/sheet.controller.js');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('route frome Sheet');
})

router.post('/createSheet', CreateSheet );


module.exports = router