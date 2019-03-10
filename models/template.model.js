const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let FilterTemplateSchema = new Schema({
    //id: {type: Number, autoIncrement: true , },
   
    name: {type: String, required: true},
    img:{type:String , required: true},
    type:{type:Number,required:true},// 1 for small , 2 for half , 3 for fullscreen
    is_active:{type:Boolean},
    des: {type: String},
    cdate:{type: Date},
    udate:{type: Date}
    
});

module.exports = mongoose.model('Template', FilterTemplateSchema);