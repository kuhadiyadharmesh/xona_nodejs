const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let TransactionSchema = new Schema({
    //id: {type: Number, autoIncrement: true , },
   
    user_id :{type: Schema.Types.ObjectId,required: true,ref: 'auser'},
    advertise_id : {type: Schema.Types.ObjectId,ref: 'AdMaster'},
    wallet_id :{type: Schema.Types.ObjectId,ref: 'walletid'},
    service_provider:{type : Number},// 1 for payumoney // 2 for paypal // 3 for ccavenue
    order_id : {type:String ,unique:true},// txt id 
    service_provider_data:{type : JSON},
    amt_topaid :{type: Number},
    provider_status:{type :Number},
    credit_status:{type:Boolean},
    /* 
    provider_d1:{type : String},
    provider_d2:{type : String},
    provider_d3:{type : String},
    provider_d4:{type : String},
    provider_d5:{type : String},*/
     // 1 initiated // 2 for created // 3 for pending //4 for completed //5 for faild 
   // provider_status1:{type : Number}, // will think 
    provider_payload : {type: JSON},
    create_date :{type : Date},
    update_date :{type : Date} 
    
});


// Export the model
module.exports = mongoose.model('ATransactionDetail', TransactionSchema);