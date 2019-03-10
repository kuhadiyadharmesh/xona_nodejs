const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CountrySchema = new Schema({
    name: {type: String, required: true,unique: true}
});


// Export the model
module.exports = mongoose.model('Country', CountrySchema);