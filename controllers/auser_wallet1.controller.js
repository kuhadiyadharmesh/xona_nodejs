const Wallet = require('../models/auser_wallet.model')
const User = require('../models/user.model');
ObjectId = require('mongodb').ObjectID;
const CommonFile = require('../constant.js');


exports.credit_balance = function(req , res)
{
    //{"user_id":"5bfbbe52dfd6ee141037e8d8","charge_amount":15,"old_balance":10,"credit_type":2,"c_type_id":""}
   let user_id = req.body.user_id;
   let charge_amount = req.body.charge_amount;
   let old_balance = req.body.old_balance;
   let c_type = req.body.credit_type// 1 for online , 2 for admin add , 3 for refund from ad.
   let c_type_id = req.body.c_type_id;
   let pay_from = req.body.pay_from;
   User.findOne({_id:user_id},function(err,user){
       if(err)
       {
       }
       else
       {
            //user_ = user;
            console.log(user.wallet_balance)
            console.log(old_balance)
            if(user.wallet_balance == old_balance)
            {
                //CommonFile.wallat_balance_charge(JSON.stringify({user_id:user_id,type: 2,c_type:c_type,amount:charge_amount,c_type_id:c_type_id ,pay_from: 1, old_balance:old_balance,is_coupon:is_coupon,coupon_code:coupon_code,bonus_amount:bonus_amount , total_used : userd_count}),(error, value) =>
                CommonFile.wallat_balance_charge(JSON.stringify({user_id:user_id,type: 1,c_type:c_type,amount:charge_amount,c_type_id:c_type_id ,pay_from:pay_from, old_balance:old_balance,is_coupon:false,coupon_code:"",bonus_amount:0 , total_used : 0}),(error, value) =>
                    {
                        if(error)
                        {
                            //console.log(error);
                            res.send({status: 0,msg :error})
                        }
                        else
                        {
                            console.log(value);
                            res.send({status:1,msg:"Wallet balance added."})
                        }
                    })
             }
                else
                {
                   res.send({status: 0,msg :"amount not matched."})
                    // balance problem (user table current wallet balance & // service request current wallet balance not same)
                }
       }
   })
}
exports.debit_balance = function(req , res)
{
    let user_id = req.body.user_id;
    let charge_amount = req.body.charge_amount;
    let old_balance = req.body.old_balance;
    let c_type = req.body.credit_type// 1 for from ad.
    let c_type_id = req.body.c_type_id;
    let pay_from = req.body.pay_from;
    //let current_date = new Date();
    // console.log(req.body);
    //let user_ = "";
    User.findOne({_id:user_id},function(err,user){
        if(err)
        {
        }
        else
        {
             //user_ = user;
             if(user.wallet_balance == old_balance && old_balance > charge_amount)
             {
                     CommonFile.wallat_balance_charge(JSON.stringify({user_id:user_id,type: 2,c_type:c_type,amount:charge_amount,c_type_id:c_type_id ,pay_from:pay_from , old_balance:old_balance}),(error, value) =>
                     {
                         if(error)
                         {
                             //console.log(error);
                             res.send({status: 0,msg :error})
                         }
                         else
                         {
                            // console.log(value);
                             res.send({status:1,msg:"Wallet balance updated."})
                         }
                     })
              }
                 else
                 {
                    res.send({status: 0,msg :"amount not matched."})
                     // balance problem (user table current wallet balance & // service request current wallet balance not same)
                 }
        }
    })
}

exports.get_wallet_balance = function(req , res)
{
    CommonFile.check_authWithData(req.headers.token ,(error , value) =>
    {
        if(error)
        {
            res.send({status: 0 , msg : error})
        }
        else
        {
            let balance = roundToTwo(value.wallet_balance)
            res.send({status:1 , msg : "Balance get .",data:{"wallet_balance" : balance}})
        }
    })
}

