const NUser = require('../../models/nuser_model/nuser.model')
const AUser = require('../../models/user.model')
//const PointSystem = require('../../models/pointsystem.model')
const Wallet = require('../../models/nuser_wallet.model')//('../../models/nuser_wallet.model')
const NCommonFile = require('../../nconstant')
const CommonFile = require('../../constant')
var uniqid = require('uniqid');
var dateFormat = require('dateformat');
const Referral_Pending = require('../../models/referral_pending.model')
ObjectID = require('mongodb').ObjectID;
exports.user_create = function(req , res)
{
    currentDate = new Date();
    let nuser = new NUser(
    {
        token:uniqid('tok-nu-'),
        //myCode: "",//uniqid('XRef-nu-'),
        p_img:req.body.p_img,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        mobile_number: req.body.mobile_number,
        mobile_second : req.body.mobile_second,
        email: req.body.email,
        date_of_birth: req.body.date_of_birth,
        add_1 : req.body.adr1,
        add_2 : req.body.adr2,
        pincode_id: req.body.pincode_id,
        city_id: req.body.city_id,
        state_id: req.body.state_id,
        country_id:req.body.country_id,
        gender: req.body.gender,

        religion_ids: req.body.religion_id,
        
        occcupation_ids: req.body.occcupation_ids,
        interest_ids : req.body.interest_ids,
        income_ids : req.body.income_ids,
        relationship_ids : req.body.relationship_ids,
        education_ids : req.body.education_ids,
        family_ids : req.body.family_ids,

        referral_code: req.body.referral_code,
        fcm_token: req.body.fcm_token,
        is_approve : 0 ,
        is_verify: false,
        is_active :true,
        point_balance : 0,
        OTP:Math.floor(100000 + Math.random() * 900000),
        create_date : currentDate ,
        update_date :currentDate
    });
    /*
    occcupation_ids :{type : JSON},
    interest_ids :{type : JSON},

    income_ids : {type: Schema.Types.ObjectId,ref: 'INCOME'},
    relationship_ids : {type: Schema.Types.ObjectId,ref: 'relationship'},
    education_ids :{type: Schema.Types.ObjectId,ref: 'education'},
    family_ids :{type: Schema.Types.ObjectId,ref: 'familym'},
   
    */

    if(req.headers.token == "register_tok")
    {
        //NUser.findOne({myCode:})
        NUser.findOne( { $or : [{ mobile_number :  req.body.mobile_number},{mobile_number : req.body.mobile_second} ]}, function(err, object){
            if (object) 
            {
                //update
                res.send({ status : 0 , msg : "user already existed."})
            } else {
                //insert
                if(req.body.referral_code == "")
                {
                    nuser.save(function (err , nuser) 
                    {
                       // console.log(err);
                        if (err)
                        res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
                        else
                        {
                            if(nuser.referral_code != undefined)//req.body.referral_code
                            {
                                NCommonFile.point_system(2,(err, value)=>
                                {
                                    if(err)
                                    {
                                        console.log(err)
                                    }
                                    else
                                    {
                                        let user_id = nuser._id;
    
                                        let pending_referral = new Referral_Pending({
                                            user_id : user_id,
                                            referral_code : req.body.referral_code,
                                            points : value.points,
                                            is_paid : false ,
                                            cdate : currentDate
                                        })
                                        pending_referral.save(function(err , pending_referral){
                                            if(err){console.log(err)}
                                            else {
                                                console.log(pending_referral)
                                                console.log("referral point added in pending table")
                                            }
                                        })
                                    }
                                })
                                
                                
                                res.send({ status : 1 , msg : "account created successfully , please verify mobile number ." , data :({mobile_number:nuser.mobile_number,OTP:nuser.OTP})});
    
                            }
                            else
                            {
                                res.send({ status : 1 , msg : "account created successfully , please verify mobile number ." , data :({mobile_number:nuser.mobile_number,OTP:nuser.OTP})});
                            }
                            
                        }
                        
                    }) 
                }
                else
                {
                    NUser.findOne({myCode : req.body.referral_code},function(err,refuser){
                        if(refuser)
                        {
                            nuser.save(function (err , nuser) 
                            {
                            // console.log(err);
                                if (err)
                                res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
                                else
                                {
                                    if(nuser.referral_code != undefined)//req.body.referral_code
                                    {
                                        NCommonFile.point_system(2,(err, value)=>
                                        {
                                            if(err)
                                            {
                                                console.log(err)
                                            }
                                            else
                                            {
                                                let user_id = nuser._id;

                                                let pending_referral = new Referral_Pending({
                                                    user_id : user_id,
                                                    referral_code : req.body.referral_code,
                                                    points : value.points,
                                                    is_paid : false ,
                                                    cdate : currentDate
                                                })
                                                pending_referral.save(function(err , pending_referral){
                                                    if(err){console.log(err)}
                                                    else {
                                                        console.log(pending_referral)
                                                        console.log("referral point added in pending table")
                                                    }
                                                })
                                            }
                                        })
                                        
                                        
                                        res.send({ status : 1 , msg : "account created successfully , please verify mobile number ." , data :({mobile_number:nuser.mobile_number,OTP:nuser.OTP})});

                                    }
                                    else
                                    {
                                        res.send({ status : 1 , msg : "account created successfully , please verify mobile number ." , data :({mobile_number:nuser.mobile_number,OTP:nuser.OTP})});
                                    }
                                    
                                }
                                
                            })
                        }
                        else
                        {
                            res.send({ status : 0 , msg : "Referral code not valid."})
                        }
                    })
                }
                

            }
        });
    }
    else
    {
        res.send({ status : 0 , msg : "Register authentication failed."})
    }
}
exports.user_send_otp = function (req, res) {

    let currentDate = new Date();
    let mobile_n = req.body.mobile_number
    if(mobile_n.length == 13)
        mobile_n = mobile_n.substring(3);

   // if(mobile_n.length != 10)
    //    return res.send({status : 0 ,msg : "Mobile number is invalid."})
    console.log("Mobile Number "+mobile_n)
    console.log("Mobile Number Lenght --"+mobile_n.length)

    NUser.find( { $or : [{ mobile_number :  mobile_n},{ mobile_second :  mobile_n},{mobile_number : mobile_n} ]}, function(err, nuser){
        if(err)//if (nuser)
        {
            res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
        }
        else
        {
            console.log(nuser)
            if(nuser.length == 0)
            {
                //res.send({ status : 0 , msg : "user not existed , please register first."}))
                var otp = Math.floor(100000 + Math.random() * 900000);
                let nuser = new NUser({
                    token:uniqid('tok-nu-'),
                    mobile_number: mobile_n,
                    OTP:otp ,
                    point_balance : 0,
                    is_approve : 0 ,
                    is_verify:false,
                    is_active :true,
                   // device_udid : req.body.device_udid,
                    create_date : currentDate ,
                    update_date :currentDate
                })
                CommonFile.send_otp(mobile_n,otp,(err , otp)=>
                {
                    if(err)
                    {
                        res.send({ status : 0 , msg : "something gone wrong." , err : err});
                    }
                    else
                    {
                        nuser.save(function(err , nuser){
                            if(err){
                                res.send({ status : 0 , msg : "something gone wrong." , err : err});
                            }
                            else
                            {
                                res.send({ status : 2 , msg : "OTP Sent on your  mobile number." });
                            }
                        })
                    }
                })
            }
            else
            if(nuser.length >= 2)
            {
                res.send({ status : 0 , msg : "Contact xona customer support1." });  
            }
            else
            {
                let nuserdata = nuser[0];
                console.log(nuserdata.mobile_number)
                console.log(mobile_n)
                if(nuserdata.mobile_number ==  mobile_n) //&& nuserdata.device_udid  == req.body.device_udid)
                {
                    if(nuserdata.is_approve == 2 || nuserdata.is_approve == 3)
                    {
                        let msssg = "Please contact Xona support , Because your account is "+nuserdata.is_approve == 2 ?"Rejected." : "Blocked."
                        return res.send({status : 0 , msg : msssg})
                    }
                     

                    var otp = Math.floor(100000 + Math.random() * 900000);
                    CommonFile.send_otp(nuserdata.mobile_number,otp,(err , val)=>
                    {
                        if(val)
                        {
                            NUser.findByIdAndUpdate(nuserdata.id, {$set: {OTP:otp}}, function (err, nuser)
                            {
                                        if (err) 
                                        res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
                                        else
                                        {
                                            if(nuserdata.is_verify)
                                            res.send({ status : 1 , msg : "OTP Sent on your registered mobile number."});
                                            else
                                            res.send({ status : 2 , msg : "OTP Sent on your mobile number."});
                                        }
                                        
                            });
                        }
                        else
                        {
                            res.send({ status : 0 , msg : err}); 
                        }
                        
                    })
                    
                }
                else
                {
                    //if(nuserdata.device_udid  == req.body.device_udid)
                    res.send({ status : 0 , msg : "Contact xona customer support." })
                    //else
                    //res.send({ status : 0 , msg : "Contact xona customer support your Device missmatch." })
                }
            }
           
        } 
    });
};

