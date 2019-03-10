const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*{
    "adName": "<name>",
    "type": "<individual / company>",
    "yourName": "<name>",
    "template": {
      "id": "<selected templateId",
      "logo": "<image upload>",
      "image": "<image upload>",
      "title": "<title>",
      "btnTxt": "<text>",
      "desc": "<desc>"
    },
    "bannerLink": "<link>",
    "comments": "<comments>",
    "filters": {
      "gender": "<both / male / female>",
      "age": "<[ids]>",
      "interest": "<[ids]>",
      "relationship": "<[ids]>",
      "familyMember": "<[ids]>",
      "ocupation": "<[ids]>",
      "income": "<[ids]>",
      "education": "<[ids]>",
      "religion": "<[ids]>",
      "state": "<[ids]>",
      "country": "<[ids]>",
      "city": "<[ids]>",
      "pincode": "<[ids]>"
    },
    "users": "<no of users>",
    "calculations": {
      "ads": "",
      "filters": "",
      "taxes": "",
      "totalPerUser": "",
      "total": ""
    }
}*/
  
let AdDetailSchema = new Schema({
    //id: {type: Number, autoIncrement: true , },
   
    adName: {type: String, required: true},
    type: {type: Number},
    yourName:{type: String},
    appName:{type : String},
    template:{type: JSON},// json
    questions:{type : JSON},
    fullbanner_link:{type: String},
    custom_link:{type: String},
    bannerLink:{type: String},
    short_desc :{type : String},
    desc : {type : String},
    pkg_name : {type : String},
    comments:{type: String},
    hold_days:{type : Number},
    hold_comment:{type : String},
    review_days :{type : Number},
    review_comment:{type : String},
    review_templates : {type : JSON},
    filters:{type:JSON},/// json
    users:{type:Number},
    calculations:{type: JSON}
});


// Export the model
module.exports = mongoose.model('AdDetail', AdDetailSchema);