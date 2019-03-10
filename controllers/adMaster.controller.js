const AdMaster = require('../models/adMaster.model');
const AdDetail = require('../models/adDetail.model')
const AdHistory_View = require('../models/nuser_model/adshow_history.model')
const CommonFile = require('../constant.js');
ObjectId = require('mongodb').ObjectID;

exports.advertise_getMyAll = function(req, res)
{
    let params = req.query;

    let limit = Number(params.maxRecords);
    let frm = Number(params.startFrom);
    let type = Number(params.type);
    
    CommonFile.check_authWithId(req.headers.token , (error, value) =>
        {
            type = Number(params.type);
            //console.log(value);
            if (error)
            {
                return res.status(401).send(JSON.stringify({ status : 0 , msg : error}));
            }
            else
            {
                let t_data = 0;
                if(type == 0)
                {
                    AdMaster.count({advertiser_id:value},function(err,cou){if (err) {} else {t_data= cou;
                        AdMaster.find({advertiser_id:value},function(err,admaster){
                            if (err)
                            res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
                            else
                            {
                                res.send(JSON.stringify({ status : 1 , msg : "advertise listed successfully.","p_count": t_data, data :admaster}));
                            }
                        }).count().sort( { cdate: -1 } ).skip(frm).limit(limit);}});
                   
                }
                else if(type == 1)
                { // pending only
                    AdMaster.count({advertiser_id:value , is_active : true , is_approve : 0},function(err,cou){if (err) {} else {t_data= cou;
                        AdMaster.find({advertiser_id:value , is_active : true , is_approve : 0},function(err,admaster){
                            if (err)
                            res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
                            else
                            {
                                res.send(JSON.stringify({ status : 1 , msg : "advertise listed successfully.","p_count": t_data, data :admaster}));
                            }
                        }).count().skip(frm).limit(limit);
                    }});
                   
                }
                else if(type == 2)
                {
                    AdMaster.count({advertiser_id:value , is_active : false , is_approve : 0},function(err,cou){if (err) {} else {t_data= cou;
                        AdMaster.find({advertiser_id:value , is_active : false , is_approve : 0},function(err,admaster){
                            if (err)
                            res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
                            else
                            {
                                res.send(JSON.stringify({ status : 1 , msg : "advertise listed successfully.","p_count": t_data, data :admaster}));
                            }
                        }).count().skip(frm).limit(limit);
                    }});
                    
                }
                else if(type == 3)
                { // pending only
                    AdMaster.count({advertiser_id:value , is_active : true , is_approve : 2},function(err,cou){if (err) {} else {t_data= cou;
                        AdMaster.find({advertiser_id:value , is_active : true , is_approve : 2},function(err,admaster){
                            if (err)
                            res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
                            else
                            {
                                res.send(JSON.stringify({ status : 1 , msg : "advertise listed successfully.","p_count": t_data, data :admaster}));
                            }
                        }).count().skip(frm).limit(limit);}});
                    
                }
                else if(type == 4)
                {
                    AdMaster.count({advertiser_id:value , is_active : true , is_approve : 1},function(err,cou)
                    {
                        if (err) {} else 
                        {t_data= cou;
                        AdMaster.find({advertiser_id:value , is_active : true , is_approve : 1},function(err,admaster){
                            if (err)
                            res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
                            else
                            {
                                res.send(JSON.stringify({ status : 1 , msg : "advertise listed successfully.","p_count": t_data, data :admaster}));
                            }
                        }
                        ).count().skip(frm).limit(limit);}});
                }

            }
        });
}
exports.delete_myad = function(req , res)
{
    let c_date = new Date();
    CommonFile.check_authWithData(req.headers.token , (error, user_data) =>
    {
        console.log(user_data);
        if (error)
        {
            return res.status(401).send(JSON.stringify({ status : 0 , msg : error}));
        }
        else
        {
            //adMaster.findOneAndUpdate
           // adMaster.find({_id :req.params.id , })
           
           // AdMaster.find({_id : req.params.id , advertiser_id : new ObjectId(user_data._id) ,is_approve : 0 ,pay_status:1},function(err , admaster){if(err){console.log(err)} else console.log(admaster)})

            AdMaster.findOneAndUpdate({ _id : req.params.id,advertiser_id : user_data._id ,is_approve : 0 ,pay_status:1}, {$set: {is_active:false,pay_status:2,udate:c_date}}, function (err, admaster) 
            {
                console.log(admaster);
                if (err || admaster == null) 
                res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
                else
                {
                    
                    // refund balance to wallet 
                    //
                    let old_balance = user_data.wallet_balance;
                    let user_id = user_data._id;
                    let amount = admaster.final_amout;
                    let type = 1;
                    let c_type_id = admaster._id;
                    let c_type = 2 // credit ( 1 for online , 2 for delete(refund)) , debit (1 for adpost)
                    console.log(amount)
                    console.log(c_type_id)
                    console.log()
                    CommonFile.wallat_balance_charge(JSON.stringify({user_id:user_id,type:type,c_type:c_type,c_type_id:c_type_id,old_balance:old_balance,amount:amount}),(error , value) =>
                    {
                        if(error)
                        {
                            res.send({status:0,error})
                        }
                        else
                        {
                            console.log(value)
                            res.send(JSON.stringify({ status : 1 , msg : "Advertise deleted successfully , your wallet get refunded."}));
                        }
                    })
                    
                }
                
            });
        }
    });
}

