const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let FilterIncomeSchema = new Schema({
    //id: {type: Number, autoIncrement: true , },
   
    name: {type: String, required: true},
    des: {type: String}
    
});

module.exports = mongoose.model('filterIncome', FilterIncomeSchema);