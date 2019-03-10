const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let adPricetierSchema = new Schema({
    ad_type:{type: Number , required:true},
    name:{type:String},
    min_amt:{type:Number , required: true},
    min_second:{type:Number },
    ext_amt:{type:Number},
    review_amt:{type: Number},
    onhold_pday:{type: Number},
    cupdate:{type:Date}
});
//adpricetiers
module.exports = mongoose.model('AdPriceTier', adPricetierSchema);