exports.user_verify_otp = function (req, res) {

    console.log(req.body)
    let currentDate = new Date()
    let mobile_n = req.body.mobile_number
    if(mobile_n.length == 13)
    mobile_n = mobile_n.substring(3);

    NUser.findOne( {  mobile_number :  mobile_n , is_active : true }, function(err, nuser){
        if (nuser) 
        {
            if(req.body.OTP == nuser.OTP)
            {
                console.log(nuser)
                console.log(nuser.myCode)
                let timestemp = (new Date().getTime())
                let new_token = uniqid('tok-nu-') +''+timestemp
               /* if(req.body.device_udid == undefined || req.body.device_udid == "")
                {
                    res.send({status : 0 , msg : "Device Identificaiton required."})
                    return ""
                }*/
                

                if(nuser.is_verify == false)
                {
                    // first time to check referral_code
                    if(req.body.referral_code == undefined || req.body.referral_code == "" )
                    {
                        //NUser.findByIdAndUpdate(nuser.id, {$set: {is_verify : true , token : new_token , device_udid : req.body.device_udid }}, function (err, nuser)
                        NUser.findByIdAndUpdate(nuser.id, {$set: {is_verify : true , token : new_token }}, function (err, nuser)
                        {
                                if (err) 
                                res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
                                else
                                res.send({ status : 1 , msg : "Verify OTP and Login Successfully." , token :new_token , user_type : 2});
                        });
                    }
                    else
                    {
                        NUser.findOne({myCode : req.body.referral_code},function(err,refuser)
                        {
                            console.log(refuser)
                            if(refuser)
                            {
                                NCommonFile.point_system(2,(err, value)=>
                                            {
                                                if(err)
                                                {
                                                    console.log(err)
                                                }
                                                else
                                                {
                                                    let user_id = nuser._id;
    
                                                    let pending_referral = new Referral_Pending({
                                                        user_id : user_id,
                                                        referral_code : req.body.referral_code,
                                                        points : value.points,
                                                        is_paid : false ,
                                                        cdate : currentDate
                                                    })
                                                    pending_referral.save(function(err , pending_referral){
                                                        if(err){console.log(err)}
                                                        else {
                                                            console.log(pending_referral)
                                                            console.log("referral point added in pending table")
                                                        }
                                                    })
                                                }
                                            })

                                NUser.findByIdAndUpdate(nuser.id, {$set: {is_verify : true , referral_code: req.body.referral_code}}, function (err, nuser)
                                {
                                            if (err) 
                                            res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
                                            else
                                            res.send({ status : 1 , msg : "Verify OTP and Login Successfully." , token :nuser.token , user_type : 2});
                                });
                               
                            }
                            else
                            {
                                res.send({ status : 0 , msg : "Referral code not valid."})
                            }
                        })
                    }

                }
                else
                {
                    //if(req.body.device_udid  == nuser.device_udid)
                   // {
                       if(nuser.is_approve == 2)
                        return res.send({ status : 0 , msg : "Contact xona support your profile rejected." , err : err}); 

                        NUser.findByIdAndUpdate(nuser.id, {$set: {is_verify : true , token : new_token}}, function (err, nuser)
                        {
                                    if (err) 
                                    res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
                                    else
                                    res.send({ status : 1 , msg : "Verify OTP and Login Successfully." , token :new_token , user_type : 2});
                        });
                  //  }
                  //  else
                   // {
                   //     res.send({status : 0 , msg : "Device Identificaiton missmatched. Please contact Xona support."})
                   // }
                }
                /*
                if(nuser.myCode == undefined)
                {
                    let code = Math.floor(100000000 + Math.random() * 900000000)
                  
                        
                        
                        NUser.findOne({myCode : code},function(err , data){
                            if(data)
                            {
                               // code = Math.floor(1000000000 + Math.random() * 9000000000)
                            }
                            else
                            {
                                console.log(code);
                                NUser.findByIdAndUpdate(nuser.id, {$set: {is_verify : true,myCode:code}}, function (err, nuser)
                                {
                                            if (err) 
                                           return res.send({ status : 0 , msg : "something gone wrong." , err : err})); 
                                            else
                                           return res.send({ status : 1 , msg : "Verify OTP and Login Successfully." , token :nuser.token , user_type : 2});
                                });
                              //  loop_run = false
                              
                            }
                        })
               
                   
                }
                else
                {
                    NUser.findByIdAndUpdate(nuser.id, {$set: {is_verify : true}}, function (err, nuser)
                    {
                                if (err) 
                                res.send({ status : 0 , msg : "something gone wrong." , err : err})); 
                                else
                                res.send({ status : 1 , msg : "Verify OTP and Login Successfully." , token :nuser.token , user_type : 2});
                    });
                }*/
            }
            else
            {
                res.send({ status : 0 , msg : "OTP doesn't match , please retry."})
            }
        } else {
            //insert
            res.send({ status : 0 , msg : "user not existed or contact admin ."})
        }
    });
};
exports.getuser_profile = function(req , res)
{
    if(req.body.type == 2)
    {
        CommonFile.admin_auth(req.headers.token , (err , value)=>
        {
            if(err)
            {
              return  res.status(401).send({status : 0 , msg : err})
            }
            else
            {
                NUser.aggregate(
                    [
                         
                        { 
                            "$match" : {
                                "_id" : new ObjectId(req.body.enduser_id)
                            }
                        },{ 
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
                        }, 
                        { 
                            "$lookup" : {
                                "from" : "filterreligions", 
                                "localField" : "religion_ids", 
                                "foreignField" : "_id", 
                                "as" : "religions"
                            }
                        }, 
                        { 
                            "$lookup" : {
                                "from" : "filterincomes", 
                                "localField" : "income_ids", 
                                "foreignField" : "_id", 
                                "as" : "income"
                            }
                        }, 
                        { 
                            "$lookup" : {
                                "from" : "filterrelations", 
                                "localField" : "relationship_ids", 
                                "foreignField" : "_id", 
                                "as" : "relation"
                            }
                        }, 
                        { 
                            "$lookup" : {
                                "from" : "filtereducations", 
                                "localField" : "education_ids", 
                                "foreignField" : "_id", 
                                "as" : "education"
                            }
                        }, 
                        { 
                            "$lookup" : {
                                "from" : "filterfmembers", 
                                "localField" : "family_ids", 
                                "foreignField" : "_id", 
                                "as" : "familymembers"
                            }
                        }, 
                        { 
                            "$lookup" : {
                                "from" : "filteroccupations", 
                                "localField" : "occcupation_ids", 
                                "foreignField" : "_id", 
                                "as" : "occcupation"
                            }
                        }, 
                        { 
                            "$lookup" : {
                                "from" : "filterinterests", 
                                "localField" : "interest_ids", 
                                "foreignField" : "_id", 
                                "as" : "interest"
                            }
                        },
                        { 
                            "$lookup" : {
                                "from" : "nuser_documents", 
                                "localField" : "_id", 
                                "foreignField" : "user_id", 
                                "as" : "document"
                            }
                        }
                    ],function(err , nuser)
                    {
                        if(err)
                        {
                          return  res.status(400).send({ status : 0 , msg : err})
                        }
                        else
                        {
                          return  res.send({ status : 1 , msg : "user profile.",data:nuser})
                        }
                    }
                )
               
            }
        }) 
    }
    else
    {
        NCommonFile.nuser_check_authWithData(req.headers.token , (err , nuserData)=>
        {
            if (nuserData)
                    {
                        //update
                       return res.send({ status : 1 , msg : "user profile.",data:nuserData})

                    } else {
                        return res.status(400).send({ status : 0 , msg : err})
                        
                    }
        }) 
    }
        
}

