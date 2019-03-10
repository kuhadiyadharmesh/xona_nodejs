const User = require('../models/user.model');
var uniqid = require('uniqid');
var CommonFile = require('../constant.js');
ObjectId = require('mongodb').ObjectID;
//const registration_token = {"registration_tokken":"SFDo7NKfyRegFHvaopoG"};
/*
function check_auth(token1)
{
    User.findOne( {  token :  token1 }, function(err, user){
        if (user)
        {
            //update
            console.log(user);
            return user ;
           // res.send(JSON.stringify({ status : 1 , msg : "user profile.",data:user}))

        } else {
           // return res.status(400).send(JSON.stringify({ status : 0 , msg : "Authorization failed."}))
            return false ;
        }
    });
}
*/
exports.user_create = function (req, res) {

    //console.log(req.body);
    var currentDate = new Date();
    let user = new User(
        {
            token:uniqid('tok-au-'),
            myCode:Math.floor(100000000 + Math.random() * 900000000),
            p_img:req.body.p_img,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            mobile_number: req.body.mobile_number,
            alternative_mobile_number: req.body.alternative_mobile_number,
            email: req.body.email,
            alternative_email: req.body.alternative_email,
            date_of_birth: req.body.date_of_birth,
            marriage_anniversary: req.body.marriage_anniversary,
            area: req.body.area,
            pincode_id: req.body.pincode_id,
            city_id: req.body.city_id,
            state_id: req.body.state_id,
            country_id: req.body.country_id,
            gender: req.body.gender,
            religion: req.body.religion,
            reffaral_id: req.body.reffaral_id,
            gst_number: req.body.gst_number,
            wallet_balance : 0,
            is_admin_approve : 0 ,
            is_verify : false ,
            is_active : true ,
            OTP:Math.floor(100000 + Math.random() * 900000),
            create_date: currentDate 
        }
    );
    if(req.headers.token == "register_tok")
    {
        User.findOne( {  mobile_number :  req.body.mobile_number }, function(err, object)
        {
            if (object) 
            {
                //update
               return res.send(JSON.stringify({ status : 0 , msg : "user already existed."}))
            } 
            else
             {
                //insert
                CommonFile.send_otp(req.body.mobile_number,user.OTP ,(err , notp)=>{
                    if(err){console.log(err) 
                      return  res.send(JSON.stringify({ status : 0 , msg : err})); }
                    else
                    {
                        user.save(function (err) {
                            // console.log(err);
                             if (err)
                           return  res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
                             else
                           return  res.send(JSON.stringify({ status : 1 , msg : "account create successfully , please verify mobile number ." , data :({mobile_number:user.mobile_number,OTP:user.OTP})}));
                         })
                    }
                })
                
            }
        });
    }
    else
    {
       return res.send(JSON.stringify({ status : 0 , msg : "Register authentication failed."}))
    }
};
exports.user_send_otp = function (req, res) {

    User.findOne( {  mobile_number :  req.body.mobile_number }, function(err, user){
        if (user) 
        {
            //update  Math.floor(100000 + Math.random() * 900000)
            //var otp = Math.floor(100000 + Math.random() * 900000);
            //user.OTP = otp;
            if(user.is_admin_approve == 2 || user.is_admin_approve == 3)
            {
                let msssg = "Please contact Xona support , Because your account is "+user.is_admin_approve == 2 ?"Rejected." : "Blocked."
                return res.send({status : 0 , msg : msssg})
            }
            CommonFile.send_otp(user.mobile_number , "" , (err , otp)=>
            {
                if(err)
                {
                    res.send({ status : 0 , msg : "something gone wrong." , err : err});
                }
                else
                {
                    
                    user.OTP = otp
                    User.findByIdAndUpdate(user.id, {$set: user}, function (err, user)
                    {
                                if (err) 
                                res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
                                else
                                res.send(JSON.stringify({ status : 1 , msg : "OTP Sent on your registered mobile number." , OTP :otp}));//res.send(JSON.stringify({ status : 1 , msg : "OTP Sent on your resgistered mobile number." , data :user}));
                    });
                }
            })
            //res.send(JSON.stringify({ status : 0 , msg : "user already existed."}))
        } else {
            //insert
            res.send(JSON.stringify({ status : 0 , msg : "user not existed , please register first."}))
        }
    });
};

exports.user_verify_otp = function (req, res) {

    User.findOne( {  mobile_number :  req.body.mobile_number , is_active : true }, function(err, user){
        if (user) 
        {
            var currentDate = new Date();
            let timestemp = (new Date().getTime())
            let new_token = uniqid('tok-au-')+''+timestemp
            if(req.body.OTP == user.OTP)
            {
                //user.is_verify = true;
                User.findByIdAndUpdate(user.id, {$set: {is_verify : true , token : new_token , update_date : currentDate}}, function (err, user)
                {
                            if (err) 
                            res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
                            else
                            res.send({ status : 1 , msg : "Verify OTP and Login Successfully." , token :new_token , user_type : 1});
                });
            }
            else
            {
                res.send(JSON.stringify({ status : 0 , msg : "OTP doesn't match , please retry."}))
            }
        } else {
            //insert
            res.send(JSON.stringify({ status : 0 , msg : "user not existed or contact admin ."}))
        }
    });
};

