const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/*
this is user for once user A register that time referall point is 500 for USER B
we need to give 500 point to B when Admin approve USER A , no need to take points from pointsystem table
*/
let Bank_Details_Schema = new Schema({
    //id: {type: Number, autoIncrement: true , },
    nuser_id : {type: Schema.Types.ObjectId ,required: true,ref: 'nuser'},
    holder_name : {type : String},
    account_number : {type : String},
    bank_ifsc : {type : String},
    bank_branch_name : {type : String},
    bank_name : {type: String},
    account_type : {type : Number},
    cdate : {type : Date},
    udate : {type : Date}
});
// Export the model
module.exports = mongoose.model('nuser_bankdetails', Bank_Details_Schema);