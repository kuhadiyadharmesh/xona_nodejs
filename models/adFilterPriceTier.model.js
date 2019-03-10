const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let FilterPricetierSchema = new Schema({
    filter_type:{type: Number , required:true},
    name:{type:String},
    filter_amt:{type:Number , required: true},
    free_values:{type:String},
    cupdate:{type:Date}
});
//filterpricetiers
module.exports = mongoose.model('FilterPriceTier', FilterPricetierSchema);