const NCommonFile = require('../nconstant')
const CommonFile = require('../constant')
ObjectID = require('mongodb').ObjectID;
const Withdraw = require('../models/withdraw_request.model')
const Nuser_Wallet = require('../models/nuser_wallet.model')
const NUser = require('../models/nuser_model/nuser.model')
var dateFormat = require('dateformat');
var Excel = require('exceljs');
var uniqid = require('uniqid');

exports.check_withdraw_validation = function(req , res)
{
    
}
exports.add_withdraw_request = function(req , res)
{
    NCommonFile.nuser_check_authWithData(req.headers.token , (err , nuserData)=>{
        if(err)
        {
           return res.status(401).send({status : 0 , msg : err})
        }
        else
        {
            // check profile from
            NCommonFile.nuser_check_profile(req.headers.token , req.body.type , (err , percent_profile)=>
            {
                if(err)
                {
                  return  res.send({status : 0 , msg : err + "\n profile complete : "+percent_profile + "  need 100% profile complete."})
                }
                else
                {
                    let data = req.body ;
                    let points = data.points;
                    var day_i=dateFormat(new Date(new Date().setDate(new Date().getDate())), "yymmdd");
                    if(nuserData.point_balance >= points)
                    {
                        // get point from database
                        NCommonFile.withdraw_point_validation(points , (err , withData)=>
                        {
                            if(err)
                            {
                              return  res.send({status : 0 , msg : err})
                            }
                            else
                            {
                                console.log(withData)
                                let point_to = withData.point_to
                                let money_to = withData.money_to
                                let charge = withData.charge

                                let ddt = new Date()

                                let w_money = (points * money_to)/point_to
                                let c_money = (w_money * charge)/100
                                let f_amount = (w_money * (100-charge))/ 100

                                let paytm_mobile = ""
                                if(req.body.type == 2)
                                    paytm_mobile = req.body.mobile_no
                                
                                
                                let withdraw = new Withdraw({
                                    show_id : "WID-"+Math.floor(10000 + Math.random() * 90000)+day_i,
                                    user_id:nuserData._id,
                                    //admin_id:{type: Schema.Types.ObjectId,ref: 'Admin'},

                                    points_to_withdraw : points ,
                                    money_to_withdraw :w_money,

                                    charge_flag :charge,
                                    fmoney_to_withdraw :f_amount,
                                    money_to_charge :c_money,

                                    transaction_type : req.body.type,
                                    paytm_mobile : paytm_mobile,
                                    mobile_number_paytm : paytm_mobile,

                                    is_autoapprove : false,// if auto approve 
                                    is_status:0, // 0 incomplete , 1 complete ,  2 reject
                                    is_approve:0,//0 waiting_for_approval , 1 approve , pending , transfer   
                                    is_refund : false,
                                    //transaction_reference : {type : String},

                                   // des: {type: String},
                                    cdate:ddt,
                                    udate:ddt
                                })
                                NUser.findOneAndUpdate({_id : nuserData._id , point_balance : nuserData.point_balance},{$set : {point_balance : (nuserData.point_balance - points) , update_date: ddt }} , function(err , nuser){
                                    if(err)
                                    {
                                       return res.send({status : 0  , msg : "something went wrong ...", err : err.message}) 
                                    }
                                    else
                                    {
                                        if(nuser)
                                        {
                                            withdraw.save(function(err , withdraw)
                                            {
                                            if(err)
                                            {
                                            return  res.send({status : 0 , msg : err})
                                            }
                                            else
                                            {
    
                                                let old_point = nuserData.point_balance;
                                                let new_point = old_point - points
                                                // let 
    
                                                let wallet = new Nuser_Wallet({
                                                    user_id : nuserData._id,
                                                    wallet_type:2,// 1 for credit 2 for debit
                                                    details_type: 1,// 
                                                    advertise_type : -1 ,//  -1 for othes ,  ad type 1 for banner , 2 for half banner , 3 for full screen 
                                                    details_id: withdraw._id,// credit (Online table_id , Refund (advertise id ) , debit (advertise id)
                                                    old_point:old_point,
                                                    new_point:new_point,
                                                    point: points,
                                                    status_msg:"withdraw request sent",
                                                    cdate:ddt
                                                })
                                                //f_balance = new_amount
                                                wallet.save(function(err , wallt1)
                                                {
                                                    console.log(wallt1)
                                                    if(err)
                                                    {
                                                        return  res.send({status : 0  , msg : "something went wrong ...", err : err.message})
                                                    }
                                                    else
                                                    {
                                                        return res.send({status : 1 , msg :"Withdraw request successfully sent , will update you." , data : withdraw})
                                                    }
                                                    
                                                })
                                            
                                            }
                                            })
                                        }
                                        else
                                        {
                                            return res.send({status : 0  , msg : "balance not available .", err : "multiple problem."}) 
                                        }
                                        //res.send({ status : 1 , msg : "Adshow successfully balance credited in your account."+err , data : "" });  
                                    }
                                })
                            }
                        })
                    }
                    else
                    {
                       return res.send({status : 0 , msg : "insufficient points in your wallet , or Points not matched."})
                    }
                }
            })
        }
    })
}
exports.get_withdraw_list = function(req , res)
{
   
    let params = req.query;
    let limit = Number(params.maxRecords);
    let frm = Number(params.startFrom);
    let type = Number(params.type);
    let enduser_id = params.enduser_id
    let search_data = params.search_data
    CommonFile.admin_auth(req.headers.token , (err , value)=>{

        if(err)
        {
           return res.status(401).send({status : 0 , msg : err})
        }
        else
        {
            let query = {}
            // 

            if(type == 1)// waiting for approve
            {
                 query = {is_status : 0 , is_approve : 0}
            }
            else if (type == 2) // approved
            {
                query = {is_status : 0 , is_approve : 1}
            }
            else if (type == 22) // approved BANK
            {
                query = {is_status : 0 , is_approve : 1 ,transaction_type : 1 , is_automatic : false}
            }
            else if (type == 23) // approved PAYTM
            {
                query = {is_status : 0 , is_approve : 1,transaction_type : 2 , is_automatic : false}
            }
            else if (type == 24) // approved PAYTM
            {
                query = {is_status : 0 , is_approve : 1, is_automatic : true}
            }
            else if (type == 3) // complete for payment
            {
                query = {is_status : 0 , is_approve : 2}
            }
            else if (type == 32) // complete for BANK
            {
                query = {is_status : 1 , is_approve : 2 , transaction_type : 1, is_automatic : false}
            }
            else if (type == 33) // complete for PAYTM
            {
                query = {is_status : 1 , is_approve : 2 , transaction_type : 2 , is_automatic : false}
            }
            else if (type == 34) // complete for PAYTM
            {
                query = {is_status : 1 , is_approve : 2 ,  is_automatic : true}
            }
            /*else if (type == 4) // complete
            {
               query = {is_status : 1 , is_approve : 3}
            }
            else if (type == 42) // complete for BANK
            {
                query = {is_status : 1 , is_approve : 3 , transaction_type : 1}
            }
            else if (type == 43) // complete for PAYTM
            {
                query = {is_status : 1 , is_approve : 3 , transaction_type : 2}
            }*/
            else if (type == 5) // reject
            {
                query = {is_status : 2}
            }

            if(enduser_id == undefined)
            {}
            else
            {
                query["user_id"] = ObjectID(enduser_id)
            }

            query["$or"] = [{'show_id': new RegExp(search_data, 'i')} , {'enddata.mobile_number': new RegExp(search_data, 'i')}]


            Withdraw.count(query,function(err,cou){if (err) {} else {t_data= cou;

                Withdraw.aggregate([
                    { 
                        "$lookup" : {
                            "from" : "nusers", 
                            "localField" : "user_id", 
                            "foreignField" : "_id", 
                            "as" : "enddata"
                        }
                    }, 
                    { 
                        "$match" : query
                    }, 
                    { 
                        "$sort" : {
                            "cdate" : -1
                        }
                    }, 
                    { 
                        "$skip" : frm
                    }, 
                    { 
                        "$limit" : limit
                    },{ 
                        "$unwind" : {
                            "path" : "$enddata"
                        }
                    }
                ],function(err , withdrawData)
                {
                    if (err)
                        return  res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
                    else
                    {
                      return  res.send({ status : 1 , msg : "listed successfully.","p_count": t_data, data :withdrawData});
                    }
                })
                /*
                Withdraw.find(query,function(err,withdrawData){
                    if (err)
                  return  res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
                    else
                    {
                      return  res.send({ status : 1 , msg : "listed successfully.","p_count": t_data, data :withdrawData});
                    }

                }).count().sort( { cdate: -1 } ).skip(frm).limit(limit); 
                */
            }});
        }
    }) 
}
exports.get_withdraw_list_foruser = function(req , res)
{
  /*  if(req.body.type == 2)
    {
        let params = req.query;
        let limit = Number(params.maxRecords);
        let frm = Number(params.startFrom);
        let flag = Number(params.flag);
        CommonFile.admin_auth(req.headers.token , (err , value)=>
        {
            if(err)
            {
               return res.status(401).send({status : 0, msg :err})
            }
            else
            {
                if(req.body.flag == 1)
                {
                    Withdraw.find({user_id : req.body.enduser_id}, function(err , withdrawdata){
                        if(err)
                        {
                           return res.send({status : 0 , msg: err})
                        }
                        else
                        {
                          return  res.send({status : 1 , msg : "Withdraw list listed successfully." , data :withdrawdata})
                        }
                    }).sort( { cdate: -1 } )
                }
                else
                if(req.body.flag == 2)
                {
                    Withdraw.find({user_id : req.body.enduser_id}, function(err , withdrawdata){
                        if(err)
                        {
                           return res.send({status : 0 , msg: err})
                        }
                        else
                        {
                          return  res.send({status : 1 , msg : "Withdraw list listed successfully." , data :withdrawdata})
                        }
                    }).sort( { cdate: -1 } )
                }
                else
                if(req.body.flag == 3)
                {
                    Withdraw.find({user_id : req.body.enduser_id}, function(err , withdrawdata){
                        if(err)
                        {
                           return res.send({status : 0 , msg: err})
                        }
                        else
                        {
                          return  res.send({status : 1 , msg : "Withdraw list listed successfully." , data :withdrawdata})
                        }
                    }).sort( { cdate: -1 } )
                }
                else if(req.body.flag == 4)
                {
                    Withdraw.find({user_id : req.body.enduser_id}, function(err , withdrawdata){
                        if(err)
                        {
                           return res.send({status : 0 , msg: err})
                        }
                        else
                        {
                          return  res.send({status : 1 , msg : "Withdraw list listed successfully." , data :withdrawdata})
                        }
                    }).sort( { cdate: -1 } )
                }
               
               
            }
        })
    }
    else
    {*/
        NCommonFile.nuser_check_authWithData(req.headers.token , (err , nuserData)=>
        {
            if(err)
            {
               return res.status(401).send({status : 0, msg :err})
            }
            else
            {
                Withdraw.find({user_id : nuserData._id}, function(err , withdrawdata){
                    if(err)
                    {
                       return res.send({status : 0 , msg: err})
                    }
                    else
                    {
                      return  res.send({status : 1 , msg : "Withdraw list listed successfully." , data :withdrawdata})
                    }
                }).sort( { cdate: -1 } )
            }
        })
   // }
}
// approve 0r reject
exports.withdraw_step_one = function(req , res)
{// {"withdraw_ids":["",""],"is_approve":true}
    let data = req.body;

    let ids_ = data.withdraw_ids
    let is_approve = data.is_approve 
    let is_ap = 1 
    let status = 0
    let desc = ""
    let is_refund_flag = false

    let is_automatic = false
    
    
    if(is_approve == false)
    {
        desc = data.desc;
        status = 2
        is_ap = 0
        is_refund_flag = true
    }
    else
    {
        if (req.body.is_automatic == true)
        {
            is_automatic = true
        }
    }

    //-- save to activity about this

    let ddt = new Date()
    CommonFile.admin_auth_withData(req.headers.token , (err , adminData)=>
    {
        if(err)
        {
           return res.status(401).send({status : 0 , msg : err})
        }
        else
        {
            let dat = new Date()
            //Withdraw.updateMany
            Withdraw.aggregate( [
                { 
                    "$lookup" : {
                        "from" : "nusers", 
                        "localField" : "user_id", 
                        "foreignField" : "_id", 
                        "as" : "outar"
                    }
                }, 
                { 
                    "$match" : {
                        "is_status" : 0, 
                        "is_approve" : 0,
                        "is_refund" : false ,
                        "_id" : {"$in":ids_.map(ObjectID)}
                    }
                }, 
                { 
                    "$replaceRoot" : {
                        "newRoot" : {
                            "$mergeObjects" : [
                                {
                                    "$arrayElemAt" : [
                                        "$outar", 
                                        0.0
                                    ]
                                }, 
                                "$$ROOT"
                            ]
                        }
                    }
                }, 
                { 
                    "$project" : {
                        "outar" : 0.0
                    }
                }
            ],function(err , result)
                {
                   // console.log(result.count())
                   //return res.send({status : 0 , msg : "error",data : result})
                    if(err)
                   return res.send({status : 0 , msg : "error"})
                    else
                    {
                        let withdraw_ids = []
                        
                        result.forEach(element =>{
                            withdraw_ids.push(element._id)
                        })
    
                        Withdraw.update({_id :{$in :withdraw_ids.map(ObjectID)}},{$set :{is_approve : is_ap , is_status : status , des : desc ,is_refund : is_refund_flag ,is_pay_process : 0 , is_automatic : is_automatic, udate : dat}},{multi: true },function(err , updates)
                        {
                            if(updates.nModified > 0 )
                            {
                                if(is_approve == false)
                                {
                                    //let i = 0 
                                    result.forEach(element =>{
            
                                        let o_point = element.point_balance
                                        let a_point = element.points_to_withdraw
                                        let n_point = o_point + a_point
                
                                        let wallet = new Nuser_Wallet({
                                            user_id :element.user_id,
                                            wallet_type:1,// 1 for credit 2 for debit
                                            details_type: 4,// credit ( 1 for advertise self, 2 for advetise referel, 3 for bonus , 4 refund(withdrow reject)), debit (1 for withdrow)
                                            advertise_type : -1 ,// ad type 1 for banner , 2 for half banner , 3 for full screen 
                                            details_id: element._id,// credit (Online table_id , Refund (advertise id ) , debit (advertise id)
                                            old_point:o_point,
                                            new_point:n_point,
                                            point:a_point,
                                            status_msg:"Withdraw Request Rejected.",
                                            cdate:ddt
                                        })
                                        wallet.save(function(err , wall_record){
                                            if(err)
                                            {
                                                //-- save to activity table
                                               return res.send({status : 0 , msg : "error"})
                                            }
                                            else
                                            {
                                                NUser.findOneAndUpdate({_id : element.user_id},{$set : {point_balance : n_point , update_date: ddt}} , function(err , nuserupdate)
                                                {
                                                    //i = i + 1
                                                    if(nuserupdate)
                                                    {
                                                        //res.send({status : 1 ,msg :"Records updated successfully!! and points refund to end user's wallets."}) 
                                                        //if(i == reslt.count)
                                                    }
                                                    else
                                                    {
                                                        // -- save to activity table
                                                       return res.send({status : 0 , msg : "error"})
                                                    }
                                                })
                                            }
                                        })
                                        
                                    })
                                   return res.send({status : 1 ,msg :"Records updated successfully!! and points refund to end user's wallets."})
                                }
                                else
                                {
                                  return  res.send({status : 1 ,msg :"Records updated successfully!!"})  
                                }
                            }
                            else
                            {
                              return  res.send({status : 0 , msg : "Records not updated!! or Something went wrong !!.."})
                            }
                        }) 
                    }
                    //console.log(result)
                    //
            })
        }
    })
}
exports.withdraw_final_manual_step = function(req , res)
{
    let req_data = req.body
 
    CommonFile.admin_auth_withData(req.headers.token , (err , adminData)=>{
        if(err)
        {
           return res.status(401).send({status : 0 , msg : err})
        }
        else
        {
            let withdraw_id = req_data.withdraw_id 
            let transaction_reference = req_data.transaction_reference

            Withdraw.findOneAndUpdate({_id : withdraw_id , is_approve : 1 , is_status : 0 , is_automatic : true , is_pay_process : 0 ,is_refund : false },
                {$set :{transaction_reference : transaction_reference ,is_status : 1 , is_approve:2 ,is_pay_process:2}},function(err, finish_data){
                if(err)
                {
                    res.send({status : 0 , msg : 'error -- '+err})
                }
                else
                {
                    if(finish_data)
                    res.send({status : 1 , msg : "Withdraw request successfully updated ."})
                    else
                    res.send({status : 0 , msg : "Withdraw request Record not found."})
                }
            })
        }
    })
    

}

