const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let AUserWalletSchema = new Schema({
    user_id :{type: Schema.Types.ObjectId,required: true,ref: 'User'},
    wallet_type:{type:Number,required: true},// 1 for credit 2 for debit
    details_type: {type: Number,required: true},// credit ( 1 for online , 2 for delete(refund)) , debit (1 for adpost)
    details_id: {type: Schema.Types.ObjectId,ref: 'AdDetail'},// credit (Online table_id , Refund (advertise id ) , debit (advertise id)
    old_balance:{type:Number, required:true},
    new_balance:{type:Number , required:true},
    amount:{type:Number,required:true},
    status_msg:{type : String},
    cdate:{type: Date}
});


// Export the model
module.exports = mongoose.model('Auser_wallet', AUserWalletSchema);