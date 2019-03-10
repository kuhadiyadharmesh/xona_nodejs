const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CitySchema = new Schema({
    //id: {type: Number, autoIncrement: true , },
    state_id: {type: Schema.Types.ObjectId,required: true,ref: 'State'},
    name: {type: String, required: true,unique : true}
});


// Export the model
module.exports = mongoose.model('City', CitySchema);