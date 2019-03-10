const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/*
this is user for once user A register that time referall point is 500 for USER B
we need to give 500 point to B when Admin approve USER A , no need to take points from pointsystem table
*/
let PublicQuestionsSchema = new Schema({
    //id: {type: Number, autoIncrement: true , },
    details_ad_id : {type: Schema.Types.ObjectId ,required: true,ref: 'addetail'},
    questions_ar :{type:JSON},//[{qus:"",ans1:"",ans2:"",ans3:"",ans4:""},{qus:"",ans1:"",ans2:"",ans3:"",ans4:""}]
    cdate : {type : Date}
});


// Export the model
module.exports = mongoose.model('public_question', PublicQuestionsSchema);