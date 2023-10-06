const mongoose = require('mongoose')
const notificationSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    message:{type:String},
    status:{type:String,default:"unread"},
    type:{type:String},
    date:{type:Date, default:Date.now}
})

const notification = mongoose.model('Notification',notificationSchema);
module.exports = notification;