const Document = require('../models/userDocument.model');
const User = require('../models/user.model');


//exports.advertise_create = function
exports.document_create = function (req, res)
 {
     var currentDate = new Date();
   if(req.headers.token != "")
    {
        var currentDate = new Date();
        User.findOne( {  token :  req.headers.token }, function(err, user)
        {
            if (user) 
            {
                let userDocument = new Document(
                    {
                        user_id : user._id,
                        name: req.body.name,
                        img:req.body.img,
                        is_active:true,
                        is_approve:false,
                        des: req.body.des,
                        cdate:currentDate,
                        udate:currentDate
                        
                    }
                );
                
                userDocument.save(function(err)
                    {
                        if(err)
                        res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
                        else
                        {
                        res.send(JSON.stringify({ status : 1 , msg : "your document insert successfully.", data :userDocument}));   
                        }
                    })
                //res.send(JSON.stringify({ status : 1 , msg : "advertise insert successfully.", data :user}));
                //update
                /*
                user.save(function (err) {
                    // console.log(err);
                     if (err)
                     res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
                     else
                     res.send(JSON.stringify({ status : 1 , msg : "account create successfully , please verify mobile number ." , data :({mobile_number:user.mobile_number,OTP:user.OTP})}));
                 })*/
            } 
            else 
            {
                //insert
                
                res.send(JSON.stringify({ status : 0 , msg : "user not existed."}))
            }
        });
    }
    else
    {
        res.send(JSON.stringify({ status : 0 , msg : "authentication failed."}))
    }
    /*
    addetails.save(function(err)
    {
        if(err)
        res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
        else
        {   
            let admaster = new adMaster(
                {
                    advertiser_id :addetails._id,
                    adtype_id: req.body.adtype_id,
                    details_id: {type: String,required: true},
                    is_active:{type: Boolean},
                    is_approve:{type: Boolean},
                    cdate:{type: Date},
                    udate:{type: Date}
                }
            );

            res.send(JSON.stringify({ status : 1 , msg : "advertise insert successfully.",id : addetails._id , data :addetails}));
            
        }
    })
    */

/*
    State.findOne( {  _id : req.body.state_id }, function(err, object){
        if (object)
        {
            //update
            City.findOne( {  name :  req.body.name , state_id:req.body.state_id }, function(err, object){
                if (object) {
                    //update
                    res.send(JSON.stringify({ status : 0 , msg : "city already existed."}))
                } else {
                    //insert
                    city.save(function (err) {
                       // console.log(err);
                        if (err)
                        res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
                        else
                        res.send(JSON.stringify({ status : 1 , msg : "city insert successfully." , data :city}));
                    })
                }
            });
        }
        else
            res.send(JSON.stringify({ status : 0 , msg : "state not found."}))
    });*/
};