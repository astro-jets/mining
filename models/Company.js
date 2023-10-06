// companyModel.js (using Mongoose ODM)

const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  minerals:[{type:String,required:true}],
  status:{type:String,default:"pending"},
  created:{type:Date, default:Date.now}
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
