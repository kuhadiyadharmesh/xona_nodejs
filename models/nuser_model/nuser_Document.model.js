const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userDocumentSchema = new Schema({
    
    user_id : {type: Schema.Types.ObjectId,required: true,ref: 'nuser'},
    f_adhar:{type : String},
    b_adhar:{type : String},
    pan_card : {type :String},
    f_passport : {type : String},
    b_passport : {type : String},
    f_election : {type: String},
    b_election : {type : String},
    f_licence : {type : String},
    b_licence : {type : String},
    others : {type : JSON},
    create_date : {type :Date},
    update_date :{type : Date}
});


// Export the model
module.exports = mongoose.model('nuser_document', userDocumentSchema);