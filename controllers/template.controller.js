const Template = require('../models/template.model');
const CommonFile = require('../constant')

exports.template_create = function (req, res) {

    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {
           return res.status(401).send(JSON.stringify({ status : 0 , msg :  err}));
        }
        else
        {
            var currentDate = new Date();
        let template = new Template(
            {
                name: req.body.name,
                img:req.body.img,
                is_active:true,
                type:req.body.type,
                des: req.body.des,
                cdate:currentDate,
                udate:currentDate
                
            }
        );

        template.save(function (err) {
            // console.log(err);
            if (err)
           return res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
            else
           return res.send(JSON.stringify({ status : 1 , msg : "template insert successfully." , data :template}));
        })
        }
    })
    

};
exports.template_all = function (req, res) {
    Template.find({ is_active : true , type : req.body.type}, function (err, template) {
        if (err)
           return res.status(401).send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
        else
        {
            //console.log(JSON.stringify(country, null, 2));
            if(JSON.stringify(template, null, 2).length > 2)
           return res.send(JSON.stringify({ status : 1 , msg : "template  listed successfully." , data :template}));
            else
           return res.send(JSON.stringify({ status : 0 , msg : "no template found."}));
        }
        
    })
};
/*
exports.pincode_details_By_cityId = function (req, res) {
    Pincode.find({  city_id:req.body.city_id }, function (err, pincode) {
        if (err)
        res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
        else
        {
            //console.log(JSON.stringify(country, null, 2));
            if(JSON.stringify(pincode, null, 2).length > 2)
            res.send(JSON.stringify({ status : 1 , msg : "pincode listed successfully." , data :pincode}));
            else
            res.send(JSON.stringify({ status : 0 , msg : "no city found."}));
        }
        
    })
};

exports.pincode_update = function (req, res) 
{
    //console.log(JSON.stringify(req.body, null, 2));
    Pincode.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, pincode) 
    {
        //console.log(state);
        if (err) 
        res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
        else
        res.send(JSON.stringify({ status : 1 , msg : "pincode updated successfully."}));
    });
};
*/
exports.template_delete = function (req, res) {
    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {
           return res.status(401).send({status:0 , msg : err})
        }
        else
        {
        Template.findByIdAndUpdate(req.params.id, {$set: {is_active:false}}, function (err, template){
            if (err) 
           return res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
            else
           return res.send(JSON.stringify({ status : 1 , msg : "template deleted successfully."}));
        })
    }})
};