const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let FilterRelationshipSchema = new Schema({
    //id: {type: Number, autoIncrement: true , },
   
    type : {type : Number},// 1 for welcome , like that 
    name: {type: String, required: true},
    points : {type : Number},
    notify : {type : Boolean},
    target : {type : Number},
    des: {type: String}
    
});

module.exports = mongoose.model('pointsystem', FilterRelationshipSchema);