exports.user_update_profile = function (req, res)
{
    console.log(req.headers.token);
    /*
        console.log('-----------------start--------------------')
        let data = req.body
        console.log(data)
       
        var day=dateFormat(new Date(req.body.date_of_birth), "yyyy-mm-dd");
        delete req.body["date_of_birth"]
        req.body["date_of_birth"] = day

        console.log("date of birth -"+day)

        console.log(req.body)
        console.log('-----------------end--------------------')
    */
   if(req.body.type == 2)
   {
    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {
           return res.status(401).send({ status : 0 , msg :  err});
        }
        else
        {
            
                    NUser.findByIdAndUpdate(req.body.enduser_id, {$set: req.body}, function (err, nuser) 
                    {
                        if (err) 
                       return res.send({ status : 0 , msg : "something gone wrong." , err : err});
                        else
                       return res.send({ status : 1 , msg : "user profile updated successful.",data:req.body});
                    });
               
        }
    })
   }
   else
   {
    NCommonFile.nuser_check_authWithData(req.headers.token , (err , nuser1)=>{

        if (nuser1)
        {
            NUser.findByIdAndUpdate(nuser1._id, {$set: req.body}, function (err, nuser) 
            {
                if (err) 
                res.send({ status : 0 , msg : "something gone wrong." , err : err});
                else
                res.send({ status : 1 , msg : "user profile updated successful.",data:req.body});
            });
        } 
        else
         {
            return res.status(400).send({ status : 0 , msg : err})
          }
    })
   }
            

            
       
};