exports.user_start_pause_advertise= function (req , res)
{
    CommonFile.check_authWithId(req.headers.token ,(err , user_id)=>
    {
        if(err)
        {
           return res.status(401).send({ status : 0 , msg :  err}); 
        }
        else
        {
            let old_status = 0 
            let advertise_id = req.body.advertise_id;

            if(req.body.is_status > 2)
            {
                return res.send(JSON.stringify({ status : 0 , msg : "your are not autorise for other status."})); 
               
            }
            if(req.body.is_status == 1)
                old_status = 2
            else
            if(req.body.is_status == 2)
                old_status = 1
           
                AdMaster.findOneAndUpdate({_id : advertise_id , advertiser_id : user_id , is_active : true , is_approve : 1 , is_status : old_status},{$set : {is_status : req.body.is_status}},function(err,adData){
                    if (adData)
                    {
                        res.send(JSON.stringify({ status : 1 , msg : "Advertise Update successfully."}));
                    } 
                    else
                    {
                        res.send(JSON.stringify({ status : 0 , msg : "you not autorise to do action on advertise status."}));   
                    }
                })
        }
    })
}

exports.admin_user_start_pause_advertise= function (req , res)
{
    CommonFile.admin_auth(req.headers.token ,(err , is_true)=>
    {
        if(err)
        {
           return res.status(401).send({ status : 0 , msg :  err}); 
        }
        else
        {
            let old_status = 0 
            let advertise_id = req.body.advertise_id;

            if(req.body.is_status > 2)
            {
                return res.send(JSON.stringify({ status : 0 , msg : "your are not autorise for other status."})); 
               
            }
            if(req.body.is_status == 1)
                old_status = 2
            else
            if(req.body.is_status == 2)
                old_status = 1
           
                AdMaster.findOneAndUpdate({_id : advertise_id , is_active : true , is_approve : 1 , is_status : old_status},{$set : {is_status : req.body.is_status}},function(err,adData){
                    if (adData)
                    {
                        res.send(JSON.stringify({ status : 1 , msg : "Advertise Update successfully."}));
                    } 
                    else
                    {
                        res.send(JSON.stringify({ status : 0 , msg : "you not autorise to do action on advertise status."}));   
                    }
                })
    
            
        }
    })
}

// Admin service 

