const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PincodeSchema = new Schema({
    //id: {type: Number, autoIncrement: true , },
    city_id:  {type: Schema.Types.ObjectId,required: true,ref: 'City'},
    pincode: {type: String, required: true,unique : true}
});


// Export the model
module.exports = mongoose.model('Pincode', PincodeSchema);