exports.getuser_profile = function(req , res)
{
    //let type = 1
    //if()
    if(req.body.type == 2)
    {
        let advertiser_id = req.body.advertiser_id;
        console.log(req.headers.token)
        console.log(req.body)
        CommonFile.admin_auth(req.headers.token , (err , value)=>
        {
            if (err)
            {
                //update
                res.status(401).send({ status : 0 , msg : err})
            } else {
                //return 
                User.aggregate([
                    { 
                        "$match" : {
                            "_id" : new ObjectId(advertiser_id)
                        }
                    },
                    { 
                        "$lookup" : {
                            "from" : "countries", 
                            "localField" : "country_id", 
                            "foreignField" : "_id", 
                            "as" : "country"
                        }
                    }, 
                    { 
                        "$lookup" : {
                            "from" : "states", 
                            "localField" : "state_id", 
                            "foreignField" : "_id", 
                            "as" : "state"
                        }
                    }, 
                    { 
                        "$lookup" : {
                            "from" : "cities", 
                            "localField" : "city_id", 
                            "foreignField" : "_id", 
                            "as" : "city"
                        }
                    }, 
                    { 
                        "$lookup" : {
                            "from" : "pincodes", 
                            "localField" : "pincode_id", 
                            "foreignField" : "_id", 
                            "as" : "pincode"
                        }
                    }
                ],function(err , user){
                    if(err)
                    {
                        res.send({ status : 0 , msg : err}) 
                    }
                    else
                    {
                        res.send({ status : 1 , msg : "user profile.",data:user})
                    }
                })
/*
                User.findOne({_id : advertiser_id},function(err , user)
                {
                    console.log(user)
                    if(user)
                    {
                        res.send(JSON.stringify({ status : 1 , msg : "user profile.",data:user}))
                    }
                    else
                    {
                        res.send(JSON.stringify({ status : 0 , msg : err})) 
                    }
                })
                */
            }
        })
    }
    else
    {
        CommonFile.check_authWithData(req.headers.token , (err , user)=>{
            if (err)
            {
                //update
                res.status(401).send({ status : 0 , msg : err})
    
            } else {
                //return 
                res.send({ status : 1 , msg : "user profile.",data:user})
                
            }
        })
    }
    
        
}

exports.user_update_profile = function (req, res)
{
    if(req.body.type == 2)
    {
        let advertiser_id = req.body.advertiser_id
        CommonFile.admin_auth(req.headers.token , (err , value)=>
        {
            if(err)
            {
               return res.status(401).send({status : 0 , msg : err})
            }
            else
            {

            
            User.findOneAndUpdate({_id: new Object(advertiser_id)}, {$set: req.body},{new: true}, function (err, user) 
                    {
                        if(err)
                        {
                           return res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
                        }
                        else
                        res.send({status : 1 , data : user})
                        
                    });
            }
        })
    }
    else
    {
        CommonFile.check_authWithId(req.headers.token  , (err , user_id)=>
        {
            let data = req.body
            
            if(err)
            {
               return  res.status(400).send({ status : 0 , msg : err})
            }
            else
            {
                User.findOneAndUpdate({_id: new Object(user_id)}, {$set: req.body},{new: true}, function (err, user) 
                    {
                        if(err)
                        {
                          return  res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
                        }
                        else
                       return res.send({status : 1 , data : user})
                        /*
                       if (user)
                        {
                            User.findOne({_id : new Object(user_id),function (err , value)
                                 {
                                     if(err)
                                     {
                                        res.send({status : 0 , msg : "something wentwrong." })
                                     }
                                     else
                                    res.send(JSON.stringify({ status : 1 , msg : "user profile updated successful.",value})); 
                            }})
                            
                        }
                        else
                        res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
                        */
                    });
            }
            
        })
    }
};

exports.admin_approve_profile = function(req , res)
{

    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {
           return res.status(401).send({status : 0 , msg : err})
        }
        else
        {
            let data = req.body;
            let is_approve = data.is_approve // 1 for accept , 2 for reject 
            let user_ids = data.user_ids
            let msg_ = "Approved";
            if(is_approve == 2)
                msg_ = "Rejected";
            else
                if(is_approve == 1)
                {}
                else
                return res.send({status : 0 , msg :"is_approve not right value."})
        
                let cdate = new Date()
                

                User.updateMany({_id :  {$in : user_ids.map(ObjectID)}, is_admin_approve : 0 , is_verify : true , is_active : true },{$set :{is_admin_approve : is_approve ,update_date:cdate}},function(err , user){
                    if(err)
                    {
                       return res.send({status : 0,msg : "something gone wrong.",errm :err })
                    }
                    else
                    {
                      return  res.send(JSON.stringify({ status : 1 , msg : "Advertiser user "+msg_+" successfully."}));
                    }
                })
        }
    })
}

