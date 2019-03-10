const City = require('../models/city.model');
const Pincode = require('../models/pincode.model');
const CommonFile = require('../constant')
const NCommonFile = require('../nconstant')

exports.pincode_create = function (req, res) {
    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {
            res.send({status:0 , msg : err})
        }
        else
        {
    let pincode = new Pincode(
        {
            city_id:req.body.city_id,
            pincode: req.body.pincode 
        }
    );

    City.findOne( {  _id : req.body.city_id }, function(err, object){
        if (object)
        {
            //update
            Pincode.findOne( {  pincode :  req.body.pincode , city_id:req.body.city_id }, function(err, object){
                if (object) {
                    //update
                    res.send({ status : 0 , msg : "pincode already existed."})
                } else {
                    //insert
                    pincode.save(function (err) {
                       // console.log(err);
                        if (err)
                        res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
                        else
                        res.send({ status : 1 , msg : "pincode insert successfully." , data :pincode});
                    })
                }
            });
        }
        else
            res.send({ status : 0 , msg : "city not found."})
    });
}})
};
exports.pincode_details_By_cityId = function (req, res) {
    Pincode.find({  city_id:req.body.city_id }, function (err, pincode) {
        if (err)
        res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
        else
        {
            //console.log(JSON.stringify(country, null, 2));
            //if(JSON.stringify(pincode, null, 2).length > 2)
            res.send({ status : 1 , msg : "pincode listed successfully." , data :pincode});
            //else
            //res.send({ status : 0 , msg : "no city found."});
        }
        
    }).sort( { pincode: 1 } )
};

exports.pincode_update = function (req, res) 
{
    //console.log(JSON.stringify(req.body, null, 2));
    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {
           return res.status(401).send({status:0 , msg : err})
        }
        else
        {
        Pincode.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, pincode) 
        {
            //console.log(state);
            if (err) 
           return res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
            else
           return res.send({ status : 1 , msg : "pincode updated successfully."});
        });
    }})
};
exports.pincode_delete = function (req, res) {
    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {
          return  res.status(401).send({status:0 , msg : err})
        }
        else
        {
        Pincode.findByIdAndRemove(req.params.id, function (err) {
            if (err) 
           return res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
            else
           return res.send({ status : 1 , msg : "pincode deleted successfully."});
        })
    }})
};
exports.getpincode_with_city  = function (req , res)
{
   /* NCommonFile.nuser_check_auth(req.headers.token , (err , value)=>{
        if(err)
        return res.status(401).send({status :0 , msg : err})
        else{*/
            Pincode.findOne({pincode  : req.body.pincode},function(err , pincode_data){
                if(err)
                return res.send({status : 0 , msg : err})
                else
                {
                    if(pincode_data)
                    {
                        res.send({status : 1 , msg :"Location is valid"})
                    }
                    else
                    {
                        res.send({status : 0 , msg : " We are not providing service on your location."})
                    }
                }
            })
           /* Pincode.aggregate([
                { 
                    "$lookup" : {
                        "from" : "cities", 
                        "localField" : "city_id", 
                        "foreignField" : "_id", 
                        "as" : "city"
                    }
                }, 
                { 
                    "$unwind" : {
                        "path" : "$city"
                    }
                }, 
                { 
                    "$project" : {
                        "_id" : 1, 
                        "pincode" : 1, 
                        "city.name" : 1
                    }
                }, 
                { 
                    "$sort" : {
                        "pincode" : 1
                    }
                }
            ],function(err ,result  ){
                if(err)
                {
                    res.send({status : 0 , msg : err})
                }
                else
                {
                    res.send({status : 1 , msg : "list successfully get.",data: result})
                }
            })*/
        //}
   // })
    
}