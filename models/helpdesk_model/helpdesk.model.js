const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let AdDetailSchema = new Schema({
    //id: {type: Number, autoIncrement: true , },
   

    
    subject_type: {type: Number}, // 1 , 2 ,3,4,5
    message_type:{type: Number},// 1 for text , 2 for img
    message:{type : String},
    user_type :{type : Number}, // 1 for End user , 2 for Advertiser
    from:{type: Number},// 1 for from user , 2 for admin
    is_read :{type : Boolean},
    user_id:{type: Schema.Types.ObjectId,required: true,ref: 'User'},
    cdate :{type : Date}
});

// Export the model
module.exports = mongoose.model('tbl_helpdesk', AdDetailSchema);