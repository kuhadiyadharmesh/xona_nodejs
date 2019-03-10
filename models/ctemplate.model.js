const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let FilterTemplateSchema = new Schema({
    //id: {type: Number, autoIncrement: true , },
   /*
   {
    "id": "<selected templateId",
    "logo": "<image upload>",
    "image": "<image upload>",
    "title": "<title>",
    "btnTxt": "<text>",
    "desc": "<desc>"
  }

    */
    details_ad_id:{type: Schema.Types.ObjectId,required: true,ref: 'AdDetail'},
    template_id :{type: Schema.Types.ObjectId,required: true,ref: 'Template'},
    //name: {type: String, required: true},
    tmp_icon:{type: String, required: true},
    tmp_image:{type: String, required: true},
    title:{type:String , required: true},
    btntitle: {type: String, required: true},
    desc:{type: String},
    cdate:{type: Date},
    udate:{type: Date}
    
});

module.exports = mongoose.model('CTemplate', FilterTemplateSchema);