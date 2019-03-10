const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CouponSchema = new Schema({
    //id: {type: Number, autoIncrement: true , },
    ad_types : {type : JSON} ,
    ad_amount :{type: Number},
    ad_amount_type : {type : Number} ,// 1 or -1 (1 for greter , -1 for less)
    filter_amount: {type: Number},
    filter_amount_type: {type: Number}, // 1 or -1 (1 for greter , -1 for less)
    target_user:{type: Number},
    target_user_type : {type: Number}, // 1 or -1 (1 for greter , -1 for less)
    coupon_code:{type: String},
    per_user_limit : {type:Number},
    max_use : {type : Number},
    total_used :{type : Number},
    discount_value : {type : Number},
    discount_type : {type : Number},// 1 for amount , 2 for %
    is_active :{type : Boolean}, // this for delete user
    is_expire :{type : Boolean}, // this for coupon validiti finish.
    cdate:{type: Date},
    udate:{type: Date}
});


// Export the model
module.exports = mongoose.model('coupon', CouponSchema);