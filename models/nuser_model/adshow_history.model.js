const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/*
this is user for once user A register that time referall point is 500 for USER B
we need to give 500 point to B when Admin approve USER A , no need to take points from pointsystem table
*/
let Adshow_historySchema = new Schema({
    //id: {type: Number, autoIncrement: true , },
    nuser_id : {type: Schema.Types.ObjectId ,required: true,ref: 'nuser'},
    advertise_id : {type: Schema.Types.ObjectId ,required: true,ref: 'adMaster'},
    points :  {type: Number},
    is_status : {type : Number},// status of advertise view (0 for not done , 1 for done , 2 for hold , 3 for review  )
    is_paid : {type : Boolean},// this is for self earning 
    is_team_paid : {type : Boolean},// this is for team earnining paid or not 
    team_id_to_paid :{type : JSON},
    team_id_to_unpaid : {type : JSON},
    cdate : {type : Date},
    udate : {type : Date}
});
// Export the model
module.exports = mongoose.model('adshow_history', Adshow_historySchema);