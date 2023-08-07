const mongoose = require('mongoose')
const messageSchema = new mongoose.Schema({
    email:{
        type: String
    },
    thread:[{
        type:Object
    }]
})

const message = mongoose.model('Message',messageSchema);
module.exports = message;