exports.withdraw_final_manual_step_reject = function(req , res)
{
    let req_data = req.body
    let ddt = new Date()
    CommonFile.admin_auth_withData(req.headers.token , (err , adminData)=>{
        if(err)
        {
           return res.status(401).send({status : 0 , msg : err})
        }
        else
        {
            let withdraw_id = req_data.withdraw_id 
            let des = req_data.des

           // let transaction_reference = 

            Withdraw.findOneAndUpdate({_id : ObjectID(withdraw_id) , is_approve : 1 , is_status : 0 , is_automatic : true , is_pay_process : 0, is_refund : false},{$set :{des : des ,is_status : 2 , is_approve:1 ,is_pay_process:0 , is_refund : true}},function(req, finish_data){
                if(err)
                {
                    res.send({status : 0 , msg : 'error -- '+err})
                }
                else
                {
                    if(finish_data)
                    {
                        NUser.findOneAndUpdate({_id : finish_data.user_id},{$inc : {point_balance: finish_data.points_to_withdraw}},function(err , nuserData)
                        {
                            if(err)
                            {
                                res.send({status : 0 , msg : 'to add balance in Nusers table - error '+finish_data.user_id+'-- '+err})
                            }
                            else
                            {
                                console.log(nuserData)
                                            let o_point = nuserData.point_balance
                                            let a_point = finish_data.points_to_withdraw
                                            let n_point = o_point + a_point
                    
                                            let wallet = new Nuser_Wallet({
                                                user_id :finish_data.user_id,
                                                wallet_type:1,// 1 for credit 2 for debit
                                                details_type: 4,// credit ( 1 for advertise self, 2 for advetise referel, 3 for bonus , 4 refund(withdrow reject)), debit (1 for withdrow)
                                                advertise_type : -1 ,// ad type 1 for banner , 2 for half banner , 3 for full screen 
                                                details_id:  ObjectID(withdraw_id),// credit (Online table_id , Refund (advertise id ) , debit (advertise id)
                                                old_point:o_point,
                                                new_point:n_point,
                                                point:a_point,
                                                status_msg:"Withdraw Request Rejected.",
                                                cdate:ddt
                                            })
                                            wallet.save(function(err , wall_record){
                                                if(err)
                                                {
                                                    //-- save to activity table
                                                   return res.send({status : 0 , msg : "error"+err})
                                                }
                                                else
                                                {
                                                    res.send({status : 1 , msg : "Withdraw request successfully updated ."})
                                                   // return res.send({status : 1 , msg : "Wallet updated"})
                                                    /*
                                                    NUser.findOneAndUpdate({_id : element.user_id},{$set : {point_balance : n_point , update_date: ddt}} , function(err , nuserupdate)
                                                    {
                                                        //i = i + 1
                                                        if(nuserupdate)
                                                        {
                                                            //res.send({status : 1 ,msg :"Records updated successfully!! and points refund to end user's wallets."}) 
                                                            //if(i == reslt.count)
                                                        }
                                                        else
                                                        {
                                                            // -- save to activity table
                                                           return res.send({status : 0 , msg : "error"})
                                                        }
                                                    })*/
                                                }
                                            })
                            }
                        })
                    }
                    else
                    {
                        res.send({status : 0 , msg : "Withdraw Reject Record not found."})
                    }
                   
                    
                }
            })
        }
    })
}
exports.withdraw_step_two = function(req , res)
{
    let ddt = new Date()
    CommonFile.admin_auth(req.headers.token,(err , value)=>
    {
        if(err)
        {
           return res.status(401).send({status : 0 , msg : err})
        }
        else
        {
           let withdraw_ids = req.body.withdraw_ids
            Withdraw.update({_id :{$in :withdraw_ids.map(ObjectID)} , is_status : 0 ,is_approve : 1},{$set :{is_approve : 2 , is_pay_process : 0 , udate : ddt}},{multi: true },function(err , updates)
                        {
                            if(updates.nModified > 0 )
                            {
                                return res.send({status : 1 ,msg :"Records updated successfully!! In next hours user will get money."})
                            }
                            else
                            {
                              return  res.send({status : 0 , msg : "Records not updated!! or Something went wrong !!.."})
                            }
                        }) 
        }
    })
}

