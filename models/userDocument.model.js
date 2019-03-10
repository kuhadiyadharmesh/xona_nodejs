const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let FilterDocumentSchema = new Schema({
    //id: {type: Number, autoIncrement: true , },
   
    user_id:{type: Schema.Types.ObjectId,required: true,ref: 'User'},
    name: {type: String, required: true},
    img:{type:String , required: true},
    is_active:{type:Boolean},
    is_approve:{type:Boolean},
    des: {type: String},
    cdate:{type: Date},
    udate:{type: Date}
    
});

module.exports = mongoose.model('UserDocument', FilterDocumentSchema);