const mongoose = require("mongoose");

//define User or Author schema
const adminSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
       // required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    profileImageUrl: {
        type: String,
    }
}, { "strict": "throw" })


//create model for user author schema
const Admin = mongoose.model('admin', adminSchema)

//export
module.exports = Admin;