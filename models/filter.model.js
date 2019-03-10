const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let FilterSchema = new Schema({
    //id: {type: Number, autoIncrement: true , },
   /*
 "gender": "<both / male / female>",
    "age": "<[ids]>",
    "interest": "<[ids]>",
    "relationship": "<[ids]>",
    "familyMember": "<[ids]>",
    "occupation": "<[ids]>",
    "income": "<[ids]>",
    "education": "<[ids]>",
    "religion": "<[ids]>",
    "state": "<[ids]>",
    "country": "<[ids]>",
    "city": "<[ids]>",
    "pincode": "<[ids]>"

   */
    details_ad_id: {type: Schema.Types.ObjectId,required: true,ref: 'AdDetail'},
    gender:{type:String},
    interest_ids:{type: String},
    relation_ids:{type:String},
    familym_ids:{type:String},
    occupation_ids:{type:String},
    income_ids:{type:String},
    education_ids:{type:String},
    religion_ids:{type:String},
    state_ids:{type:String},
    country_ids:{type:String},
    city_ids:{type:String},
    pincode_ids:{type:String},
    cdate:{type:Date},
    udate:{type:Date}
    
});

module.exports = mongoose.model('filter', FilterSchema);