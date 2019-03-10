const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let InquirySchema = new Schema({
    //id: {type: Number, autoIncrement: true , },
   
    full_name: {type: String, required: true},
    last_name: {type: String, required: true},
    phone_numner: {type: String, required: true},
    email : {type: String, required: true},
    subject: {type: String, required: true},
    message: {type: String}
});

module.exports = mongoose.model('tbl_public_inquiry', InquirySchema);