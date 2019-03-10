const Nuser_Wallet = require('../models/nuser_wallet.model')
const NCommonFile = require('../nconstant')
const CommonFile = require('../constant')
const Nuser = require('../models/nuser_model/nuser.model')
var dateFormat = require('dateformat');
ObjectId = require('mongodb').ObjectID;
exports.getwalletbalance = function(req , res)
{
    NCommonFile.nuser_check_authWithData(req.headers.token , function(err , nuserData){
        if(err)
        {
            res.send({status : 0 , msg : err})
        }
        else
        {
            console.log(nuserData)
            res.send({status : 1 , msg : "points successfully get.", data :{balance : nuserData.point_balance}})
        }
    })
}

exports.getwallethistory = function(req , res)
{
    NCommonFile.nuser_check_authWithData(req.headers.token , function(err , nuserData){
        if(err)
        {
            res.send({status : 0 , msg : err})
        }
        else
        {
            Nuser_Wallet.find({user_id : nuserData._id} , function(err , nuser_wallet)
            {
                if(err)
                {
                    res.send({status : 0 , msg : err})
                }
                else
                {
                    res.send({status : 1 , msg : "points wallet listed successfully .", data :nuser_wallet})
                }
            }).sort( { cdate: -1 } )
            //console.log(nuserData)
            //res.send({status : 1 , msg : "points successfully get.", data :{balance : nuserData.point_balance}})
        }
    })
}

