const NCommonFile = require('../../nconstant')
const AdMaster = require('../../models/adMaster.model')
var sortJsonArray = require('sort-json-array');
ObjectID = require('mongodb').ObjectID;
//const AdShowStatus = require('../../models/adshow_status.model')
const AdShow_History = require('../../models/nuser_model/adshow_history.model')
const Nuser_Wallet = require('../../models/nuser_wallet.model')
const NUser = require('../../models/nuser_model/nuser.model')

var dateFormat = require('dateformat');
var moment = require('moment')



exports.getAdvertise1 = function(req , res)
{
    NCommonFile.nuser_check_authWithData(req.headers.token , (err , nuserData) =>
    {
        //console.log('--------------mydata-------------------')
        //console.log('-------------'+nuserData+'--------------------')
        //console.log('---------------------------------')
        if(err)
        {
            res.send({status : 0 , msg : err})
        }
        else
        {
            if(nuserData.is_active ==  false )
            {
                return res.send({status: 0 , msg : "account is inactive mode , contact xona support ."})
            }
            else
            if(nuserData.is_approve ==  0 || nuserData.is_approve ==  2)
            {
                return res.send({status : 0 , msg : "your profile not approved or rejected"})
            }
            else
            {
                // ALL Current Active Ads
                AdMaster.find({is_active : true , is_approve : 1 , is_status : 1 , $expr:{$gt:["$totaluser_for_ads", "$totaluser_visitor"]}},{ _id : 1},function(err , admasterids)
                {
                    if(err)
                    {
                        return res.send({status : 0 , msg : err.message})
                    }
                    else
                    {
                        var today_date ,tomorrow_date;
                        //var day=dateFormat(new Date(), "yyyy-mm-dd");
                        //var day_next=dateFormat(new Date(new Date().setDate(new Date().getDate()+1)), "yyyy-mm-dd");
                        //var today_date = dateFormat(new Date(new Date().setDate(new Date().getDate()-1)), "yyyy-mm-dd");
                        //var tomorrow_date = dateFormat(new Date(), "yyyy-mm-dd");
                        //let t_date = new Date();
                        let check_date = new Date();
                        check_date.setHours(18)
                        check_date.setMinutes(29)
                        check_date.setSeconds(59)

                        let different = moment(new Date(), 'HH:mm:ss').diff(moment(check_date, 'HH:mm:ss'))
                        if(different > 0)
                        {// my time is big
                            console.log("big")
                            today_date =  dateFormat(new Date(), "yyyy-mm-dd");
                            tomorrow_date =  dateFormat(new Date(new Date().setDate(new Date().getDate()+1)), "yyyy-mm-dd");
                        }
                        else
                        {// my time is small.
                            console.log("small")
                             today_date = dateFormat(new Date(new Date().setDate(new Date().getDate()-1)), "yyyy-mm-dd");
                             tomorrow_date = dateFormat(new Date(), "yyyy-mm-dd");
                        }

                        //console.log('today_date --'+today_date)
                        //console.log('tomorrow_date --'+tomorrow_date)
                        //console.log('different --: '+different)
                       // old showen ads
                        AdShow_History.find({nuser_id : ObjectId(nuserData._id) , is_status : 1 ,"cdate" : { $lt: new Date(today_date+"T18:29:59Z").toISOString()}},{advertise_id : 1},function(err , adhistoryDatas_old){
                            if(err)
                            {
                                console.log("----")
                            }
                            else
                            {
                                let old_hisotry_id = []

                                if(adhistoryDatas_old.length == 0)
                                {
                                    old_hisotry_id = admasterids
                                   // let all_ids = []
                                    /*old_hisotry_id.forEach(element =>
                                        {
                                            if(element.totaluser_visitor < element.totaluser_for_ads)
                                            all_ids.push(element._id)
                                        })*/

                                        AdShow_History.find({nuser_id : ObjectId(nuserData._id) , is_status : 1 ,"cdate" : { $lt: new Date(tomorrow_date+"T18:29:59Z").toISOString(), $gte: new Date(today_date+"T18:30:00Z").toISOString()}},{advertise_id : 1},function(err , adhistoryDatas)
                                        {
                                            let all_ids = []
                                            old_hisotry_id.forEach(element =>
                                                {
                                                    all_ids.push(element._id)
                                                })
                                            adhistoryDatas.forEach(element =>
                                                {
                                                    all_ids.push(element.advertise_id)
                                                })
                                        
                                            AdMaster.find({ _id : {$in : all_ids.map(ObjectID)}},function(err,adshowData)
                                            {
                                                let custome_admaster = []
                                                
                                                adshowData.forEach(element =>
                                                    {
                                                        if(contains(adhistoryDatas , "advertise_id", element._id))
                                                        {
                                                            element["is_viewed"] = true ;
                                                            custome_admaster.push(element)
                                                        }
                                                        else
                                                        {
                                                            element["is_viewed"] = false ;
                                                            custome_admaster.push(element)
                                                        }
                                                       /* let f_f = false ; 
                                                        adhistoryDatas.forEach(elemt_1 =>
                                                            {
                                                                if((elemt_1.advertise_id).equals(element._id))
                                                                {
                                                                    f_f = true 
                                                                }
                                                            })
                                                    
                                                        if(f_f == true )
                                                        {
                                                            element["is_viewed"] = true ;
                                                        }
                                                        else
                                                        {
                                                            element["is_viewed"] = false ;
                                                        }
                
                                                        custome_admaster.push(element)*/
                                                    })
                                                
                                                  //  console.log(custome_admaster)
                                                    XXX(custome_admaster,(err , response)=>{
                                                        if(err)
                                                        {
                                                           return res.send({status : 0 , msg : "data counting problem."})
                                                        }
                                                        else
                                                        {
                                                           return res.send({status : 1 , msg : "advertise get successfully.--", data :  response.ar , percent : response.pr}) 
                                                        }
                                                    })
                
                                            }).sort(
                                            { 
                                                "adtype_id" : 1
                                            })
                                        })
                                   /* AdMaster.find({ _id : {$in : all_ids.map(ObjectID)}},function(err,adshowData)
                                    {
                                        let custome_admaster = []
                                        
                                        adshowData.forEach(element =>
                                            {
                                                element["is_viewed"] = false ;
                                               
                                                custome_admaster.push(element)
                                            })
                                        
                                            console.log(custome_admaster)
                                            XXX(custome_admaster,(err , response)=>{
                                                if(err)
                                                {
                                                   return res.send({status : 0 , msg : "data counting problem."})
                                                }
                                                else
                                                {
                                                   return res.send({status : 1 , msg : "advertise get successfully.--", data :  response.ar , percent : response.pr}) 
                                                }
                                            })
        
                                    }).sort(
                                    { 
                                        "adtype_id" : 1
                                    })
                                    */
                                }
                                else
                                {
                                    admasterids.forEach(element =>
                                        {
                                            if(contains(adhistoryDatas_old ,'advertise_id',element._id))
                                            {}
                                            else
                                            {
                                                old_hisotry_id.push(element)
                                            }

                                           /* let f_f = true 
                                            adhistoryDatas_old.forEach(elemt_1=>{
                                                if((elemt_1.advertise_id).equals(element._id))
                                                {
                                                    f_f = false 
                                                }
                                            })
                                            if(f_f == true)
                                            {
                                                old_hisotry_id.push(element)
                                            }*/
                                        })
                                        //AdShow_History.find({nuser_id : ObjectId(nuserData._id) , is_status : 1 ,"cdate" : { $lt: new Date(day+"T23:59:59Z").toISOString(), $gte: new Date(day+"T00:00:00Z").toISOString()}},{advertise_id : 1},function(err , adhistoryDatas)
                                        
                                        // last day showen ads
                                        AdShow_History.find({nuser_id : ObjectId(nuserData._id) , is_status : 1 ,"cdate" : { $lt: new Date(tomorrow_date+"T18:29:59Z").toISOString(), $gte: new Date(today_date+"T18:29:59Z").toISOString()}},{advertise_id : 1},function(err , adhistoryDatas)
                                        {
                                            let all_ids = []
                                            old_hisotry_id.forEach(element =>
                                                {
                                                    all_ids.push(element._id)
                                                })
                                            adhistoryDatas.forEach(element =>
                                                {
                                                    all_ids.push(element.advertise_id)
                                                })
                                        
                                            AdMaster.find({ _id : {$in : all_ids.map(ObjectID)}},function(err,adshowData)
                                            {
                                                let custome_admaster = []
                                                
                                                adshowData.forEach(element =>
                                                    {

                                                        if(contains(adhistoryDatas,'advertise_id' ,element._id))
                                                        {
                                                            element["is_viewed"] = true ;
                                                            custome_admaster.push(element)
                                                        }
                                                        else
                                                        {
                                                            element["is_viewed"] = false ;
                                                            custome_admaster.push(element)
                                                        }
                                                        /*let f_f = false ; 
                                                        adhistoryDatas.forEach(elemt_1 =>
                                                            {
                                                                if((elemt_1.advertise_id).equals(element._id))
                                                                {
                                                                    f_f = true 
                                                                }
                                                            })
                                                    
                                                        if(f_f == true )
                                                        {
                                                            element["is_viewed"] = true ;
                                                        }
                                                        else
                                                        {
                                                            element["is_viewed"] = false ;
                                                        }
                
                                                        custome_admaster.push(element)*/
                                                    })
                                                
                                                  //  console.log(custome_admaster)
                                                    XXX(custome_admaster,(err , response)=>{
                                                        if(err)
                                                        {
                                                           return res.send({status : 0 , msg : "data counting problem."})
                                                        }
                                                        else
                                                        {
                                                           return res.send({status : 1 , msg : "advertise get successfully.--", data :  response.ar , percent : response.pr}) 
                                                        }
                                                    })
                
                                            }).sort(
                                            { 
                                                "adtype_id" : 1
                                            })
                                        })
                                }
                            }
                            
                            //console.log(adhistoryDatas_old)
                        })
                        //let admaster_id = []
                    }
                }).sort(
                    { 
                        "adtype_id" : 1
                    })
            }
        }
    })
}
exports.getAdvertiseDetails = function(req , res)
{
    console.log(req.body)
    NCommonFile.nuser_check_authWithData(req.headers.token , (err , nuserData)=>
    {
        if(err)
        {
           return res.send({status:0 , msg: err});
        }
        else
        {     
            if(req.body.ad_id == undefined) 
                return res.send({status:0 , msg: "Please download latest version."});
            
            let ids_ = []
           let dd = req.body.ad_id;
               // console.log('----------------')
                //console.log(dd)

                dd.forEach(element => {
                    ids_.push(element)
                })
            console.log(ids_)
            AdMaster.aggregate([{
                $lookup:{from:"addetails",localField:"details_id",foreignField:"_id", as : "details_data"}},
                {$match : { _id : {"$in" : ids_.map(ObjectID) },"$expr": { "$lt": [ "$totaluser_visitor", "$totaluser_for_ads" ] }}},
                { 
                    $replaceRoot : {
                        "newRoot" : {
                            "$mergeObjects" : [
                                {
                                    "$arrayElemAt" : [
                                        "$details_data", 
                                        0
                                    ]
                                }, 
                                "$$ROOT"
                            ]
                        }
                    }
                }, 
                { 
                    $project : 
                    {
                        "details_data" : 0 ,
                        "adName" : 0 , 
                        "type" : 0 , 
                        "yourName" : 0 , 
                        "template" : 0 , 
                        "fullbanner_link" : 0 , 
                        "comments" : 0 , 
                        "filters" : 0 , 
                        "users" : 0 , 
                        "calculations" : 0 , 
                        "advertiser_id" : 0 , 
                        "adtype_id" : 0 ,
                        "details_id" : 0 ,
                        "is_active" : 0 ,
                        "is_approve" : 0 ,
                        "is_status" : 0 ,
                        "pay_status" : 0 ,
                        "totaluser_for_ads" : 0 ,
                        "final_amout" : 0 ,
                        "final_tax" : 0 ,
                        "final_sec" : 0 ,
                        "cdate" : 0 ,
                        "udate" : 0 ,
                        "points" : 0 ,
                        "__v" : 0 ,
                        "pay_from" : 0 ,
                        "status_msg" : 0 ,
                        //"_id" : 0 ,
                        "final_amount": 0,
                        "final_tax_amount": 0,
                        "final_filter_amount": 0,
                        "is_coupon": 0,
                        "tax_rate": 0
                    }
                }
                ]).then(function(result,err)
                {
                console.log(result);
                    if(err)
                        res.send({status:0 , msg:"something gone wrong",err : err});
                    else
                        {
                            res.send({ status : 1 , msg : "advertise details get." , data : {"result":result  , ad_ids :ids_}});
                            /*
                            AdShow_History.find({advertise_id : {$in : ids_.map(ObjectID) } , user_id : nuserData._id , is_status : 1}, function(err,adshowData)
                            {
                                if(err)
                                {}
                                else
                                {   if(adshowData.length > 0)
                                    {
                                        let f_result = []
                                        let f_ids = []
                                        result.forEach(element =>{
                                            adshowData.forEach(elemt_1 =>{
                                                if((element._id).equals(elemt_1.advertise_id))
                                                {  }
                                                else
                                                {f_result.push(element)
                                                f_ids.push(element._id)}})
                                        })
                                        res.send({ status : 1 , msg : "advertise details get..." , data : {"result":f_result  , ad_ids :f_ids}});
                                    }
                                    else
                                    {
                                        res.send({ status : 1 , msg : "advertise details get." , data : {"result":result  , ad_ids :[]}});
                                    }
                                }
                            })
                            */
                            
                        }
                        
                });
        }
    })
}
exports.start_adshow = function(req , res)
{
    NCommonFile.nuser_check_authWithData(req.headers.token , (err , nuserData)=>{
        if(err)
        {
            res.send({status:0 , msg: err});
        }
        else
        {
            let data = req.body
            let user_id = nuserData._id
            let ids_ = []
            ids_ = data.ad_id
            if(ids_ == undefined)
            return res.send({status : 0 , msg : "download latest version of this application."})
          
            AdMaster.aggregate([
                { $lookup:{from:"addetails",localField:"details_id",foreignField:"_id", as : "details_data"}},
                {$match : { _id : {"$in" : ids_.map(ObjectID) } , "$expr": { "$lt": [ "$totaluser_visitor", "$totaluser_for_ads" ] } }},
                { 
                    $replaceRoot : {
                        "newRoot" : {
                            "$mergeObjects" : [
                                {
                                    "$arrayElemAt" : [
                                        "$details_data", 
                                        0
                                    ]
                                }, 
                                "$$ROOT"
                            ]
                        }
                    }
                }, 
                { 
                    $project : 
                    {
                        "details_data" : 0 ,
                        "adName" : 0 , 
                        "type" : 0 , 
                        "yourName" : 0 , 
                        "template" : 0 , 
                        "fullbanner_link" : 0 , 
                        "comments" : 0 , 
                        "filters" : 0 , 
                        "users" : 0 , 
                        "calculations" : 0 , 
                        "advertiser_id" : 0 , 
                        "adtype_id" : 0 ,
                        "details_id" : 0 ,
                        "is_active" : 0 ,
                        "is_approve" : 0 ,
                        "is_status" : 0 ,
                        "pay_status" : 0 ,
                        "totaluser_for_ads" : 0 ,
                        "final_amout" : 0 ,
                        "final_tax" : 0 ,
                        "final_sec" : 0 ,
                        "cdate" : 0 ,
                        "udate" : 0 ,
                        
                        "__v" : 0 ,
                        "pay_from" : 0 ,
                        "status_msg" : 0 ,
                        
                        "final_amount": 0,
                        "final_tax_amount": 0,
                        "final_filter_amount": 0,
                        "is_coupon": 0,
                        "tax_rate": 0
                    }
                }
                ]).then(function(result,err)
                {
                //console.log(result);
                    if(err)
                        res.send({status:0 , msg:"something gone wrong",err : err});
                    else
                    {
                        let ddt = new Date();
                        let i = 0 ;
                        let count_ = result.length
                        let his_ids = []
                        
                        AdShow_History.find({advertise_id : {$in : ids_.map(ObjectID) } , nuser_id : ObjectId(nuserData._id), is_status : 1}, function(err,adshowData)
                            {
                                if(err)
                                {}
                                else
                                {   if(adshowData.length > 0)
                                    {
                                        let f_result = []
                                        result.forEach(element =>{

                                            let is_not_available = false 
                                            adshowData.forEach(elemt_1 =>
                                                {
                                                    if((element._id).equals(elemt_1.advertise_id))
                                                    {
                                                        is_not_available = true 
                                                    }
                                                    else
                                                    {
                                                        //
                                                    }
                                                })
                                                if(is_not_available){}
                                                else
                                                {
                                                    f_result.push(element)
                                                }
                                            })
                                            count_ = f_result.length
                                            if(f_result.length == 0)
                                            {
                                               return res.send({ status : 1 , msg : "Adshow started..." , data : {history_ids : []} });
                                            }
                                            else
                                            {
                                                f_result.forEach( element =>{
                                                    let adshow_history = new AdShow_History({
                                                        nuser_id : user_id,
                                                        advertise_id : element._id,
                                                        points :  element.points,
                                                        is_status : 0,// status of advertise view (0 for not done , 1 for done , 2 for hold , 3 for review  )
                                                        is_paid : false,// this is for self earning 
                                                        is_team_paid : false,// this is for team earnining paid or not 
                                                        cdate : ddt,
                                                        udate : ddt
                                                    })
                                                    adshow_history.save(function(err , adshow_history1){
                                                        if(err)
                                                        {
                                                            console.log(err)
                                                        }
                                                        else
                                                        {
                                                            i = i + 1
                                                            his_ids.push(adshow_history1._id)
                                                            if(i == count_)
                                                            {
                                                                res.send({ status : 1 , msg : "Adshow started..." , data : {history_ids : his_ids} });
                                                            }
                                                        }
                                                    })
                                                    
                                                    })
                                            }
                                           
                                     /*   let f_result = []
                                        let f_ids = []
                                        result.forEach(element =>
                                            {
                                            adshowData.forEach(elemt_1 =>{
                                                if((element._id).equals(elemt_1.advertise_id))
                                                {  }
                                                else
                                                {f_result.push(element)
                                                f_ids.push(element._id)}})
                                        })
                                        res.send({ status : 1 , msg : "advertise details get..." , data : {"result":f_result  , ad_ids :f_ids}});
                                        */
                                    }
                                    else
                                    {
                                        result.forEach(element =>
                                            {
                                                let adshow_history = new AdShow_History({
                                                    nuser_id : user_id,
                                                    advertise_id : element._id,
                                                    points :  element.points,
                                                    is_status : 0,// status of advertise view (0 for not done , 1 for done , 2 for hold , 3 for review  )
                                                    is_paid : false,// this is for self earning 
                                                    is_team_paid : false,// this is for team earnining paid or not 
                                                    cdate : ddt,
                                                    udate : ddt
                                                })
                                                adshow_history.save(function(err , adshow_history1){
                                                    if(err)
                                                    {
                                                        console.log(err)
                                                    }
                                                    else
                                                    {
                                                        i = i + 1
                                                        his_ids.push(adshow_history1._id)
                                                        if(i == count_)
                                                        {
                                                            res.send({ status : 1 , msg : "Adshow started..." , data : {history_ids : his_ids} });
                                                        }
                                                    }
                                                })
                                            })
                                       // res.send({ status : 1 , msg : "Adshow started..." , data : {history_ids : []} });
                                       // res.send({ status : 1 , msg : "advertise details get." , data : {"result":result  , ad_ids :[]}});
                                    }
                                }
                            })
                      //res.send({ status : 1 , msg : "advertise details get." , data :result});
                     /* result.forEach(element =>{

                            let adshow_history = new AdShow_History({
                                nuser_id : user_id,
                                advertise_id : element._id,
                                points :  element.points,
                                is_status : 0,// status of advertise view (0 for not done , 1 for done , 2 for hold , 3 for review  )
                                is_paid : false,// this is for self earning 
                                is_team_paid : false,// this is for team earnining paid or not 
                                cdate : ddt,
                                udate : ddt
                            })
                            adshow_history.save(function(err , adshow_history1){
                                if(err)
                                {
                                    console.log(err)
                                }
                                else
                                {
                                    i = i + 1
                                    his_ids.push(adshow_history1._id)
                                    if(i == count_)
                                    {
                                        res.send({ status : 1 , msg : "Adshow started..." , data : {history_ids : his_ids} });
                                    }
                                }
                            })
                            
                         })*/
                    
                
                      /*
                        let f_balance = nuserData.point_balance;
                        let date_ = new Date;
                        let count_ = result.length
                        let i = 0 ;
                        let new_amount = 0;

                        result.forEach(element =>{

                            console.log(element)
                            new_amount = f_balance +  element.points
                            console.log(new_amount)

                            let wallet = new Nuser_Wallet({
                                user_id : user_id,
                                wallet_type:1,// 1 for credit 2 for debit
                                details_type: 1,// credit ( 1 for advertise , 2 for delete(refund - or transaction return), 3 for bonus) , debit (1 for adpost)
                                advertise_type : req.body.adtype_id ,//  -1 for othes ,  ad type 1 for banner , 2 for half banner , 3 for full screen 
                                details_id: element._id,// credit (Online table_id , Refund (advertise id ) , debit (advertise id)
                                old_point:f_balance,
                                new_point:new_amount,
                                point:element.points,
                                status_msg:"",
                                cdate:date_
                            })
                            f_balance = new_amount
                            wallet.save(function(err , wallt1)
                            {
                                i = i + 1
                                //f_balance = wallt1.new_point

                                if(i == count_)
                                {
                                    NUser.findOneAndUpdate({_id : user_id},{$set : {point_balance : new_amount , update_date: date_ }} , function(err , nuser){
                                        if(err)
                                        {
                                           res.send({status : 0  , msg : "something went wrong .", err : err.message}) 
                                        }
                                        else
                                        {
                                            res.send({ status : 1 , msg : "Adshow successfully balance credited in your account." , data : "" });  
                                        }
                                    })
                                }
                                
                            })
                            
                        })
                        */
                       //res.send({ status : 1 , msg : "advertise details get." , data : {"result":result  , ad_ids :ids_}});
                    }
                        //res.send({ status : 1 , msg : "advertise details get." , data : {"result":result  , ad_ids :ids_}});
                });
        }
    })
}
exports.finish_adshow = function(req , res)
{
    //console.log(req.body)
    NCommonFile.nuser_check_authWithData(req.headers.token , (err , nuserData)=>{
        console.log(nuserData)
        if(err)
        {
            res.send({status:0 , msg: err});
        }
        else
        {
           // let ad_ids = []//req.body.ad_id;
           let user_id = nuserData._id
            let total_points = req.body.total_points
            let history_ids_ = []
            history_ids_ = req.body.history_ids

            if(history_ids_ == undefined)
            return res.send({status : 0 , msg : "download latest version of this app."})

            //console.log(nuserData)
            AdShow_History.find({nuser_id : user_id , _id :{$in : history_ids_.map(ObjectID)} , is_status : 0 , is_paid : false},function(err , adhistoryDatas)
            {
                //console.log(adhistoryDatas)
                if(adhistoryDatas.length > 0)
                {
                    let f_balance = nuserData.point_balance;
                    let date_ = new Date;
                    let count_ = adhistoryDatas.length
                    let i = 0 ;
                    let new_amount = 0;
                    NCommonFile.pay_refrel_temparary(history_ids_ ,user_id ,(err , val)=>{console.log("Referel point credited to upper team.")})
                   // res.send({status : 0 , msg :""})

                    adhistoryDatas.forEach(element =>
                        {
                            console.log(element)
                           // NCommonFile.pay_refrel_temparary( element._id,user_id ,(err , val)=>{console.log("Referel point credited to upper team.")})

                           AdMaster.update({_id : element.advertise_id},{$inc : {totaluser_visitor: 1}},function(err , upp){})
                            new_amount = f_balance +  element.points
                           
                            console.log(new_amount)
                            let wallet = new Nuser_Wallet({
                                user_id : user_id,
                                wallet_type:1,
                                details_type: 1,
                                advertise_type : req.body.adtype_id ,
                                details_id: element.advertise_id,
                                old_point:f_balance,
                                new_point:new_amount,
                                point:element.points,
                                status_msg:"",
                                cdate:date_
                            })
                            f_balance = new_amount
                            wallet.save(function(err , wallt1)
                            {
                                //f_balance = wallt1.new_point
                                AdShow_History.findOneAndUpdate({_id : element._id},{$set :{is_status : 1 , is_paid:true , udate : date_}},function(err , adshow_history2){
                                    if(adshow_history2)
                                    {
                                        i = i + 1
                                        console.log('-----i----'+i)
                                        console.log('-----lenth----'+count_)
                                        if(i == count_)
                                        {
                                            console.log('-----in final stage----')
                                            NUser.findOneAndUpdate({_id : user_id},{$set : {point_balance : new_amount , update_date: date_ }} , function(err , nuser){
                                                if(err)
                                                {
                                                    res.send({status : 0  , msg : "something went wrong .", err : err.message}) 
                                                }
                                                else
                                                {
                                                    console.log("Adshow successfully balance credited in your account."+err)
                                                    res.send({ status : 1 , msg : "Adshow successfully balance credited in your account." , data : "" });  
                                                }
                                            })
                                        }
                                    }
                                    else
                                    {
                                        console.log(err)
                                     res.send({status : 0 , msg : err})
                                    }
                                }) 
                            })
                            
                        })
                        
                  }   
                  else
                  {
                    res.send({status : 0 , msg : "Advertise already view by you."})
                  }             
            })
        }
    })
    

}
exports.get_downlevel = function(req , res)
{
    let user_id = req.body.user_id;
    NCommonFile.nuser_getupper_level(user_id , (err , level_data )=>
    {
        let total_level = level_data.length
        console.log('total upper level --'+total_level)
        console.log('  level Data -- '+level_data)
        res.send({status :1 , msg :"", data: level_data})
    })//.pay_refrel_temparary(history_ids_ ,user_id ,(err , val)=>{console.log("Referel point credited to upper team.")})

}
function XXX ( admaster, callback)
{
                        let ar_type_one = []
                        let ar_type_two = []
                        let ar_type_other = []
                     
                        let total_view_ads = 0

                        if(admaster.length == 0)
                        {
                            let respo_ = {ar : ar_type_other , pr : 0}
                            callback(null , respo_)
                             return ""
                        }
                        else
                        {
                        // console.log(element.length)
                        admaster.forEach(element  => 
                            { //console.log(element.is_viewed+' ----0000000000000000000000000000000')
                                        if(element.is_viewed == undefined || element.is_viewed == false)
                                        {
                                            //console.log(element)
                                            let data = {ad_id : element._id ,ad_second : element.final_sec, adtype_id: element.adtype_id ,point :element.points} ;
                                            if(element.adtype_id == 1)
                                            {
                                                ar_type_one.push(data);}
                                            else
                                            if(element.adtype_id == 2)
                                            {
                                                ar_type_two.push(data)}
                                            else
                                            { let ar = [];
                                                ar.push(element._id)
                                                let datapp = {ad_id : ar ,ad_second : element.final_sec, adtype_id: element.adtype_id ,point :element.points} ;
                                                ar_type_other.push(datapp)
                                                }
                                        }
                                        else
                                        {
                                            total_view_ads =  total_view_ads + 1 ;
                                            let data = {ad_id : element._id ,ad_second : 0, adtype_id: element.adtype_id ,point :0} ;
                                            if(element.adtype_id == 1)
                                            {
                                                ar_type_one.push(data);}
                                            else
                                            if(element.adtype_id == 2)
                                            { ar_type_two.push(data)}
                                            else
                                            {
                                                let ar = [];
                                                ar.push(element._id)
                                                let datapp = {ad_id : ar ,ad_second : 0, adtype_id: element.adtype_id ,point :0} ;
                                                ar_type_other.push(datapp)
                                            }
                                        }
                            });
                            let view_percent = (100 * total_view_ads) / admaster.length

                            let div_run_one = ar_type_one.length / 4   // 2.25
                            let lop_run_one = 0 ;
                            if((ar_type_one.length % 4) == 0)
                                lop_run_one = div_run_one
                            else
                                lop_run_one = parseInt(div_run_one + 1) // 2 + 1 == 3

                            let div_run_two = ar_type_two.length / 2
                            let lop_run_two = 0 ;
                            if((ar_type_two.length % 2) == 0)
                            {
                                lop_run_two = div_run_two
                            }
                            else
                                lop_run_two = parseInt(div_run_two + 1)
                            
                            let l = 0 ;
                            for(let k = 0 ; k< lop_run_two ;k = k + 1)
                            {
                                let amt = 0;
                                let val = 0
                                if(ar_type_two.length == 2)
                                val = 1
                                else
                                if((ar_type_two.length % 2) == 0)
                                val = 500
                                else
                                val = (lop_run_two-1)

                                if(k == val)
                                {
                                let ids = [];
                                let second = 0;
                                for(let j = 0 ; j < 1 ; j= j + 1)
                                {
                                    amt = amt + ar_type_two[l].point;
                                    ids.push(ar_type_two[l].ad_id)
                                    if(second < ar_type_two[l].ad_second)
                                    second = ar_type_two[l].ad_second
                                    l = l + 1;
                                }
                                ar_type_other.push({adtype_id:2, point : amt , ad_second: second ,ad_id :ids})
                                }
                                else
                                if(k < lop_run_two)
                                {
                                let ids = [];
                                let second = 0;
                                for(let j = 0 ; j <= 1 ; j = j + 1)
                                {
                                    amt = amt + ar_type_two[l].point;
                                    ids.push(ar_type_two[l].ad_id)
                                    if(second < ar_type_two[l].ad_second)
                                    second = ar_type_two[l].ad_second
                                    l = l + 1;
                                    }
                                ar_type_other.push({adtype_id:2 , point : amt, ad_second: second ,ad_id :ids})
                                }
                            }

                            let i = 0 ;
                            for(let k = 0 ; k < lop_run_one ;k = k + 1)
                            {
                                let amt = 0;
                                let val = 0
                                if(lop_run_one.length == 2)
                                val = 1
                                else
                                if((ar_type_one.length % 4) == 0)
                                val = 500
                                else
                                val = (lop_run_one - 1)

                                if(k == val)
                                {
                                let ids = [];
                                let second = 0;
                                for(let j = 0 ; j < (ar_type_one.length % 4) ; j= j + 1)
                                {
                                    amt = amt + ar_type_one[i].point;
                                    ids.push(ar_type_one[i].ad_id)
                                    if(second < ar_type_one[i].ad_second)
                                    second = ar_type_one[i].ad_second
                                    i = i + 1;
                                }
                                ar_type_other.push({adtype_id:1, point : amt ,ad_second: second ,ad_id :ids})
                                }
                                else
                                if(k < lop_run_one)
                                {
                                let ids = [];
                                let second = 0;
                                for(let j = 0 ; j <= 3 ; j = j + 1)
                                {
                                    amt = amt + ar_type_one[i].point;
                                    ids.push(ar_type_one[i].ad_id)
                                    if(second < ar_type_one[i].ad_second)
                                    second = ar_type_one[i].ad_second
                                    i = i + 1;
                                    }
                                ar_type_other.push({adtype_id:1 , point : amt ,ad_second: second ,ad_id :ids})
                                }
                            }
                            //let rem_run_two = ar_type_two.length % 2

                            sortJsonArray(ar_type_other, 'ad_id','asc');
                            let respo_ = {ar : ar_type_other , pr : view_percent}
                            callback(null , respo_)
                        }

                       
                        //res.send({status : 1 , msg : "advertise get successfully.", data :  ar_type_other})
}
function XXX1 ( admaster, callback)
{
                        let ar_type_one = []
                        let ar_type_two = []
                        let ar_type_other = []
                     
                        let total_view_ads = 0
                       // console.log(element.length)
                        admaster.forEach(element  => 
                          {
                                        console.log(element.is_viewed+' ----0000000000000000000000000000000')
                                       // console.log(element)
                                       // console.log('')
                                        if(element.is_viewed == undefined || element.is_viewed == false)
                                        {
                                            let data = {ad_id : element._id ,ad_second : element.final_sec, adtype_id: element.adtype_id ,point :element.points} ;
                                            if(element.adtype_id == 1)
                                            {
                                                ar_type_one.push(data);}
                                            else
                                            if(element.adtype_id == 2)
                                            {
                                              //let data = {ad_id : element._id,ad_point :element.points} ;  
                                              ar_type_two.push(data)}
                                            else
                                            {
                                                let ar = [];
                                                ar.push(element._id)
                                                let datapp = {ad_id : ar ,ad_second : element.final_sec, adtype_id: element.adtype_id ,point :element.points} ;
                                                ar_type_other.push(datapp)
                                              }
                                        }
                                        else
                                        {
                                            total_view_ads =  total_view_ads + 1 ;
                                            let data = {ad_id : element._id ,ad_second : 0, adtype_id: element.adtype_id ,point :0} ;
                                            if(element.adtype_id == 1)
                                            {
                                                ar_type_one.push(data);}
                                            else
                                            if(element.adtype_id == 2)
                                            {
                                            //let data = {ad_id : element._id,ad_point :element.points} ;  
                                            ar_type_two.push(data)}
                                            else
                                            {
                                                let ar = [];
                                                ar.push(element._id)
                                                let datapp = {ad_id : ar ,ad_second : 0, adtype_id: element.adtype_id ,point :0} ;
                                                ar_type_other.push(datapp)
                                            }
                                        }
                          });
                        

                          let view_percent = (100 * total_view_ads) / admaster.length

                         // let rem_run_one = ar_type_one.length % 4 
                          let div_run_one = ar_type_one.length / 4
                          let lop_run_one = 0 ;
                          if((ar_type_one.length % 4) == 0)
                                lop_run_one = div_run_one
                          else
                                lop_run_one = parseInt(div_run_one + 1)
                          console.log('-----------------------------')
                          console.log(ar_type_one.length)
                          console.log(lop_run_one)
                          console.log('-----------------------------')


                          let div_run_two = ar_type_two.length / 2
                          let lop_run_two = 0 ;
                          if((ar_type_two.length % 2) == 0)
                                lop_run_two = div_run_two
                          else
                                lop_run_two = parseInt(div_run_two + 1)
                          console.log('-----------------------------')
                          console.log(ar_type_two.length)
                          console.log(lop_run_two)
                          console.log('-----------------------------')

                          let l = 0 ;
                          for(let k = 0 ; k< lop_run_two ;k = k + 1)
                          {
                              let amt = 0;
                              if(k == (lop_run_two-1))
                              {
                                let ids = [];
                                let second = 0;
                                for(let j = 0 ; j <= 1 ; j= j + 1)
                                {
                                    amt = amt + ar_type_two[l].point;
                                    ids.push(ar_type_two[l].ad_id)
                                    if(second < ar_type_two[l].ad_second)
                                    second = ar_type_two[l].ad_second

                                    l = l + 1;
                                }
                                ar_type_other.push({adtype_id:2, point : amt , ad_second: second ,ad_id :ids})
                              }
                              else
                              if(k < lop_run_one)
                              {
                                let ids = [];
                                let second = 0;
                                for(let j = 0 ; j <= 1 ; j = j + 1)
                                {
                                    amt = amt + ar_type_two[l].point;
                                    ids.push(ar_type_two[l].ad_id)
                                    if(second < ar_type_two[l].ad_second)
                                    second = ar_type_two[l].ad_second
                                    l = l + 1;
                                   }
                                ar_type_other.push({adtype_id:2 , point : amt, ad_second: second ,ad_id :ids})
                              }
                           }

                          let i = 0 ;
                          for(let k = 0 ; k< lop_run_one ;k = k + 1)
                          {
                              let amt = 0;
                              
                              if(k == lop_run_one)
                              {
                                let ids = [];
                                let second = 0;
                                for(let j = 0 ; j < (ar_type_one.length % 4) ; j= j + 1)
                                {
                                    amt = amt + ar_type_one[i].point;
                                    ids.push(ar_type_one[i].ad_id)
                                    if(second < ar_type_one[i].ad_second)
                                    second = ar_type_one[i].ad_second
                                    i = i + 1;
                                }
                                ar_type_other.push({adtype_id:1, point : amt ,ad_second: second ,ad_id :ids})
                              }
                              else
                              if(k < lop_run_one)
                              {
                                let ids = [];
                                let second = 0;
                                for(let j = 0 ; j <= 3 ; j = j + 1)
                                {
                                    amt = amt + ar_type_one[i].point;
                                    ids.push(ar_type_one[i].ad_id)
                                    if(second < ar_type_one[i].ad_second)
                                    second = ar_type_one[i].ad_second
                                    i = i + 1;
                                   }
                                ar_type_other.push({adtype_id:1 , point : amt ,ad_second: second ,ad_id :ids})
                              }
                           }
                          //let rem_run_two = ar_type_two.length % 2

                          sortJsonArray(ar_type_other, 'ad_id','asc');
                          let respo_ = {ar : ar_type_other , pr : view_percent}
                           callback(null , respo_)
                        //res.send({status : 1 , msg : "advertise get successfully.", data :  ar_type_other})
}
function contains(arr, key, val) {
    
    for(var element  of arr)
    {
        if((element[key]).equals(val))
        return true
    }
    return false;
}
/*
                                    let custome_admaster = []
                                    if(adshowhistory.length == 0)
                                    {
                                        admaster.forEach(element=>{
                                            if(element.totaluser_visitor < element.totaluser_for_ads)
                                                    custome_admaster.push(element)
                                        })
                                        //console.log(custome_admaster)
                                        XXX(custome_admaster,(err , response)=>{
                                            if(err)
                                            {
    
                                            }
                                            else
                                            {
                                                res.send({status : 1 , msg : "advertise get successfully.--", data :  response.ar , percent : response.pr}) 
                                            }
                                        })
                                    }
                                    else
                                    {
                                        admaster.forEach(element =>
                                            {
                                               // console.log(_.find(adshowhistory , "advertise_id",element._id))
                                               let f_f = false ;
                                               let f_adhist = undefined
                                                
                                                adshowhistory.forEach(elemt_1 =>
                                                    {
                                                        if((elemt_1.advertise_id).equals(element._id))//if(ObjectId(elemt_1.advertise_id) === ObjectId(element._id))
                                                        {
                                                            console.log('id_matched -- '+element._id)
                                                            console.log(elemt_1.advertise_id + '-------in--------'+element._id)
                                                            f_adhist = elemt_1
                                                            f_f = true
                                                        }
                                                        else
                                                        {
                                                            console.log('id_matched not -- '+element._id)
                                                            console.log(elemt_1.advertise_id + '--------not-------'+element._id)
                                                        }
                                                    })
                                                 
                                               console.log('-- f_val --'+f_f)
                                                if(f_f)
                                                {
                                                    if(f_adhist.is_team_paid == true)
                                                    {
                                                        // yesterday or very old record
                                                    }
                                                    else 
                                                    {
                                                       let d_element = element;
                                                         d_element["is_viewed"] = true
                                                        custome_admaster.push(d_element)
                                                    }
                                                }
                                                else
                                                {
                                                    if(element.totaluser_visitor < element.totaluser_for_ads)
                                                    custome_admaster.push(element)
                                                }
                                            })
                                            XXX(custome_admaster,(err , response)=>{
                                                if(err)
                                                {
        
                                                }
                                                else
                                                {
                                                    res.send({status : 1 , msg : "advertise get successfully--.", data :  response.ar , percent : response.pr}) 
                                                }
                                            })   
                                    }
                                    */