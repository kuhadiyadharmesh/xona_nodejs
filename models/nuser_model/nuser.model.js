const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    token:{type: String,unique:true},
    myCode:{type: String},
    //show_id : {type : String},
    p_img:{type:String},
    first_name: {type: String,  max: 100},
    last_name: {type: String},
    mobile_number: {type: String, required: true,unique:true} ,
    mobile_second : {type : String},
    email: {type: String},
    date_of_birth: {type: Date},
    add_1 : {type:String},
    add_2 : {type:String},
    
    referral_code: {type: String},
    is_approve:{type : Number},
    is_verify:{type: Boolean},
    is_active :{type : Boolean},
    OTP:{type :String},
    // Filter data
    occcupation_ids :{type : JSON},
    interest_ids :{type : JSON},

    income_ids : {type: Schema.Types.ObjectId,ref: 'INCOME'},
    relationship_ids : {type: Schema.Types.ObjectId,ref: 'relationship'},
    education_ids :{type: Schema.Types.ObjectId,ref: 'education'},
    family_ids :{type: Schema.Types.ObjectId,ref: 'familym'},
    religion_ids : {type: Schema.Types.ObjectId,ref: 'religion'},

    pincode_id: {type: Schema.Types.ObjectId,ref: 'Pincode'},
    city_id: {type: Schema.Types.ObjectId,ref: 'City'},
    state_id: {type: Schema.Types.ObjectId,ref: 'State'},
    country_id:{type: Schema.Types.ObjectId,ref: 'Country'},
    gender: {type: String},
    
    
    // Filter data
    point_balance:{type : Number},
    fcm_token : {type : String},
    
    point_temp_balance : {type : Number} ,
    point_update_date :{type : Date},

    //device_udid : {type : String},

    create_date : {type :Date},
    update_date :{type : Date}
});


// Export the model
module.exports = mongoose.model('nuser', userSchema);