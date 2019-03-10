const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let FilterAgeSchema = new Schema({
    
    user_id: {type: Schema.Types.ObjectId,required: true,ref: 'nuser'},
    user_token : {type : String},
    login_ip : {type : String},
    login_lat : {type : String},
    login_lat : {type : String},
    cdate : {type : Date}
});

module.exports = mongoose.model('tbl_nuserSession', FilterAgeSchema);