exports.advertise_admin_getAll = function(req, res)
{// 0 for all() , 1 not approved , 2 for rejected by admin , 3 for approved & running  , 4 completed

    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {//res.status(401).send({ status : 0 , msg :  err});
          return  res.status(401).send({status:0 , msg : err})
        }
        else
        {
                let params = req.query;
                let limit = Number(params.maxRecords);
                let frm = Number(params.startFrom);
                let type = Number(params.type);
                let search_data = params.search_data
    
                let t_data = 0;
                if(type == 0)// all
                {
                    AdMaster.count({$or : [{'show_id': new RegExp(search_data, 'i')} , {'adName': new RegExp(search_data, 'i')}]},function(err,cou){if (err) {} else {t_data= cou;
                        AdMaster.find({$or : [{'show_id': new RegExp(search_data, 'i')} , {'adName': new RegExp(search_data, 'i')}]},function(err,admaster){
                            if (err)
                            res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
                            else
                            {
                                res.send(JSON.stringify({ status : 1 , msg : "advertise listed successfully.","p_count": t_data, data :admaster}));
                            }
                        }).count().sort( { cdate: -1 } ).skip(frm).limit(limit); }});
                      
                }
                else if (type == 1)//1 not approved
                {
                    AdMaster.count({is_active : true , is_approve : 0 ,pay_status : 1 ,$or : [{'show_id': new RegExp(search_data, 'i')} , {'adName': new RegExp(search_data, 'i')}]},function(err,cou){if (err) {} else t_data= cou;});
                    AdMaster.find({is_active : true , is_approve : 0 ,pay_status : 1 , $or : [{'show_id': new RegExp(search_data, 'i')} , {'adName': new RegExp(search_data, 'i')}]},function(err,admaster){
                        if (err)
                        res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
                        else
                        {
                            res.send(JSON.stringify({ status : 1 , msg : "advertise listed successfully.","p_count": t_data, data :admaster}));
                        }
                    }).count().sort( { cdate: -1 } ).skip(frm).limit(limit);   
                }
                else if(type == 2) // rejected
                {
                    AdMaster.count({is_active : true , is_approve : 2 ,pay_status : 2 , $or : [{'show_id': new RegExp(search_data, 'i')} , {'adName': new RegExp(search_data, 'i')}]},function(err,cou){if (err) {} else t_data= cou;});
                    AdMaster.find({is_active : true , is_approve : 2,pay_status : 2 , $or : [{'show_id': new RegExp(search_data, 'i')} , {'adName': new RegExp(search_data, 'i')}]},function(err,admaster){
                        if (err)
                        res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
                        else
                        {
                            res.send(JSON.stringify({ status : 1 , msg : "advertise listed successfully.","p_count": t_data, data :admaster}));
                        }
                    }).count().sort( { cdate: -1 } ).skip(frm).limit(limit); 
                }
                else if (type == 3) // running/paush
                {
                    AdMaster.count({is_active : true , is_approve : 1 , pay_status : 1 ,is_status : { $lt:3 } , $or : [{'show_id': new RegExp(search_data, 'i')} , {'adName': new RegExp(search_data, 'i')}] },function(err,cou){if (err) {} else t_data= cou;});
                    AdMaster.find({is_active : true , is_approve : 1 , pay_status : 1 ,is_status : { $lt:3 } , $or : [{'show_id': new RegExp(search_data, 'i')} , {'adName': new RegExp(search_data, 'i')}] },function(err,admaster){
                        if (err)
                        res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
                        else
                        {
                            res.send(JSON.stringify({ status : 1 , msg : "advertise listed successfully.","p_count": t_data, data :admaster}));
                        }
                    }).count().sort( { cdate: -1 } ).skip(frm).limit(limit);   
                }
                else if(type == 4) // close
                {
                    AdMaster.count({is_active : true , is_status : 3  , $or : [{'show_id': new RegExp(search_data, 'i')} , {'adName': new RegExp(search_data, 'i')}]},function(err,cou){if (err) {} else t_data= cou;});
                    AdMaster.find({is_active : true , is_status : 3 , $or : [{'show_id': new RegExp(search_data, 'i')} , {'adName': new RegExp(search_data, 'i')}]},function(err,admaster){
                        if (err)
                        res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
                        else
                        {
                            res.send(JSON.stringify({ status : 1 , msg : "advertise listed successfully.","p_count": t_data, data :admaster}));
                        }
                    }).count().sort( { cdate: -1 } ).skip(frm).limit(limit); 
                }
            }
        })
}
exports.advertise_adminstatus_update = function(req , res)
{
    // is_approve =   1(approve) , is_approve =  2(reject)
    // ad_id = ,
    //CommonFile.admin_auth(req.headers.token, ())
    let aadate = new Date();
    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {
          return  res.status(401).send({status:0 , msg : err})
        }
        else
        {
            if(req.body.is_approve == 1) // active
            {
                // 1 for approved
                // if type =  1 2 3 ,4 set customer link
                let points = req.body.points; 
                let custom_link = req.body.custom_link;
                AdMaster.findOneAndUpdate({ _id : req.body.advertise_id}, {$set: {is_approve:req.body.is_approve  , adate : aadate , points : points , status_msg : req.body.status_msg ,is_status : 0}}, function (err, adData) 
                    {
                        console.log('------------------------------------')
                        console.log(adData);
                        console.log('------------------------------------')
                        if (adData)
                        {
                            if(adData.adtype_id == 1 || adData.adtype_id == 2 || adData.adtype_id == 3 || adData.adtype_id == 4)
                            {
                                // small banner , mediam banner , full screen , video
                                AdDetail.findOne({_id : adData.details_id}, function(err , adDetails) {
                                    if(adDetails)
                                    {
                                        let c_link = "";
                                        if(adData.adtype_id == 4)
                                        {
                                            c_link = adDetails.fullbanner_link
                                        }
                                        else
                                        {
                                            // check template there 
                                            if(adDetails.fullbanner_link == undefined)
                                            {
                                            c_link = custom_link
                                            }
                                            else
                                            {
                                                c_link = adDetails.fullbanner_link
                                            }
                                        }
                                        console.log(c_link)
                                        AdDetail.findOneAndUpdate({_id: adData.details_id},{$set :{custom_link:c_link}},function(err , adDetailsData)
                                        {
                                            if(adDetailsData)
                                            { 
                                                
                                                res.send(JSON.stringify({ status : 1 , msg : "Advertise approve successfully."}));
                                            }
                                            else
                                            {
                                                res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
                                            }
                                        }) 
                                    }
                                    else
                                    {
                                        res.send({status : 0 , msg : err })
                                    }


                                })
                                
                            }
                            else
                            {

                            }
                            
                        } 
                        else
                        {
                            res.send(JSON.stringify({ status : 0 , msg : "advertise already approved or ad not found."}));
                        }
                        
                    });
            }
            else
            {
                //2 for reject
                //  refund wallet and cancel adverise.

                let status_msg = req.body.status_msg
                AdMaster.findOneAndUpdate({ _id : req.body.advertise_id,is_approve : 0,pay_status : 1}, {$set: {is_approve:2 , status_msg : status_msg  , pay_status : 2}}, function (err, adData) 
                    {
                        console.log('------------------------------------')
                        console.log(adData);
                        console.log('------------------------------------')
                        if (adData)
                        {
                            CommonFile.get_advertise_userByid(adData.advertiser_id, (err , userData)=>{
                                if(err)
                                {
                                    res.send({status : 0 , msg : err})
                                }
                                else
                                {
                                    //let old_balance 
                                    let old_balance = userData.wallet_balance;
                                    let user_id = userData._id;
                                    let amount = adData.final_amout;
                                    let type = 1;
                                    let c_type_id = adData._id;
                                    let c_type = 2 // credit ( 1 for online , 2 for delete(refund)) , debit (1 for adpost)
                                    console.log(amount)
                                    console.log(c_type_id)
                                    console.log()
                                    CommonFile.wallat_balance_charge(JSON.stringify({user_id:user_id,type:type,c_type:c_type,c_type_id:c_type_id,old_balance:old_balance,amount:amount}),(error , value) =>
                                    {
                                        if(error)
                                        {
                                            res.send({status:0,error})
                                        }
                                        else
                                        {
                                            console.log(value)
                                            res.send(JSON.stringify({ status : 1 , msg : "Advertise rejected successfully , user wallet get refunded."}));
                                        }
                                    })
                                }
                            })
                        } 
                        else
                        {
                            res.send(JSON.stringify({ status : 0 , msg : "advertise already rejected or ad not found."}));
                        }
                        
                    });
            }
        }
    })   
}
exports.getAdvertiser_View_userlist = function(req , res)
{
    if(req.body.type == 2)
    {
        CommonFile.admin_auth(req.headers.token , (err , value)=>
        {
            if(err)
            {
                return res.status(401).send({status :0 , msg : err})
            }
            else
            {

                let params = req.query;
                    let limit = Number(params.maxRecords);
                    let frm = Number(params.startFrom);
                    let t_data = 0
                AdHistory_View.count({ is_paid : true , is_status : 1,advertise_id : ObjectId(req.body.ad_id) },function(err,cou)
                {
                    if (err) {
                        return res.send({status : 1 , msg:"not found ","p_count":0,data:[]})
                    } 
                    else 
                    {
                        t_data= cou;
                        AdHistory_View.aggregate([
                            { 
                                "$lookup" : {
                                    "from" : "nusers", 
                                    "localField" : "nuser_id", 
                                    "foreignField" : "_id", 
                                    "as" : "userdetails"
                                }
                            }, 
                            { 
                                "$match" : {
                                    "is_status" : 1.0, 
                                    "is_paid" : true, 
                                    "advertise_id" : ObjectId(req.body.ad_id)
                                }
                            }, 
                            { 
                                "$unwind" : {
                                    "path" : "$userdetails"
                                }
                            }, 
                            { 
                                "$sort" : {
                                    "udate" : -1.0
                                }
                            }, 
                            { 
                                "$skip" :  frm
                            }, 
                            { 
                                "$limit" : limit
                            }
                        ],function(err , results)
                        {
                            if(err)
                            {

                            }
                            else
                            res.send(JSON.stringify({ status : 1 , msg : "advertise view user listed successfully.","p_count": t_data, data :results}));
                        })
                    }
                }); 
            }
        })
    }
    else{
        CommonFile.check_auth(req.headers.token , (err , value)=>
        {
            if(err)
            {
                return res.status(401).send({status :0 , msg : err})
            }
            else
            {

                let params = req.query;
                    let limit = Number(params.maxRecords);
                    let frm = Number(params.startFrom);
                    let t_data = 0
                AdHistory_View.count({ is_paid : true , is_status : 1, advertise_id : req.body.ad_id },function(err,cou)
                {

                    if (err) {
                        return res.send({status : 1 , msg:"not found ","p_count":0,data:[]})
                    } 
                    else 
                    {
                        t_data = cou;
                        AdHistory_View.aggregate([
                            { 
                                "$lookup" : {
                                    "from" : "nusers", 
                                    "localField" : "nuser_id", 
                                    "foreignField" : "_id", 
                                    "as" : "userdetails"
                                }
                            }, 
                            { 
                                "$match" : {
                                    "is_status" : 1.0, 
                                    "is_paid" : true, 
                                    "advertise_id" : ObjectId(req.body.ad_id)
                                }
                            }, 
                            { 
                                "$unwind" : {
                                    "path" : "$userdetails"
                                }
                            }, 
                            { 
                                "$sort" : {
                                    "udate" : -1.0
                                }
                            }, 
                            { 
                                "$skip" :  frm
                            }, 
                            { 
                                "$limit" : limit
                            }
                        ],function(err , results)
                        {
                            if(err)
                            {

                            }
                            else
                            res.send(JSON.stringify({ status : 1 , msg : "advertise view user listed successfully.","p_count": t_data, data :results}));
                        })
                    }
                }); 
            }
        })
    }
}
// user based.
exports.admin_getadvertise_byadvertiserID_list = function(req , res)
{
    
        CommonFile.admin_auth(req.headers.token , (err , value)=>
        {
            if(err)
            {
                return res.status(401).send({status :0 , msg : err})
            }
            else
            {

                    let params = req.query;
                    let limit = Number(params.maxRecords);
                    let frm = Number(params.startFrom);
                    let t_data = 0
                    AdMaster.count({advertiser_id:ObjectId(user_id)},function(err,cou){if (err) {} else {t_data= cou;
                        AdMaster.find({advertiser_id:ObjectId(user_id)},function(err,admaster){
                            if (err)
                            res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
                            else
                            {
                                res.send(JSON.stringify({ status : 1 , msg : "advertise listed successfully.","p_count": t_data, data :admaster}));
                            }
                        }).count().sort( { cdate: -1 } ).skip(frm).limit(limit); }});
            }
        })
   
}
//hsemrahdrepoleved

/*
exports.ad_advertise_code = function(req , res)
{
    AdMaster.find({} , function(err , addata)
    {
        addata.forEach(element =>{
           let id_n = "AD-"+Math.floor(100000000 + Math.random() * 900000000)
           AdMaster.findOneAndUpdate({_id : element._id},{$set :{show_id : id_n}},function(err , fd){

           })
        })
    })
}
*/
                //.skip(1).limit(2).pretty()
                /*
                adMaster.aggregate([{
                        $lookup:{from:"addetails",localField:"details_id",foreignField:"_id", as : "details_data"}},
                        {$match : { advertiser_id : value}}
                        ]).then(function(result,err)
                        {
                        //console.log(result);
                            if(err)
                                res.send({status:0 , msg:"something gone wrong",err : err});
                            else
                                res.send(JSON.stringify({ status : 1 , msg : "advertise details get." , data :result}));
                        });
                    */