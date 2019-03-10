const mongoose = require('mongoose');
const Schema = mongoose.Schema;
  
let NotificationSchema = new Schema({
    //id: {type: Number, autoIncrement: true , },
   
    admin_id:{type: Schema.Types.ObjectId,required: true},
    user_type :{type : Number},// 1 for advertiser , 2 for end user // 3 for all and multiple
    noti_type: {type: Number},// 1 for broadcast // 2 for transaction
    msg_type : {type : Number}, // 1 for text // 2 for Image
    noti_title: {type: String , required: true},
    noti_ids:{type : JSON},
    noti_desc:{type: String},
    cdate:{type : Date}
});


// Export the model
module.exports = mongoose.model('tbl_lookup_notification', NotificationSchema);