const mongoose = require('mongoose');
const Schema = mongoose.Schema;
  
let NotificationSchema = new Schema({
    //id: {type: Number, autoIncrement: true , },
   
    user_id:{type: Schema.Types.ObjectId,required: true},
    user_type :{type : Number},// 1 for advertiser , 2 for end user
    noti_type: {type: Number},// 1 for broadcast // 2 for transaction
    noti_title: {type: String , required: true},
    noti_desc:{type: String},
    is_read :{type : Boolean},
    cdate:{type : Date},
    udate :{type :Date},
});


// Export the model
module.exports = mongoose.model('tbl_notification', NotificationSchema);