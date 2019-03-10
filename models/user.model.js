const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    token:{type: String,unique:true},
    myCode:{type: String,unique:true},
    p_img:{type:String},
    first_name: {type: String, required: true, max: 100},
    last_name: {type: String, required: true},
    mobile_number: {type: String, required: true,unique:true},
    alternative_mobile_number: {type: String},
    email: {type: String, required: true},
    alternative_email: {type: String},
    date_of_birth: {type: Date},
    marriage_anniversary: {type: Date},
    area: {type: String},
    pincode_id: {type: Schema.Types.ObjectId,required: true,ref: 'Pincode'},
    city_id: {type: Schema.Types.ObjectId,required: true,ref: 'City'},
    state_id: {type: Schema.Types.ObjectId,required: true,ref: 'State'},
    country_id:{type: Schema.Types.ObjectId,required: true,ref: 'Country'},
    gender: {type: String, required: true},
    religion: {type: String},
    reffaral_id: {type: String},
    gst_number: {type: String},
    wallet_balance :{type: Number},
    wallet_last_id : {type:Schema.Types.ObjectId,ref: 'auser_wallet'},
    is_admin_approve:{type : Number},
    is_verify:{type: Boolean},
    is_active :{type : Boolean},
    OTP:{type :String},
    document_address : {type : JSON},
    document_idproff : {type : JSON},
    create_date : {type :Date},
    update_date : {type :Date}
});


// Export the model
module.exports = mongoose.model('auser', userSchema);