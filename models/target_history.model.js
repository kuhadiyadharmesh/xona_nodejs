const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Target_History_Schema = new Schema({
    
    nuser_id :{type:Schema.Types.ObjectId,ref: 'nuser'},
    achive_target :{type : Number},
    total_ads :{type : Number},
    total_viewed_ads : {type : Number},
    is_temp_paid : {type : Boolean},
    is_final_paid:{type : Boolean},
    target_date : {type : String},
    cdate:{type: Date}
});

module.exports = mongoose.model('tbl_nuser_targethistory', Target_History_Schema);