exports.get_earninig = function(req , res)
{
    if(req.body.type_admin == 2)
    {
        CommonFile.admin_auth(req.headers.token , (err , value)=>
        {
            if(err)
            return res.status(401).send({status : 0})
            Nuser.findOne({_id : req.body.enduser_id},function(err , nuserData){//NCommonFile.nuser_check_authWithData(req.headers.token , function(err , nuserData){
                if(err)
                {
                    res.send({status : 0 , msg : err})
                }
                else
                {
                    let type  = req.body.type // 1 for self , 2 for referel
                    
                    if(type == 1)
                    {
                        Nuser_Wallet.find({user_id : nuserData._id, wallet_type : 1 , details_type : type} , function(err , nuser_wallet)
                        {
                            if(err)
                            {
                                res.send({status : 0 , msg : err})
                            }
                            else
                            {
                                res.send({status : 1 , msg : "points wallet listed successfully .", data :nuser_wallet})
                            }
                        }).sort( { cdate: -1 } )
                    }
                    else
                    if(type == 2)
                    {
                        Nuser_Wallet.aggregate([
                            { 
                                "$lookup" : {
                                    "from" : "nusers", 
                                    "localField" : "details_id", 
                                    "foreignField" : "_id", 
                                    "as" : "user"
                                }
                            }, 
                            { 
                                "$match" : {
                                    "user_id" : ObjectId(nuserData._id), 
                                    "details_type" : 3
                                }
                            }, 
                            { 
                                "$unwind" : "$user"
                            }
                        ],function(err ,walletData ){
                            if(err)
                            {
                                res.send({status : 0 , msg : err})
                            }
                            else
                            {
                                res.send({status : 1 , msg : "Referel Wallet listed .", data :walletData})
                            }
                        }).sort( { cdate: -1 } )
                    }
                    else
                    if(type == 3)
                    {
                        var day=dateFormat(new Date(), "yyyy-mm-dd");
                        //var day=dateFormat(new Date(new Date().setDate(new Date().getDate()+1)), "yyyy-mm-dd");
                        var day1=dateFormat(new Date(new Date().setDate(new Date().getDate()+1)), "yyyy-mm-dd");
                        //console.log(day)
                        //console.log(day1)
                        //console.log({user_id : nuserData._id, wallet_type : 1 , details_type : type ,"cdate" : { $lt: new Date(day1+"T00:00:00Z").toISOString(), $gte: new Date(day+"T00:00:00Z").toISOString() }})
                        
                        Nuser_Wallet.aggregate([
                            { 
                                "$lookup" : {
                                    "from" : "adshow_histories", 
                                    "localField" : "details_id", 
                                    "foreignField" : "_id", 
                                    "as" : "referel"
                                }
                            }, 
                            { 
                                "$unwind" : "$referel"
                            }, 
                            { 
                                "$match" : {
                                    "user_id" :  ObjectId(nuserData._id), 
                                    "wallet_type" : 1, 
                                    "details_type" : 2
                                    ,
                                    "cdate" : { "$lt":  new Date(day1+"T00:00:00Z"), "$gte": new Date(day+"T00:00:00Z") }
                                    //"cdate" : { "$lt":  new ISODate(new Date(day1+"T00:00:00Z").toISOString()), "$gte": new  ISODate(new Date(day+"T00:00:00Z").toISOString()) }
                                }
                            }, 
                            { 
                                "$lookup" : {
                                    "from" : "nusers", 
                                    "localField" : "referel.nuser_id", 
                                    "foreignField" : "_id", 
                                    "as" : "user"
                                }
                            }, 
                            { 
                                "$unwind" : "$user"
                            }, 
                            { 
                                "$lookup" : {
                                    "from" : "admasters", 
                                    "localField" : "referel.advertise_id", 
                                    "foreignField" : "_id", 
                                    "as" : "advertise"
                                }
                            }, 
                            { 
                                "$unwind" : "$advertise"
                            }, 
                            { 
                                "$project" : {
                                    "point" : 1,
                                    "ispoint_temp":1,
                                    "level_point":1, 
                                    "user.mobile_number" : 1, 
                                    "user.myCode" : 1,
                                    "advertise.adtype_id" : 1,
                                    "cdate" : 1
                                }
                            },
                            { 
                                "$sort" : {
                                    "cdate" : -1.0
                                }
                            }
                        ],function(err , walletData){
                            //console.log(walletData)
                            //console.log('-- test --')
                            //console.log({ $lt: new Date(day1+"T00:00:00Z").toISOString(), $gte: new Date(day+"T00:00:00Z").toISOString() })
                            if(err)
                            {
                                res.send({status : 0 , msg : err})
                            }
                            else
                            {
                                res.send({status : 1 , msg : "downline earning listed .", data :walletData})
                            }
                        })//.sort( { cdate: -1 } )
                       /* Nuser_Wallet.find({user_id : new ObjectId(nuserData._id), wallet_type : 1 , details_type : type ,"cdate" : { $lt: new Date(day1+"T00:00:00Z").toISOString(), $gte: new Date(day+"T00:00:00Z").toISOString() }} , function(err , nuser_wallet)
                        {
                            if(err)
                            {
                                res.send({status : 0 , msg : err})
                            }
                            else
                            {
                                res.send({status : 1 , msg : "points wallet listed successfully .", data :nuser_wallet})
                            }
                        }).sort( { cdate: -1 } ) */
                    }
                    
                    //console.log(nuserData)
                    //res.send({status : 1 , msg : "points successfully get.", data :{balance : nuserData.point_balance}})
                }
            })

        })
    }
    else
    {

    
    NCommonFile.nuser_check_authWithData(req.headers.token , function(err , nuserData){
        if(err)
        {
            res.send({status : 0 , msg : err})
        }
        else
        {
            let type  = req.body.type // 1 for self , 2 for referel
            
            if(type == 1)// self earning points
            {
                Nuser_Wallet.find({user_id : nuserData._id, wallet_type : 1 , details_type : type} , function(err , nuser_wallet)
                {
                    if(err)
                    {
                        res.send({status : 0 , msg : err})
                    }
                    else
                    {
                        res.send({status : 1 , msg : "points wallet listed successfully .", data :nuser_wallet})
                    }
                }).sort( { cdate: -1 } )
            }
            else
            if(type == 2) // referel bonus
            {
                Nuser_Wallet.aggregate([
                    { 
                        "$lookup" : {
                            "from" : "nusers", 
                            "localField" : "details_id", 
                            "foreignField" : "_id", 
                            "as" : "user"
                        }
                    }, 
                    { 
                        "$match" : {
                            "user_id" : ObjectId(nuserData._id), 
                            "details_type" : 3
                        }
                    }, 	
                    { 
                        "$sort" : {
                            "cdate" : -1
                        }
                    }, 
                    { 
                        "$unwind" : "$user"
                    }
                ],function(err ,walletData ){
                    if(err)
                    {
                        res.send({status : 0 , msg : err})
                    }
                    else
                    {
                        res.send({status : 1 , msg : "Referel Wallet listed .", data :walletData})
                    }
                })
            }
            else
            if(type == 3)
            {
             //   var day=dateFormat(new Date(), "yyyy-mm-dd");
                //var day=dateFormat(new Date(new Date().setDate(new Date().getDate()+1)), "yyyy-mm-dd");
             //   var day1=dateFormat(new Date(new Date().setDate(new Date().getDate()+1)), "yyyy-mm-dd");
                //console.log(day)
                //console.log(day1)
                //console.log({user_id : nuserData._id, wallet_type : 1 , details_type : type ,"cdate" : { $lt: new Date(day1+"T00:00:00Z").toISOString(), $gte: new Date(day+"T00:00:00Z").toISOString() }})
                
                Nuser_Wallet.aggregate([
                    { 
                        "$lookup" : {
                            "from" : "adshow_histories", 
                            "localField" : "details_id", 
                            "foreignField" : "_id", 
                            "as" : "referel"
                        }
                    }, 
                    { 
                        "$unwind" : "$referel"
                    }, 
                    { 
                        "$match" : {
                            "user_id" :  ObjectId(nuserData._id), 
                            "wallet_type" : 1, 
                            "details_type" : 2
                           // ,
                          //  "cdate" : { "$lt":  new Date(day1+"T00:00:00Z"), "$gte": new Date(day+"T00:00:00Z") }
                            //"cdate" : { "$lt":  new ISODate(new Date(day1+"T00:00:00Z").toISOString()), "$gte": new  ISODate(new Date(day+"T00:00:00Z").toISOString()) }
                        }
                    }, 
                    { 
                        "$lookup" : {
                            "from" : "nusers", 
                            "localField" : "referel.nuser_id", 
                            "foreignField" : "_id", 
                            "as" : "user"
                        }
                    }, 
                    { 
                        "$unwind" : "$user"
                    }, 
                    { 
                        "$lookup" : {
                            "from" : "admasters", 
                            "localField" : "referel.advertise_id", 
                            "foreignField" : "_id", 
                            "as" : "advertise"
                        }
                    }, 
                    { 
                        "$unwind" : "$advertise"
                    }, 
                    { 
                        "$project" : {
                            "point" : 1,
                            "ispoint_temp":1,
                             "level_point":1,
                            "user.mobile_number" : 1, 
                            "user.myCode" : 1,
                            "advertise.adtype_id" : 1,
                            "cdate" : 1
                        }
                    },
                    { 
                        "$sort" : {
                            "cdate" : -1.0
                        }
                    }
                ],function(err , walletData){
                    //console.log(walletData)
                    //console.log('-- test --')
                    //console.log({ $lt: new Date(day1+"T00:00:00Z").toISOString(), $gte: new Date(day+"T00:00:00Z").toISOString() })
                    if(err)
                    {
                        res.send({status : 0 , msg : err})
                    }
                    else
                    {
                        res.send({status : 1 , msg : "downline earning listed .", data :walletData})
                    }
                })//.sort( { cdate: -1 } )
               /* Nuser_Wallet.find({user_id : new ObjectId(nuserData._id), wallet_type : 1 , details_type : type ,"cdate" : { $lt: new Date(day1+"T00:00:00Z").toISOString(), $gte: new Date(day+"T00:00:00Z").toISOString() }} , function(err , nuser_wallet)
                {
                    if(err)
                    {
                        res.send({status : 0 , msg : err})
                    }
                    else
                    {
                        res.send({status : 1 , msg : "points wallet listed successfully .", data :nuser_wallet})
                    }
                }).sort( { cdate: -1 } ) */
            }
            
            //console.log(nuserData)
            //res.send({status : 1 , msg : "points successfully get.", data :{balance : nuserData.point_balance}})
        }
    })
    }
}