exports.generatecheck = function(req , res)
{
    CommonFile.PayTm_GenerateCheckSum(JSON.stringify(req.body),(err , resss)=>
    {
        console.log(resss)
        if(err)
        {
            res.send({status : 0 , msg : err})
        }
        else
        res.send({status : 1 , msg : "" , data : resss}) 
    })
}
exports.paytm_payment = function(req , res)
{
    CommonFile.PayTm_generate_Checksum(JSON.stringify(req.body), (err , resss)=>
    {
        console.log(resss)
        if(err)
        {
            res.send({status : 0 , msg : err})
        }
        else
        res.send({status : 1 , msg : "" , data : resss})
    })
}
exports.paytm_status = function(req , res)
{
    CommonFile.PayTm_check_status(JSON.stringify(req.body),(err , resss)=>
    {
        console.log(resss)
        if(err)
        {
            res.send({status : 0 , msg : err})
        }
        else
        res.send({status : 1 , msg : "" , data : resss}) 
    })
}

// Excel File 
exports.generateExcel = function(req , res)
{
    
    let withdraw_ids = req.body.withdraw_ids
    var day_i=dateFormat(new Date(new Date().setDate(new Date().getDate())), "ymmdd");
    Withdraw.aggregate([
        { 
            "$lookup" : {
                "from" : "nusers", 
                "localField" : "user_id", 
                "foreignField" : "_id", 
                "as" : "userdetails"
            }
        }, 
        { 
            "$match" : {
                "_id" : {"$in":withdraw_ids.map(ObjectID)}, 
                "is_status" : 0, 
                "is_approve" : 1, 
                "transaction_type" : 1, 
                "is_automatic" : false
            }
        }, 
        { 
            "$unwind" : {
                "path" : "$userdetails"
            }
        }, 
        { 
            "$lookup" : {
                "from" : "nuser_bankdetails", 
                "localField" : "user_id", 
                "foreignField" : "nuser_id", 
                "as" : "bankdetails"
            }
        }, 
        { 
            "$unwind" : {
                "path" : "$bankdetails"
            }
        }
    ],function(err , resultData){

        console.log(resultData)
        if(resultData)
        {
            var workbook = new Excel.Workbook();
            workbook.views = [
                {
                  x: 0, y: 0, width: 10000, height: 20000,
                  firstSheet: 0, activeTab: 1, visibility: 'visible'
                }
              ]
            var sheet = workbook.addWorksheet('Workbook-1');
            sheet.columns = [
                { header: 'NO', key: 'no', width: 5 },
                { header: 'Withdraw ID', key: 'wid', width: 32 },
                { header: 'Withdraw ID2', key: 'wid2', width: 25 },
                { header: 'Transaction ID', key: 'transaction_id', width: 20 },//Transaction
                { header: 'Holder Name', key: 'holdername', width: 30 },
                { header: 'Holder Mobile', key: 'mobile_number', width: 10 },
                { header: 'Amount', key: 'amount', width: 5 },
                { header: 'Bank Name', key: 'bankname', width: 10 },
                { header: 'Account Number', key: 'acnumber', width: 10 },
                { header: 'Account Type', key: 'actype', width: 10 },
                { header: 'Bank IFSC ', key: 'bankifsc', width: 10 }
            ];

            let i = 1
            resultData.forEach(element=>{
                console.log(element._id)
                let id = (''+element._id).replace(/"/g, '')
                sheet.addRow({no: i , wid: id , wid2:element.show_id , transaction_id:"",holdername:element.userdetails.first_name +' '+element.userdetails.last_name
               , mobile_number:element.userdetails.mobile_number , amount :element.fmoney_to_withdraw
               , bankname: element.bankdetails.bank_name,acnumber : element.bankdetails.account_number ,actype : element.bankdetails.account_type == 1 ?"Saving":"Current", bankifsc: element.bankdetails.bank_ifsc}).commit();
                i = i + 1
            })
            let file_name = "EXSL-"+Math.floor(10000 + Math.random() * 90000)+day_i+".xlsx"
            workbook.xlsx.writeFile("/xona/public/assets/excel_files/generated/"+file_name)
                .then(function() {
                    // done
                        //Update_Bank_Entry()
                        return res.send({status : 1 , msg : "Excellsheet generated .",data :{"url":'http://' + req.headers.host+"/assets/excel_files/generated/"+file_name}})
                    //console.log('file save')
                });
        }
        else
        {
            return res.send({status : 0 , msg : "Data not found."})
        }
    })
}

exports.upload_excelfile = function(req , res)
{
    var dic = "/assets/excel_files/uploaded/";
    var prf = "excl-";
      //console.log(req.f);
      const multer = require('multer');
      var storage = multer.diskStorage({
          destination: function (request, file, callback) {
              callback(null, './public'+dic);
          },
          filename: function (request, file, callback) {
             // console.log(file);
             // var ext = path.extname(file.filename).split('.');
              //console.log(ext);
              callback(null, uniqid(prf)+file.originalname)
          }
      });
      const upload = multer({storage: storage}).any('file');
  
      upload (req, res, function(err)  {
          if (err) {
              return res.status(400).send(
                {status : 0 ,
                  message: err
                });
          }
          let results = req.files.map(
            function(file) 
           {
               Update_Bank_Entry(file.filename)
              return { status : 1 ,msg : "Excelfile Uploaded for bank will do process soon.",data:{img_name : file.filename,image_path: 'http://' + req.headers.host + dic + file.filename}}
          });
  
          res.status(200).json(results[0]);
      });
}
function Update_Bank_Entry(file_name)
{
    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile("/xona/public/assets/excel_files/uploaded/"+file_name)
    .then(function() {
        // use workbook
       let sheet = workbook.getWorksheet("Workbook-1")
       // console.log(workbook)
      let count_row =  sheet.actualRowCount
      let transaction_data = []
      for(let i = 2 ; i <= count_row ; i = i + 1)
      {
        let row = sheet.getRow(i)
        if(row.getCell(4).value == "" || row.getCell(4).value == null )
        {
        }
        else
        {
            let dat = {id : row.getCell(2).value, show_id : row.getCell(3).value ,transaction_id :row.getCell(4).value }
            transaction_data.push(dat)
        }
      }

      transaction_data.forEach(element=>{

        console.log(element)
          Withdraw.findOneAndUpdate({_id : ObjectID(element.id) , show_id:element.show_id} ,{$set :{transaction_reference : element.transaction_id , is_status:1, is_approve:2 , is_pay_process : 2}},function(err , recordUpdate){
                if(recordUpdate)
                {
                    console.log('Bank Transfer record updated')
                }
                else
                {
                    console.log('Bank Transfer record updated data not found.')
                }
          })

      })
      //console.log(transaction_data)
    });
}


// from approve to send pending payment & download data.
//exports.withdraw_step_two