const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let AdminConfigSchema = new Schema({
    //id: {type: Number, autoIncrement: true , },
    group :{type: Number},
    type: {type: Number},
    name: {type: String},
    tax:{type: String},
    points : {type : Number},
    value:{type: Number},
    value_in : {type : Number} , // 1 for direct , 2 for in percentag
    cdate:{type: Date},
    udate:{type: Date}
});


// Export the model
module.exports = mongoose.model('admin_config', AdminConfigSchema);