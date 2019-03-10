const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SystemReferralSchema = new Schema({
    //id: {type: Number, autoIncrement: true , },
    level_type : {type: Number},
    level_value : {type : Number},
    level_name :  {type: String},
    udate : {type : Date}
});


// Export the model
module.exports = mongoose.model('referral_system', SystemReferralSchema);