exports.get_transaction_history = function(req , res)
{
    let params = req.query;
    let limit = Number(params.maxRecords);
    let frm = Number(params.startFrom);
    let type  =  params.type // 1 for transaction , 2 for order

    CommonFile.check_authWithId(req.headers.token ,(error , value) =>
    {
        console.log(value);
        if(error)
        {
            res.send({status : 0 , msg :error})
        }
        else
        {
           // let t_data = 0;
           if(type == 1)
           {
            Wallet.count({user_id : new Object(value)},function(err,cou){if (err) {res.send({status : 0 , msg :"Something went wrong."})} else 
            {
               Wallet.aggregate([{ 
                "$match" : {
                    "user_id" : value
                }
                }, 
                { 
                    "$lookup" : {
                        "from" : "admasters", 
                        "localField" : "details_id", 
                        "foreignField" : "_id", 
                        "as" : "ad_details"
                    }
                },
                    { 
                        "$lookup" : {
                            "from" : "atransactiondetails", 
                            "localField" : "details_id", 
                            "foreignField" : "_id", 
                            "as" : "details_data"
                        }
                    },{ 
                        "$limit" : limit
                    },{
                        "$skip" : frm
                    }
                    ]).then(function(result ,err )
                    {
                        res.send({status : 1 , msg :"Wallet history" , data:result , p_count:cou}) 
                    })
                }
            });
               /*
               
               */
                /*
                Wallet.count({user_id : new Object(value)},function(err,cou){if (err) {res.send({status : 0 , msg :"Something went wrong."})} else 
                {
                    Wallet.find({user_id : value},function(err , wallet){
                        if(err){res.send({status : 0 , msg :"Something went wrong."})}
                        else
                        {
                            //console.log(wallet);
                            res.send({status : 1 , msg :"Wallet history" , data:wallet , p_count:cou})
                        }
                    }).skip(frm).limit(limit);
                }
                });
                */
           }
            else
            {
                Wallet.count({user_id : new Object(value) , wallet_type:2 , details_type : 1},function(err,cou){if (err) {res.send({status : 0 , msg :"Something went wrong."})} else 
                {
                    Wallet.aggregate([{ 
                        "$match" : {
                            "user_id" : value ,
                            "wallet_type" : 2
                        }
                        }, 
                        { 
                            "$lookup" : {
                                "from" : "admasters", 
                                "localField" : "details_id", 
                                "foreignField" : "_id", 
                                "as" : "ad_details"
                            }
                        },{ 
                                "$limit" : limit
                            },{
                                "$skip" : frm
                            }
                            ]).then(function(result ,err )
                            {
                                res.send({status : 1 , msg :"Wallet history" , data:result , p_count:cou}) 
                            })
                        } 
                    /*
                    Wallet.find({user_id : value , wallet_type:2 , details_type : 1},function(err , wallet){
                        if(err){res.send({status : 0 , msg :"Something went wrong."})}
                        else
                        {
                            //console.log(wallet);
                            res.send({status : 1 , msg :"Wallet history" , data:wallet , p_count:cou})
                        }
                    }).skip(frm).limit(limit);

                    */
                
                });
            }
        }
    })
}

function roundToTwo(num) {    
    return +(Math.round(num + "e+3")  + "e-3");
}

/*
function balance_update(djson , callback)
{
    //console.log(djson)
    let current_date = new Date();
    let json = JSON.parse(djson);
    let new_balance = 0
    if(json.type == 1)
    new_balance = json.old_balance + json.update_amount
    else
    new_balance = json.old_balance - json.update_amount

    let wallet = new Wallet({
        user_id : new ObjectId(json.user_id),
        wallet_type:json.type,// 1 for credit 2 for debit
        details_type: json.c_type,// credit ( 1 for online , 2 for delete(refund)) , debit (1 for adpost)
       // details_id:json.c_type_id,// credit (Online table_id , Refund (advertise id ) , debit (advertise id)
        old_balance:json.old_balance,
        new_balance:new_balance,
        amount:json.update_amount,
        status_msg:"",
        cdate:current_date
    })

    //console.log(wallet);
    wallet.save(function(err)
    {
        if(err){
            //console.log(err.message);
            callback(new Error("wallet table update err").message)
            Wallet.findByIdAndRemove({_id : wallet._id},function(err){});
            
        }
        else
        {
            
            let w_id = wallet._id;
            //console.log(w_id);
            User.findByIdAndUpdate(json.user_id,{$set : {wallet_balance:new_balance , wallet_last_id: new ObjectId(w_id) , update_date:current_date}},function(err,user){
                if(err)
                {
                    //console.log(err.message)
                    callback(new Error("User table update err").message)
                }
                else
                {
                    //console.log(true);
                    callback(null, true)
                }

            })
        }
    })
    
}*/