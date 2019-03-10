const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let AdminSchema = new Schema({
    //id: {type: Number, autoIncrement: true , },
   
    first_name : {type : String},
    last_name  : {type : String},
    Role : {type : String},
    name: {type: String, required: true},
    password: {type: String, required: true},
    token:{type : String , required : true , unique : true}
});

module.exports = mongoose.model('admin', AdminSchema);