exports.admin_edit_balance = function(req , res)
{
    CommonFile.admin_auth(req.headers.token , (err , value)=>{
        if(err)
        {
            res.status(401).send({status : 0 , msg : err})
        }
        else
        {
            Nuser.findOne({_id : ObjectId(req.body.user_id)},function(errt ,nuserData){

                if(nuserData)
                {
                    let point = req.body.point
                    let is_minus = req.body.is_debit ; // debit = true , credit = false
                    let nda = new Date()

                    let new_point = 0

                   // if(point < 0)
                   // is_minus = true

                    if(is_minus)
                    {
                        new_point =  nuserData.point_balance - point

                        if(nuserData.point_balance < point)
                        return res.send({status : 0 , msg : "point should not more then balance"})
                    }
                    else
                    {
                        new_point =  nuserData.point_balance + point
                    }

                    let wallet = new Nuser_Wallet({
                        user_id :nuserData._id,
                        wallet_type: is_minus ? 2 : 1,// 1 for credit 2 for debit
                        details_type: 5,// credit ( 1 for advertise self, 2 for advetise downline, 3 for referel , 4 refund(withdrow reject) , 5 bonus), debit (1 for withdrow)
                        advertise_type : -5 ,// ad type 1 for banner , 2 for half banner , 3 for full screen 
                       // details_id: {type: Schema.Types.ObjectId,ref: 'AdMaster'},// credit (Online table_id , Refund (advertise id ) , debit (advertise id)
                        old_point: nuserData.point_balance ,
                        new_point: new_point,
                        point:point,
                        //level_point:{type : Number},
                        //ispoint_temp :{type : Number},
                        status_msg:req.body.desc,
                        cdate:nda
                    })
                    wallet.save(function(er , walletdata){
                        if(er)
                        return res.send({status : 0 , msg :"save error in wallet -- "+err})
                        else
                        {
                            Nuser.findOneAndUpdate({_id : ObjectId(req.body.user_id)},{$set :{point_balance:new_point}} , function(err , nuseD){
                                if(nuseD)
                                {
                                    return res.send({status : 1 , msg : "Balance Updated"})
                                }
                                else
                                {
                                    return res.send({status : 0 , msg : "Contact Xona support developer."})
                                }
                            })
                        }
                    })

                }
                else
                {
                    res.send({status : 0 , msg:"NO user found , contact xona developer support."})
                }
            })
        }
    })
}