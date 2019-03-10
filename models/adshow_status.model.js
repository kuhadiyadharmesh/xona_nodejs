const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let AdShowStatusSchema = new Schema({
    //id: {type: Number, autoIncrement: true , },
   
    adtype_id: {type: String, required: true},
    ad_id: {type: Schema.Types.ObjectId,required: true,ref: 'adMaster'},
    visit_userid:{type: Schema.Types.ObjectId,required: true,ref: 'Nuser'},
    final_status : {type : Number},
    final_second : {type : Number},
    is_paid : {type : Boolean},
    cdate : {type : Date},
    udate : {type : Date}
});

module.exports = mongoose.model('adshowstatus', AdShowStatusSchema);