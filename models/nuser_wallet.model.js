const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let NUserWalletSchema = new Schema({
    user_id :{type: Schema.Types.ObjectId,required: true,ref: 'User'},
    wallet_type:{type:Number,required: true},// 1 for credit 2 for debit
    details_type: {type: Number,required: true},// credit ( 1 for advertise self, 2 for advetise downline, 3 for referel , 4 refund(withdrow reject) , 5 bonus), debit (1 for withdrow)
    advertise_type : {type : Number} ,// ad type 1 for banner , 2 for half banner , 3 for full screen 
    details_id: {type: Schema.Types.ObjectId,ref: 'AdMaster'},// credit (Online table_id , Refund (advertise id ) , debit (advertise id)
    old_point:{type:Number, required:true},
    new_point:{type:Number , required:true},
    point:{type:Number,required:true},
    level_point:{type : Number},
    ispoint_temp :{type : Number},
    status_msg:{type : String},
    cdate:{type: Date}
});
// Export the model
module.exports = mongoose.model('Nuser_wallet', NUserWalletSchema);