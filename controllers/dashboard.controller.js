const Admaster = require('../models/adMaster.model');
const CommonFile = require('../constant')
var dateFormat = require('dateformat');

const Nuser = require('../models/nuser_model/nuser.model')
//const Target_History = require('../models/target_history.model')
const Nuser_Wallet = require('../models/nuser_wallet.model')

const Auser = require('../models/user.model')
const Auser_Wallet = require('../models/auser_wallet.model')

exports.show_dashboard = function(req , res)
{
    CommonFile.check_authWithData(req.headers.token , function(err , userData){
        if(err)
        {
           return res.status(401).send({status : 0  , msg : err})
        }
        else
        {
            Admaster.count({advertiser_id : userData._id},function(err , cnt){
                if(err)
                {
                   return res.send({status : 0 , msg : err})
                }
                else
                {
                    if(cnt == 0)
                    {
                       return res.send({status : 1 , msg : "not data found." , data :{total : 0 , active :0 , balance : userData.wallet_balance} })
                    }
                    else
                    {
                        Admaster.count({advertiser_id : userData._id ,is_approve : true ,is_status: 1} , function(err , cnt_active){
                            if(err)
                            {
                               return res.send({status : 0 , msg : err})
                            }
                            else
                            {
                               return res.send({status : 1 , msg : "data get successfully." , data :{total : cnt , active :cnt_active , balance : userData.wallet_balance} })
                            }
                        })
                        
                    }
                }
            })//.find({advertiser_id : userData._id}, function()).count()
        }
    })
}

/*
exports.admin_dashboard_data = function(req , res)
{
    res.send({
        "enduser_total": 845,
        "enduser_verify": 628,
        "active_enduser": 9,
        "total_self_points": 156651,
        "total_downline_points": 0,
        "total_referel_points": 2893650,
        "total_ads": 49,
        "active_ads_total": 8,
        "total_collection": 51770.7,
        "total_spent": 45005.7,
        "total_withdraw": 0
    })
}
*/

exports.admin_dashboard_data = function(req , res)
{
    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        return res.status(401).send({status : 0})

        Nuser.find({is_verify : true},function(err , nuserData)
        {
            let total_enduser = nuserData.length
            let verify_enduser = 0 
            let active_enduser = 0
            let total_self_points = 0
            let total_referel_points = 0
            let total_downline_points = 0
            let ads_total = 0
            let active_ads_total = 0

            let total_in_money  = 0
            let total_spent_money = 0

            let total_withdraw = 0

            /*var day_i=dateFormat(new Date(new Date().setDate(new Date().getDate()-1)), "yyyymmdd");
            Target_History.count({achive_target : {$gte : 1} , target_date:day_i},function(err , targ)
            {
                if(err)
                {
                    return res.send({status : 0 , msg :  err})
                }
                else
                {
                    active_enduser = targ */
                    active_enduser = 0

                    Nuser_Wallet.aggregate([
                        { 
                            "$match" : {
                                //"user_id" : ObjectId("5c3466dd811f52113452adbc"), 
                                "wallet_type" : 1, 
                                "details_type" : 1
                            }
                        }, 
                        { 
                            "$group" : {
                                "_id" : null, 
                                "totalAmount" : {
                                    "$sum" : "$point"
                                }
                            }
                        }
                    ],function(err , nwallet)
                    {
                        if(err){
                            return res.send({status : 0 , msg :  err})
                        }
                        else
                        {
                            total_self_points = nwallet[0].totalAmount
                            Nuser_Wallet.aggregate([
                                { 
                                    "$match" : {
                                        //"user_id" : ObjectId("5c3466dd811f52113452adbc"), 
                                        "wallet_type" : 1 , 
                                        "details_type" : 3
                                    }
                                }, 
                                { 
                                    "$group" : {
                                        "_id" : null, 
                                        "totalAmount" : {
                                            "$sum" : "$point"
                                        }
                                    }
                                }
                            ],function(err , nwallet1)
                            {
                                if(err)
                                return res.send({status : 0 , msg :  err})
                                
                                total_referel_points = nwallet1[0].totalAmount
                                Admaster.find({ is_approve: { $ne: 2 } }, function(err , adData)
                                {
                                    if(err)
                                    {
                                        return res.send({status : 0 , msg :  err})
                                    }
                                    else
                                    {
                                        
                                        ads_total = adData.length
                                        
                                        nuserData.forEach(element =>
                                            {
                                                if(element.is_approve == 1)
                                                {
                                                    verify_enduser = verify_enduser + 1
                                                }
                        
                                            })
                                        adData.forEach(element =>{
                                            if(element.is_status == 1)
                                            {
                                                active_ads_total = active_ads_total + 1
                                            }
                                        })
                                        Auser_Wallet.aggregate([
                                            { 
                                                "$match" : {
                                                    "wallet_type" : 1, 
                                                    "details_type" : 1
                                                }
                                            }, 
                                            { 
                                                "$group" : {
                                                    "_id" : null, 
                                                    "total_sum" : {
                                                        "$sum" : "$amount"
                                                    }
                                                }
                                            }
                                        ],function(err , ausewallet){
                                            if(err)
                                            return res.send({status : 0 , msg :  err})

                                            total_in_money = ausewallet[0].total_sum
                                            Auser_Wallet.aggregate([
                                                { 
                                                    "$match" : {
                                                        "wallet_type" : 2, 
                                                        "details_type" : 1
                                                    }
                                                }, 
                                                { 
                                                    "$group" : {
                                                        "_id" : null, 
                                                        "total_sum" : {
                                                            "$sum" : "$amount"
                                                        }
                                                    }
                                                }
                                            ],function(err , spent_balance){
                                                if(err)
                                                return res.send({status : 0 , msg :  err})

                                                total_spent_money = spent_balance[0].total_sum

                                                return res.send({enduser_total : total_enduser ,enduser_verify : verify_enduser , active_enduser : active_enduser , total_self_points : total_self_points , 
                                                    total_downline_points : total_downline_points , total_referel_points : total_referel_points , 
                                                    total_ads : ads_total , active_ads_total : active_ads_total , total_collection : total_in_money, total_spent : total_spent_money ,total_withdraw : total_withdraw})
                                            })
                                        })
                                    }
                                })
                                
                            })
                        }
                    })
               // }
           // })
        
        })
    })
    
}

