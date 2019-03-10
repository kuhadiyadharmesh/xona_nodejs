const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let FilterAgeSchema = new Schema({
    //id: {type: Number, autoIncrement: true , },
   
    name: {type: String, required: true},
    min: {type: Number, required: true},
    max:{type: Number, required: true}
});

module.exports = mongoose.model('filterAge', FilterAgeSchema);