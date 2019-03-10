const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let FilterOccupationSchema = new Schema({
    //id: {type: Number, autoIncrement: true , },
   
    name: {type: String, required: true},
    des: {type: String}
    
});

module.exports = mongoose.model('filterOccupation', FilterOccupationSchema);