exports.validate_refrel_code = function(req , res)
{
    let ref_code = req.body.referral_code
    NUser.findOne()
}

exports.admin_user_approve = function(req , res) // approve and give welcome points
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
            console.log(data)
            let is_approve = data.is_approve // 1 for accept , 2 for reject 
            let user_id = data.user_id
            let user_ids = data.user_ids 
            let msg_ = "Approved";
            if(is_approve == 2)
                msg_ = "Rejected";
                let cdate = new Date()
        
            //NUser.findOne({_id:user_id , is_approve: 0},function(err , nuserData)
            NUser.find({_id: {$in : user_ids.map(ObjectID)} , is_approve: 0},function(err , nuserData)
            {
                if(nuserData.length > 0)
                {
                    if(is_approve == 1)
                    {// approved so provide a Welcome point 
                        NCommonFile.point_system(1,(err , pointdata)=>
                        {
                            //let pointdata = points[0];
                            console.log(pointdata)
                            let date_ = new Date()
                            let size_data = nuserData.length
                            nuserData.forEach(element =>{
                                
                                let wallet = new Wallet({
                                    user_id : element._id,
                                    wallet_type:1,// 1 for credit 2 for debit
                                    details_type: 5,// credit ( 1 for advertise , 2 for delete(refund - or transaction return), 3 for bonus) , debit (1 for adpost)
                                    advertise_type : -1 ,//  -1 for othes ,  ad type 1 for banner , 2 for half banner , 3 for full screen 
                                    //details_id: {type: Schema.Types.ObjectId,ref: 'AdMaster'},// credit (Online table_id , Refund (advertise id ) , debit (advertise id)
                                    old_point:0,
                                    new_point:pointdata.points,
                                    point:pointdata.points,
                                    status_msg:pointdata.name,
                                    cdate:date_
                                })
                                wallet.save(function(err , wallet){
                                    if(err)
                                    {
                                       return res.send({status : 0,msg : "something gone wrong.",errm : err })
                                    }
                                    else
                                    {
                                        console.log(wallet)
                                        let code = Math.floor(100000000 + Math.random() * 900000000)
                                        
                                        console.log(element)
                                        if(element.referral_code ==  undefined)
                                        {}
                                        else
                                        {
                                            
                                            // get ref amount from pending refresl 
                                            // user wallet ma entry 
                                            // user balance update karva nu 
                                            console.log(1)
                                            Referral_Pending.findOneAndUpdate({user_id:element._id , referral_code:element.referral_code , is_paid : false },{$set : {is_paid : true}}, function(err , pending_referral){
                                                console.log(2)
                                                console.log(pending_referral)
                                                if(pending_referral)
                                                {
                                                    NUser.findOne({myCode : element.referral_code},function(err , touserData){
                                                        console.log(3)
                                                        console.log(touserData)
                                                        if(touserData)
                                                        {
                                                            let new_balance = touserData.point_balance + pending_referral.points
                                                            let touserwallet = new Wallet({
                                                                user_id : touserData._id,
                                                                wallet_type:1,// 1 for credit 2 for debit
                                                                details_type: 3,// credit ( 1 for advertise , 2 for delete(refund - or transaction return), 3 for bonus) , debit (1 for adpost)
                                                                advertise_type : -1 ,//  -1 for othes ,  ad type 1 for banner , 2 for half banner , 3 for full screen 
                                                                details_id: element._id,//{type: Schema.Types.ObjectId,ref: 'AdMaster'},// credit (Online table_id , Refund (advertise id ) , debit (advertise id)
                                                                old_point:touserData.point_balance,
                                                                new_point:new_balance,
                                                                point:pending_referral.points,
                                                                status_msg:" Referrel points.",
                                                                cdate:date_
                                                            })
                                                            touserwallet.save(function(err , touserwallet){
                                                                if(err){console.log(err)}
                                                                else
                                                                {
                                                                    NUser.findByIdAndUpdate(touserData._id ,{$set : {point_balance : new_balance , update_date:cdate}},function(err,nuserupdate)
                                                                    {
                                                                        if(err)
                                                                        {
                                                                            console.log(err)
                                                                        }
                                                                        else
                                                                        {
                                                                            NUser.findByIdAndUpdate({_id : element._id , is_approve : 0 , is_verify : true , is_active : true },{$set :{is_approve : 1 , myCode:code , point_balance : pointdata.points ,update_date:cdate}},function(err , nuser){
                                                                                if(err)
                                                                                {
                                                                                    res.send({status : 0,msg : "something gone wrong.",errm : err })
                                                                                }
                                                                                else
                                                                                {
                                                                                    size_data = size_data - 1

                                                                                    if(size_data == 0)
                                                                                    res.send({ status : 1 , msg : "Normal User "+msg_+" successfully."});
                                                                                }
                                                                            })
                                                                            console.log("end user got referral points.")
                                                                        }
                                                                    })
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                                else
                                                {
                                                    console.log("no pending referral found ")
                                                    console.log(nuserData)
                                                }
                                            })
                                        }
            
                                        
                                    }
                                })
                            })
                            
                        })
                    }
                    else
                    {
                        NUser.updateMany({_id : {$in : user_ids.map(ObjectID)} , is_approve : 0 , is_verify : true , is_active : true },{$set :{is_approve : 2 , token : "Rejected-tok"+Math.floor(100000000 + Math.random() * 900000000) ,update_date:cdate}},function(err , nuser){
                            if(err)
                            {
                               return res.send({status : 0,msg : "something gone wrong.",errm : err })
                            }
                            else
                            {
                              return  res.send({ status : 1 , msg : "Normal User "+msg_+" successfully."});
                            }
                        })
                    }
                }
                else
                {
                   return res.send({status:0 ,msg : "end user not existed , contact to developer :) ."})
                }
            })
        }
    })
    
        
        
}
exports.admin_getall_users = function(req , res)
{
    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {
           return res.status(401).send({status : 0 , msg:err})
        }
        else
        {
            let params = req.query;
            let limit = Number(params.maxRecords);
            let frm = Number(params.startFrom);
            let type = Number(params.type);
            let mobile_number = params.search_data

            if(type == 0)
            {//1 for not approved //2 for rejected by admin// 3 for approved & running
                NUser.count({$or : [{'mobile_number': new RegExp(mobile_number, 'i')}]},function(err,cou){if (err) {} else {t_data= cou;
                    NUser.find({'mobile_number': new RegExp(mobile_number, 'i')},function(err,nuser){
                        if (err)
                       return res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
                        else
                        {
                         return   res.send({ status : 1 , msg : "users listed successfully.","p_count": t_data, data :nuser});
                        }
                    }).count().sort( { create_date: -1 } ).skip(frm).limit(limit); }});
            }
            else
            if(type == 1)
            {
                NUser.count({is_active : true,is_verify: true , is_approve : 0 ,'mobile_number': new RegExp(mobile_number, 'i')},function(err,cou){if (err) {} else {t_data= cou;
                   
                    NUser.aggregate([
                        { 
                            "$lookup" : {
                                "from" : "nuser_documents", 
                                "localField" : "_id", 
                                "foreignField" : "user_id", 
                                "as" : "document"
                            }
                        }, 
                        { 
                            "$match" : {
                                "is_approve" : 0 ,
                                "is_verify" : true ,
                                "is_active" : true , 
                                "mobile_number":{"$regex": mobile_number,"$options":'i'}
                            }
                        }, 
                        { 
                            "$sort" : {
                                "create_date" : -1
                            }
                        }, 
                        { 
                            "$skip" : frm
                        }, 
                        { 
                            "$limit" : limit
                        }
                    ],function(err , nuser ){
                        if (err)
                        return res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
                         else
                         {
                           return  res.send({ status : 1 , msg : "users listed successfully.","p_count": t_data, data :nuser});
                         }
                    })
                   
                }});
            }
            else
            if(type == 2)
            {
                NUser.count({is_active : true,is_verify: true , is_approve : 2 , $or : [{'mobile_number': new RegExp(mobile_number, 'i')}]},function(err,cou){if (err) {} else 
                {t_data= cou;

                    NUser.aggregate([
                        { 
                            "$lookup" : {
                                "from" : "nuser_documents", 
                                "localField" : "_id", 
                                "foreignField" : "user_id", 
                                "as" : "document"
                            }
                        }, 
                        { 
                            "$match" : {
                                "is_approve" : 2 ,
                                "is_verify" : true ,
                                "is_active" : true , 
                                "mobile_number":{"$regex": mobile_number,"$options":'i'}
                            }
                        }, 
                        { 
                            "$sort" : {
                                "create_date" : -1
                            }
                        }, 
                        { 
                            "$skip" : frm
                        }, 
                        { 
                            "$limit" : limit
                        }
                    ],function(err , nuser ){
                        if (err)
                        return res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
                         else
                         {
                           return  res.send({ status : 1 , msg : "users listed successfully.","p_count": t_data, data :nuser});
                         }
                    })
                  /*  NUser.find({is_active : true,is_verify: true , is_approve : 2 ,$or : [{'mobile_number': new RegExp(mobile_number, 'i')}]},function(err,nuser){
                        if (err)
                       return res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
                        else
                        {
                          return  res.send({ status : 1 , msg : "users listed successfully.","p_count": t_data, data :nuser});
                        }
                    }).count().sort( { create_date: -1 } ).skip(frm).limit(limit); 
                }*/
            }});
            }
            else
            if(type == 3)
            {
                NUser.count({is_active : true,is_verify: true , is_approve : 1 , $or : [{'mobile_number': new RegExp(mobile_number, 'i')}]},function(err,cou){if (err) {} else {t_data= cou;
                    
                    NUser.aggregate([
                        { 
                            "$lookup" : {
                                "from" : "nuser_documents", 
                                "localField" : "_id", 
                                "foreignField" : "user_id", 
                                "as" : "document"
                            }
                        }, 
                        { 
                            "$match" : {
                                "is_approve" : 1 ,
                                "is_verify" : true ,
                                "is_active" : true , 
                                "mobile_number":{"$regex": mobile_number,"$options":'i'}
                            }
                        }, 
                        { 
                            "$sort" : {
                                "create_date" : -1
                            }
                        }, 
                        { 
                            "$skip" : frm
                        }, 
                        { 
                            "$limit" : limit
                        }
                    ],function(err , nuser ){
                        if (err)
                        return res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
                         else
                         {
                           return  res.send({ status : 1 , msg : "users listed successfully.","p_count": t_data, data :nuser});
                         }
                    })/*NUser.find({is_active : true,is_verify: true , is_approve : 1 , $or : [{'mobile_number': new RegExp(mobile_number, 'i')}]},function(err,nuser){
                        if (err)
                        return res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
                        else
                        {
                          return  res.send({ status : 1 , msg : "users listed successfully.","p_count": t_data, data :nuser});
                        }
                    }).count().sort( { create_date: -1 } ).skip(frm).limit(limit); */
                
                }});
            }
        }
    })   
}
exports.logout = function(req , res)
{
    NCommonFile.nuser_check_authWithData(req.headers.token,function(err , nuserData)
    {
        let dd = new Date();
        if(err)
        {
          return  res.status(401).send({status : 0 , msg : err})
        }
        else
        {
            NUser.findOneAndUpdate({_id : nuserData._id},{$set : {token : uniqid('tok-nu-'),update_date:dd}},(err,nuser)=>{
                if(nuser)
                {
                   return res.send({status : 1 , msg : "Logout successfully."})
                }
                else
                {
                    return res.send({status : 0  , msg : "something went wrong."})
                }
            })
        }
    })
}
exports.admin_user_block_unblock = function(req , res)
{
    let cdate = new Date()
    console.log(req.body)
    if(req.body.type == 2)//for advertiser
    {
        CommonFile.admin_auth(req.headers.token , (err , value)=>{
            if(err)
            return res.status(401).send({status:0 , msg : err})
            else
            {
                let set_block = req.body.set_block
                if(set_block)
                {
                    AUser.findOneAndUpdate({_id:req.body.user_id , is_admin_approve :1 } , {$set :{is_admin_approve :3 , token : "Blocked-tok"+Math.floor(100000000 + Math.random() * 900000000) ,update_date:cdate}},function(errs , nuserData){
                        if(nuserData)
                        {
                            res.send({status : 1 , msg :"User Blocked successfully."})
                        }
                        else
                        {
                            res.send({status : 0 , msg:"User not found , contact Xona Developer."})
                        }
                    })
                }
                else
                {
                    AUser.findOneAndUpdate({_id:req.body.user_id, is_admin_approve :3} , {$set :{is_admin_approve :1 , token : "UnBlocked-tok"+Math.floor(100000000 + Math.random() * 900000000) ,update_date:cdate}},function(errs , nuserData){
                        if(nuserData)
                        {
                            res.send({status : 1 , msg :"User UnBlocked successfully."})
                        }
                        else
                        {
                            res.send({status : 0 , msg:"User not found , contact Xona Developer."})
                        }
                    })
                }
            }
        })
    }
    else
    {
        CommonFile.admin_auth(req.headers.token , (err , value)=>{
            if(err)
            return res.status(401).send({status:0 , msg : err})
            else
            {
                let set_block = req.body.set_block
                let data = req.body
                if(set_block)
                {
                    NUser.findOneAndUpdate({_id:data.user_id , is_approve :1} , {$set :{is_approve :3 , token : "Blocked-tok"+Math.floor(100000000 + Math.random() * 900000000) ,update_date:cdate}},function(errs , nuserData){
                        if(nuserData)
                        {
                            res.send({status : 1 , msg :"User Blocked successfully."})
                        }
                        else
                        {
                            res.send({status : 0 , msg:"User not found , contact Xona Developer."})
                        }
                    })
                }
                else
                {
                    NUser.findOneAndUpdate({_id:data.user_id , is_approve :3} , {$set :{is_approve :1 , token : "UnBlocked-tok"+Math.floor(100000000 + Math.random() * 900000000) ,update_date:cdate}},function(errs , nuserData){
                        if(nuserData)
                        {
                            res.send({status : 1 , msg :"User UnBlocked successfully."})
                        }
                        else
                        {
                            res.send({status : 0 , msg:"User not found , contact Xona Developer."})
                        }
                    })
                }
            }
        })
    }
    
}