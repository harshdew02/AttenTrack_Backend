const express = require('express');
const { route } = require('./teacher.routes');
const Class = require('../models/class.model.js');  
const { CreateClass } = require('../controllers/class.controller.js');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('route frome class');
})

router.post('/createClass', CreateClass);

router.delete('/remove/:id', async(req, res) => {
    try {
        const { id } = req.params;

        const deletedClass = await Class.findByIdAndDelete(id);

        if (!deletedClass) {
            return res.status(404).json({ message: 'Class not found' });
        }

        res.status(200).json({ message: 'Class deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

module.exports = router



