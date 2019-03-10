const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let CronActivitySchema = new Schema({
    //id: {type: Number, autoIncrement: true , },
   
    record :{type : String},

    count_target_start : {type : Boolean}, 
    count_date_start :{type : Date},
    count_target_end : {type : Boolean}, 
    count_date_end :{type : Date},

    paying_downline_start : {type : Boolean},
    paying_date_start :{type : Date},
    paying_downline_end : {type : Boolean},
    paying_date_end :{type : Date},
    
    advertise_push_live_start : {type : Boolean},
    advertise_push_date_start :{type : Date},
    advertise_push_live_end : {type : Boolean},
    advertise_push_date_end :{type : Date},


    cdate:{type: Date},
    udate:{type: Date}
    
});

module.exports = mongoose.model('tbl_cron_run_status', CronActivitySchema);