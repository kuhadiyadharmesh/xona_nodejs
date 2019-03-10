const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Withdraw_RequestSchema = new Schema({
    //id: {type: Number, autoIncrement: true , },
   
    show_id:{type : String},
    user_id:{type: Schema.Types.ObjectId,required: true,ref: 'User'},
    admin_id:{type: Schema.Types.ObjectId,ref: 'Admin'},

    points_to_withdraw :{type : Number},
    money_to_withdraw :{type : Number},
    transaction_charge :{type : Number},
    fmoney_to_withdraw :{type : Number},
    money_to_charge :{type : Number},

    is_autoapprove : {type : Boolean},// if auto approve 

    transaction_type : {type : Number},// 1 for bank , 2 for paytm
    paytm_number : {type : String},
    mobile_number_paytm : {type : String } ,

    is_automatic :{type : Boolean},
    is_status:{type:Number}, // 0 incomplete , 1 complete ,  2 reject
    is_approve:{type:Number}, // //0 waiting_for_approval , 1 waiting  , 2 transferd //0 waiting_for_approval , 1 approve , 2 pending ,3 transferd
    is_pay_process :{type : Number},// 0 waiting for process , 1 under for process , 2 process finish
    is_refund :{type : Boolean}, 

    transaction_reference : {type : String},

    des: {type: String},
    cdate:{type: Date},
    udate:{type: Date}
    
});

module.exports = mongoose.model('tbl_withdraw_request', Withdraw_RequestSchema);

/* ------------withdraw validation--------------------
point to money
profile 100%
bank details or paytm
enough points
minim amount
max amount

*/

/*
auto-withdraw cron job
*/