exports.admin_getall_user = function(req , res)
{
    CommonFile.admin_auth(req.headers.token, (err , value )=>
    {
        if(err)
        {
           return res.status(401).send({status : 0 , msg : err})
        }
        else
        {
            let params = req.query;
            let limit = Number(params.maxRecords);
            let frm = Number(params.startFrom);
            let type = Number(params.type)
            let search_data = params.search_data
            
            if(type == 0)
            {
                User.count({$or : [{'mobile_number': new RegExp(search_data, 'i')}]},function(err,cou){if (err) {} else {t_data= cou;
                    User.find({$or : [{'mobile_number': new RegExp(search_data, 'i')}]},function(err,user){
                        if (err)
                       return res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
                        else
                        {
                          return  res.send({ status : 1 , msg : "users listed successfully.","p_count": t_data, data :user});
                        }
                    }).count().sort( { create_date: -1 } ).skip(frm).limit(limit); }});
            }
            else
            if(type == 1)
            {
                User.count({is_active : true , is_verify : true , is_admin_approve : 0 , $or : [{'mobile_number': new RegExp(search_data, 'i')}]},function(err,cou){if (err) {} else {t_data= cou;
                    User.find({is_active : true , is_verify : true , is_admin_approve : 0 , $or : [{'mobile_number': new RegExp(search_data, 'i')}]},function(err,user){
                        if (err)
                       return res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
                        else
                        {
                          return  res.send({ status : 1 , msg : "users listed successfully.","p_count": t_data, data :user});
                        }
                    }).count().sort( { create_date: -1 } ).skip(frm).limit(limit); }});
            }
            else
            if(type == 2)
            {
                User.count({is_active : true , is_verify : true , is_admin_approve : 2 , $or : [{'mobile_number': new RegExp(search_data, 'i')}]},function(err,cou){if (err) {} else {t_data= cou;
                    User.find({is_active : true , is_verify : true , is_admin_approve : 2 , $or : [{'mobile_number': new RegExp(search_data, 'i')}]},function(err,user){
                        if (err)
                      return  res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
                        else
                        {
                        return    res.send({ status : 1 , msg : "users listed successfully.","p_count": t_data, data :user});
                        }
                    }).count().sort( { create_date: -1 } ).skip(frm).limit(limit); }});
            }
            else
            if(type == 3)
            {
                User.count({is_active : true , is_verify : true , is_admin_approve : 1 ,  $or : [{'mobile_number': new RegExp(search_data, 'i')}]},function(err,cou){if (err) {} else {t_data= cou;
                    User.find({is_active : true , is_verify : true , is_admin_approve : 1 ,  $or : [{'mobile_number': new RegExp(search_data, 'i')}]},function(err,user){
                        if (err)
                      return  res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
                        else
                        {
                         return   res.send({ status : 1 , msg : "users listed successfully.","p_count": t_data, data :user});
                        }
                    }).count().sort( { create_date: -1 } ).skip(frm).limit(limit); }});
            }
        }
    })
    
    
}
exports.logout = function(req , res)
{
    CommonFile.check_authWithData(req.headers.token,function(err , user)
    {
        let dd = new Date();
        if(err)
        {
           return res.status(401).send({status : 0 , msg : err})
        }
        else
        {
            User.findOneAndUpdate({_id : user._id},{$set : {token : uniqid('tok-au-'),update_date:dd}},(err,suser)=>{
                if(suser)
                {
                   return res.send({status : 1 , msg : "Logout successfully."})
                }
            })
        }
    })
}

// Admin Functions 
// 1 get all user (Pending users only)
// 2 update user (for approve)(is_admin_approve=true)(without it use not post advertise)
// 3 get user profile to see for admin .


/*
exports.user_document = function (req, res)  
{
    console.log(req.f);
    const multer = require('multer');
    var storage = multer.diskStorage({
        destination: function (request, file, callback) {
            callback(null, './uploads/');
        },
        filename: function (request, file, callback) {
            console.log(file);
            callback(null, file.originalname)
        }
    });
    const upload = multer({storage: storage}).any('file');
    upload (req, res, function(err)  {
        if (err) {
            return res.status(400).send({
                message: helper.getErrorMessage(err)
            });
        }
        let results = req.files.map(function(file)  {
            return {
                mediaName: file.filename,
                origMediaName: file.originalname,
                mediaSource: 'http://' + req.headers.host + "" + file.filename
            }
        });
        res.status(200).json(results);
    });
    
}*/

// exports.user_update = function (req, res) {
//     User.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, user) {
//         if (err) return next(err);
//         res.send('Product udpated.');
//     });
// };
// exports.user_delete = function (req, res) {
//     User.findByIdAndRemove(req.params.id, function (err) {
//         if (err) return next(err);
//         res.send('Deleted successfully!');
//     })
// };