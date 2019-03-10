const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let StateSchema = new Schema({
    //id: {type: Number, autoIncrement: true , },
    country_id:  {type: Schema.Types.ObjectId ,required: true,ref: 'Country'},
    name: {type: String, required: true,unique : true}
});


// Export the model
module.exports = mongoose.model('State', StateSchema);