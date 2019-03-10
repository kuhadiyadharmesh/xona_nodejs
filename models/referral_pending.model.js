const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/*
this is user for once user A register that time referall point is 500 for USER B
we need to give 500 point to B when Admin approve USER A , no need to take points from pointsystem table
*/
let PendingReferralSchema = new Schema({
    //id: {type: Number, autoIncrement: true , },
    user_id : {type: Schema.Types.ObjectId ,required: true,ref: 'nuser'},
    referral_code : {type : String},
    points :  {type: Number},
    is_paid : {type : Boolean},
    cdate : {type : Date}
});


// Export the model
module.exports = mongoose.model('referral_pending', PendingReferralSchema);