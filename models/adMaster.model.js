const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let AdMasterSchema = new Schema({
    //id: {type: Number, autoIncrement: true , },
    advertiser_id :{type: Schema.Types.ObjectId,required: true,ref: 'User'},
    show_id : {type : String},
    adName : {type : String},
    adtype_id: {type: String,required: true},
    details_id: {type: Schema.Types.ObjectId,required: true,ref: 'AdDetail'},
    is_active:{type: Boolean},
    is_approve:{type: Number},
    points : {type : Number},
    is_status:{type:Number},// 0 for "under publish" //1 for "running" // 2 for "paused" // 3 for "close"
    final_amount:{type:Number},
    final_tax_amount:{type:Number},
    final_filter_amount:{type:Number},
    final_sec:{type : Number},
    tax_rate :{type : JSON},
    totaluser_for_ads:{type:Number},
    totaluser_visitor:{type : Number},
    is_coupon :{type : Boolean},
    coupon_code:{type:String},
    coupon_amt:{type:Number},
    mobile_number:{type : String},
    wmobile_number:{type : String},
    location_link:{type : String},
    pay_status:{type:Number},// 0 for not charged(- from wallet) // 1 for charged // 2 for refund(+ to wallet)
    pay_from:{type:Number}, // 0 for wallet // 1 for online // 2 for partial( some from wallet & some from partial) 
    status_msg:{type : String},
    adate:{type : Date},
    cdate:{type: Date},
    udate:{type: Date}
});


// Export the model
module.exports = mongoose.model('AdMaster', AdMasterSchema);