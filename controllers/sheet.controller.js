const Sheet = require("../models/sheet.model.js");

const CreateSheet = async (req, res) => {    
    try {

        const { students } = req.body;

        if (!Array.isArray(students) || students.length === 0) {
            return res.status(400).json({ error: "Students array is required and cannot be empty" });
        }
        const newSheet = new Sheet({ students });


        if(newSheet) {
            await newSheet.save();

            res.status(201).json({
                _id: newSheet._id,
                students: newSheet.students 
            });
        }else{
            return res.status(400).json({ error: "Sheet not created" });
        }
        // res.status(201).json(newSheet);

    }catch (err) {
        console.log("Error in CreateSheet", err.message);
        console.log(err);
        res.status(500).send(err.message);
    }
}


module.exports = {CreateSheet}
    