const Ad_show_history = require('../../models/nuser_model/adshow_history.model')
const Nuser = require('../../models/nuser_model/nuser.model')
const AdMaster = require('../../models/adMaster.model')
var dateFormat = require('dateformat');
const Target_History = require('../../models/target_history.model')
const NUserWallet  = require('../../models/nuser_wallet.model')
const Cron_activity = require('../../models/Cron/cron_activity.model')

const Withdraw = require('../../models/withdraw_request.model')

ObjectID = require('mongodb').ObjectID;


exports.count_history = function(req , res)
{
    console.log('running a task every minute ');
    var day_i=dateFormat(new Date(req.body.ddt), "yyyymmdd");
        console.log(day_i)
        var day=dateFormat(new Date(req.body.ddt), "yyyy-mm-dd");
        Nuser.find({is_approve : 1 , is_active : true ,"create_date" : { $lt: new Date(day+"T18:29:00Z").toISOString()}} , function(err , nUserData)//2019-01-08 05:56:05.983Z
        {
            if(err)
            {
                console.log("err + "+err)
            }
            else
            {
               /* AdMaster.find({is_active : true ,is_approve : 1 , is_status : 1},{ _id : 1}, function(err , admasterids){
                    if(err)
                    {
                        console.log("err + "+err)
                    }
                    else
                    {*/
                      console.log('user count --'+nUserData.length)
                        ///let i = 0
                        nUserData.forEach(useelement =>
                            {
                                //var day=dateFormat(new Date(), "yyyy-mm-dd");
                
                                // var day=dateFormat(new Date(new Date().setDate(new Date().getDate()-1)), "yyyy-mm-dd");
                                 //var day_today=dateFormat(new Date(new Date().setDate(new Date().getDate())), "yyyy-mm-dd");
                                
                                
                                 var day_today=dateFormat(new Date(new Date().setDate(new Date(req.body.ddt).getDate()-1)), "yyyy-mm-dd");
                                 let admasterids = []

                                  /*  Ad_show_history.find({nuser_id : ObjectID(useelement._id) , is_status : 1 ,"cdate" : { $lt: new Date(day+"T18:29:00Z").toISOString()}},{advertise_id : 1},function(err , adhistoryDatas_old){
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
                                             Ad_show_history.find({nuser_id : ObjectID(useelement._id) , is_status : 1 ,"cdate" : { $lt: new Date(day_today+"T18:29:59Z").toISOString(), $gte: new Date(day+"T18:30:00Z").toISOString()}},{advertise_id : 1},function(err , adhistoryDatas)
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
                                                         let total_viewd = 0
                                                         adshowData.forEach(element =>
                                                             {
                                                                 let f_f = false ; 
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
                                                                     total_viewd = total_viewd + 1 ;
                                                                 }
                                                                 else
                                                                 {
                                                                     element["is_viewed"] = false ;
                                                                 }
                         
                                                                 custome_admaster.push(element)
                                                             })
                                                         
                                                             
                                                             let total_ads = custome_admaster.length

                                                            

                                                             let percent = (total_viewd * 100 )/ total_ads

                                                             if(total_ads == 0)
                                                             percent = 0

                                                             let target_history = new Target_History({
                                                                nuser_id :useelement._id,
                                                                achive_target :percent,
                                                                total_ads :total_ads,
                                                                total_viewed_ads : total_viewd,
                                                                target_date : day_i,
                                                                cdate: new Date()
                                                             })
                                                             target_history.save(function(err , targ)
                                                             {
                                                                 if(err)
                                                                 {
                                                                     console.log(" Target History error"+target_history+" "+err)
                                                                 }
                                                                 else
                                                                 {
                                                                     console.log("target History saved")
                                                                     console.log('-date-'+new Date())
                                                                 }
                                                             })
                                                             
                                                     }).sort(
                                                     { 
                                                         "adtype_id" : 1
                                                     })
                                                 })
                                         }
                                         else
                                         {*/
                                            // admasterids.forEach(element =>
                                            //     {
                                            //         let f_f = true 
                                              //      adhistoryDatas_old.forEach(elemt_1=>{
                                              //           if((elemt_1.advertise_id).equals(element._id))
                                              //           {
                                              //               f_f = false 
                                              //           }
                                              //       })
                                                //     if(f_f == true)
                                                //     {
                                                //        old_hisotry_id.push(elemt_1.advertise_id)
                                               //      }
                                                // })
                                                console.log({nuser_id : ObjectId(useelement._id) , is_status : 1 ,"cdate" : { $lt: new Date(day_today+"T18:29:59Z").toISOString(), $gte: new Date(day+"T18:30:00Z").toISOString()}})
                                                 Ad_show_history.find({nuser_id : ObjectId(useelement._id) , is_status : 1 ,"cdate" : { $lt: new Date(day_today+"T18:29:59Z").toISOString(), $gte: new Date(day+"T18:30:00Z").toISOString()}},{advertise_id : 1},function(err , adhistoryDatas)
                                                 {
                                                     let all_ids = []
                                                     /*old_hisotry_id.forEach(element =>
                                                         {
                                                             all_ids.push(element._id)
                                                         })*/
                                                         
                                                     adhistoryDatas.forEach(element =>
                                                         {
                                                             all_ids.push(element.advertise_id)
                                                         })
                                                         console.log("ad_ids -- "+all_ids.length)
                                                     AdMaster.find({ _id : {$in : all_ids.map(ObjectID)}},function(err,adshowData)
                                                     {
                                                         let custome_admaster = []
                                                         let total_viewd = 0


                                                         console.log("ad_ids -- "+adshowData.length)
                                                         adshowData.forEach(element =>
                                                             {
                                                                 let f_f = false ; 
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
                                                                     total_viewd = total_viewd + 1 ;
                                                                 }
                                                                 else
                                                                 {
                                                                     element["is_viewed"] = false ;
                                                                 }
                         
                                                                 custome_admaster.push(element)
                                                             })
                                                         
                                                             
                                                             let total_ads = custome_admaster.length

                                                            

                                                             let percent = (total_viewd * 100 )/ total_ads

                                                             if(total_ads == 0)
                                                             percent = 0

                                                             let target_history = new Target_History({
                                                                nuser_id :useelement._id,
                                                                achive_target :percent,
                                                                total_ads :total_ads,
                                                                total_viewed_ads : total_viewd,
                                                                target_date : day_i,
                                                                cdate: new Date()
                                                             })
                                                             target_history.save(function(err , targ)
                                                             {
                                                                 if(err)
                                                                 {
                                                                     console.log(" Target History error"+target_history+" "+err)
                                                                 }
                                                                 else
                                                                 {
                                                                     console.log("target History saved")
                                                                     console.log('-date-'+new Date())
                                                                 }
                                                             })
                                                     }).sort(
                                                     { 
                                                         "adtype_id" : 1
                                                     })
                                                 })
                                        /* }
                                     }
                                     
                                     //console.log(adhistoryDatas_old)
                                 })*/
                            })

                           //AdMaster.findOneAndUpdate({ _id : req.body.advertise_id}, {$set: {is_approve:req.body.is_approve , points : points , status_msg : req.body.status_msg ,is_status : 0}}, function (err, adData)    
                   // }
                //}) 
            }
        })
      
}
exports.calculate_points = function(req , res)
{
    console.log('running a task every minute ');
        //var day_i=dateFormat(new Date(new Date().setDate(new Date().getDate()-1)), "yyyymmdd");
        var day_i=dateFormat(new Date(req.body.ddt), "yyyymmdd");
        console.log(day_i)
        
                    Nuser.find({is_approve : 1 , is_active : true } , function(err , nUserData)//2019-01-08 05:56:05.983Z
                    {
                        if(err)
                        {
                            console.log("err + "+err)
                        }
                        else
                        {
                            AdMaster.find({is_active : true ,is_approve : 1 , is_status : 1},{ _id : 1}, function(err , admasterids){
                                if(err)
                                {
                                    console.log("err + "+err)
                                }
                                else
                                {
                                  
                                    ///let i = 0
                                    nUserData.forEach(useelement =>
                                        {
                                            //var day=dateFormat(new Date(), "yyyy-mm-dd");
                            
                                            // var day=dateFormat(new Date(new Date().setDate(new Date().getDate()-1)), "yyyy-mm-dd");
                                             //var day_today=dateFormat(new Date(new Date().setDate(new Date().getDate())), "yyyy-mm-dd");
                                            
                                             var day=dateFormat(new Date(req.body.ddt), "yyyy-mm-dd");
                                             var day_today=dateFormat(new Date(new Date().setDate(new Date(req.body.ddt).getDate()-1)), "yyyy-mm-dd");
                                             
                                                Ad_show_history.find({nuser_id : ObjectID(useelement._id) , is_status : 1 ,"cdate" : { $lt: new Date(day+"T18:29:00Z").toISOString()}},{advertise_id : 1},function(err , adhistoryDatas_old){
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
                                                         Ad_show_history.find({nuser_id : ObjectID(useelement._id) , is_status : 1 ,"cdate" : { $lt: new Date(day_today+"T18:29:59Z").toISOString(), $gte: new Date(day+"T18:30:00Z").toISOString()}},{advertise_id : 1},function(err , adhistoryDatas)
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
                                                                     let total_viewd = 0
                                                                     adshowData.forEach(element =>
                                                                         {
                                                                             let f_f = false ; 
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
                                                                                 total_viewd = total_viewd + 1 ;
                                                                             }
                                                                             else
                                                                             {
                                                                                 element["is_viewed"] = false ;
                                                                             }
                                     
                                                                             custome_admaster.push(element)
                                                                         })
                                                                     
                                                                         
                                                                         let total_ads = custome_admaster.length
    
                                                                        
    
                                                                         let percent = (total_viewd * 100 )/ total_ads
    
                                                                         if(total_ads == 0)
                                                                         percent = 0
    
                                                                         let target_history = new Target_History({
                                                                            nuser_id :useelement._id,
                                                                            achive_target :percent,
                                                                            total_ads :total_ads,
                                                                            total_viewed_ads : total_viewd,
                                                                            target_date : day_i,
                                                                            cdate: new Date()
                                                                         })
                                                                        /* target_history.save(function(err , targ)
                                                                         {
                                                                             if(err)
                                                                             {
                                                                                 console.log(" Target History error"+target_history+" "+err)
                                                                             }
                                                                             else
                                                                             {
                                                                                 console.log("target History saved")
                                                                                 console.log('-date-'+new Date())
                                                                             }
                                                                         })
                                                                         */
                                                                 }).sort(
                                                                 { 
                                                                     "adtype_id" : 1
                                                                 })
                                                             })
                                                     }
                                                     else
                                                     {
                                                         admasterids.forEach(element =>
                                                             {
                                                                 let f_f = true 
                                                                 adhistoryDatas_old.forEach(elemt_1=>{
                                                                     if((elemt_1.advertise_id).equals(element._id))
                                                                     {
                                                                         f_f = false 
                                                                     }
                                                                 })
                                                                 if(f_f == true)
                                                                 {
                                                                     old_hisotry_id.push(element)
                                                                 }
                                                             })
                                                             Ad_show_history.find({nuser_id : ObjectID(useelement._id) , is_status : 1 ,"cdate" : { $lt: new Date(day_today+"T18:29:59Z").toISOString(), $gte: new Date(day+"T18:30:00Z").toISOString()}},{advertise_id : 1},function(err , adhistoryDatas)
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
                                                                     let total_viewd = 0
                                                                     adshowData.forEach(element =>
                                                                         {
                                                                             let f_f = false ; 
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
                                                                                 total_viewd = total_viewd + 1 ;
                                                                             }
                                                                             else
                                                                             {
                                                                                 element["is_viewed"] = false ;
                                                                             }
                                     
                                                                             custome_admaster.push(element)
                                                                         })
                                                                     
                                                                         
                                                                         let total_ads = custome_admaster.length
    
                                                                        
    
                                                                         let percent = (total_viewd * 100 )/ total_ads
    
                                                                         if(total_ads == 0)
                                                                         percent = 0
    
                                                                         let target_history = new Target_History({
                                                                            nuser_id :useelement._id,
                                                                            achive_target :percent,
                                                                            total_ads :total_ads,
                                                                            total_viewed_ads : total_viewd,
                                                                            target_date : day_i,
                                                                            cdate: new Date()
                                                                         })
                                                                         target_history.save(function(err , targ)
                                                                         {
                                                                             if(err)
                                                                             {
                                                                                 console.log(" Target History error"+target_history+" "+err)
                                                                             }
                                                                             else
                                                                             {
                                                                                 console.log("target History saved")
                                                                                 console.log('-date-'+new Date())
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
                                        })

                                       //AdMaster.findOneAndUpdate({ _id : req.body.advertise_id}, {$set: {is_approve:req.body.is_approve , points : points , status_msg : req.body.status_msg ,is_status : 0}}, function (err, adData)    
                                }
                            }) 
                        }
                    })
                  
        console.log('running a task every second');
}

exports.payment_send = function(req , res){
    console.log('Payment send cron start');
    var day_i=dateFormat(new Date(new Date().setDate(new Date().getDate()-1)), "yyyymmdd");
    Target_History.find({achive_target :{$gte : 99} , target_date : day_i},function(err , target_achive_usersData)
    {
            var day=dateFormat(new Date(new Date().setDate(new Date().getDate()-2)), "yyyy-mm-dd");
            var day_today=dateFormat(new Date(new Date().setDate(new Date().getDate()-1)), "yyyy-mm-dd");
            console.log(target_achive_usersData.length)
            let user_ids = []
            target_achive_usersData.forEach(element =>
                {
                    user_ids.push(element.nuser_id)
                })
            NUserWallet.find({user_id : {$in : user_ids.map(ObjectID)},wallet_type : 1 , details_type : 2 , ispoint_temp : 1,"cdate" : { $lt: new Date(day_today+"T18:29:59Z").toISOString(), $gte: new Date(day+"T18:30:00Z").toISOString()}},function(err , wallet_data)
            {
                if(err)
                {

                }
                else
                {
                    //console.log(wallet_data)
                    let history_ids = []
                    wallet_data.forEach(element =>
                      {
                          history_ids.push(element.details_id)
                      })
                    NUserWallet.updateMany({user_id : {$in : user_ids.map(ObjectID)},wallet_type : 1 , details_type : 2 , ispoint_temp : 1,"cdate" : { $lt: new Date(day_today+"T18:29:59Z").toISOString(), $gte: new Date(day+"T18:30:00Z").toISOString()}},{$set :{ispoint_temp : 2}},function(err , dataupdated)
                    {
                        if(err){}
                        else
                        {
                            
                          console.log(dataupdated + " document(s) updated");

                          // Rejected for user
                          NUserWallet.updateMany({wallet_type : 1 , details_type : 2 , ispoint_temp : 1,"cdate" : { $lt: new Date(day_today+"T18:29:59Z").toISOString(), $gte: new Date(day+"T18:30:00Z").toISOString()}},{$set :{ispoint_temp : 3}},function(err , dataupdated1)
                          {
                              if(err){}
                              else
                              {
                                  console.log(dataupdated1 + " document(s) updated");
                                  Ad_show_history.updateMany({_id : {$in : history_ids.map(ObjectID)},is_team_paid : false},{$set :{is_team_paid : true}},function(err,adhistory_update){
                                      if(err)
                                      {

                                      }
                                      else
                                      {
                                          console.log(adhistory_update+" Document updated")
                                      }
                                  })
                              }
                                  
                          })
                        }
                          
                    })
                }
            })
    })
    console.log('Payment send cron finish');
}

exports.payment_credit = function(req , res)
{
    console.log('Payment point Start');
    var day=dateFormat(new Date(new Date().setDate(new Date().getDate()-2)), "yyyy-mm-dd");
    var day_today=dateFormat(new Date(new Date().setDate(new Date().getDate()-1)), "yyyy-mm-dd");
   NUserWallet.aggregate([
        { 
            "$match" : {
                "wallet_type" : 1, 
                "details_type" : 2, 
                "ispoint_temp" : 2, 
                "cdate" : { $lt: new Date(day_today+"T18:29:59Z"), $gte: new Date(day+"T18:30:00Z")}
                //"cdate" : { $lt: (new Date(day_today+"T18:29:59Z")).toISOString(), $gte: (new Date(day+"T18:30:00Z")).toISOString()}
            }
        }, 
        { 
            "$group" : {
                "_id" :  "$user_id", 
                "total_point" : {
                    "$sum" : "$point"
                }
            }
        }
    ],function(err , result_data)
    {
        final_point_credit(result_data);
    })
    console.log('Payment point Finish');
}

function final_point_credit1 (result_data)
  {
    let data_leth = result_data.length

    //  console.log('---------------------------------------')
    //  console.log(result_data)
    //  console.log(err)
    //  console.log('---------------------------------------')
     //console.log('user_id -- '+result_data[0]._id)
     // console.log('points -- '+result_data[0].total_point)
      // AdMaster.update({_id : element.advertise_id},{$inc : {totaluser_visitor: 1}},function(err , upp){})
      var day_today=dateFormat(new Date(new Date().setDate(new Date().getDate()-1)), "yyyy-mm-dd");
      for(let i = 0 ; i< data_leth ; i = i + 1)
      {
          Nuser.findOneAndUpdate({_id : result_data[i]._id} , {$inc : {point_balance : result_data[i].total_point}}, function(err , update_usertable)
          {
              if(err)
              {
                  console.log(err+'-- Update problem in NUsers table  --'+result_data[i].user_id)
              }
              else
              {
                  let total_p = (update_usertable.point_balance + result_data[i].total_point)

                  let nusewallet = new NUserWallet({
                      user_id :result_data[i]._id,
                      wallet_type:1,// 1 for credit 2 for debit
                      details_type: 6,// credit ( 1 for advertise self, 2 for advetise downline temp, 3 for referel , 4 refund(withdrow reject) , 5 bonus , 6 downline wallet added), debit (1 for withdrow)
                      advertise_type : -2 ,// ad type 1 for banner , 2 for half banner , 3 for full screen 
                      //details_id: {type: Schema.Types.ObjectId,ref: 'AdMaster'},// credit (Online table_id , Refund (advertise id ) , debit (advertise id)
                      old_point: update_usertable.point_balance,
                      new_point: total_p,
                      point: result_data[i].total_point,
                      status_msg: day_today+" Downline Bonus Added.",
                      cdate: new Date()
                  })
                  nusewallet.save(function(err , datasaved)
                  {
                      if(err)
                      {
                          console.log(err+'-- downline earning provided  --'+result_data[i].user_id)
                      }
                      else
                      {
                          console.log('-- downline earning provided  --'+result_data[i].user_id)
                      }
                  })
              }
          })
          
      }
  }

  //------------------------------------------------------------------------------

exports.update_downline_temp = function(req , res)
{
    console.log('Payment send cron start');
    var day_i=dateFormat(new Date(req.body.ddt), "yyyymmdd");
    var day=dateFormat(new Date(new Date().setDate(new Date(req.body.ddt).getDate()-1)), "yyyy-mm-dd");
    var day_today=dateFormat(new Date(new Date().setDate(new Date(req.body.ddt).getDate())), "yyyy-mm-dd");

    console.log(day_i)
    console.log(day)
    console.log(day_today)
    //return res.send({test :0})

    Target_History.find({achive_target :{$gte : 99} , target_date : day_i},function(err , target_achive_usersData)
    {
            
            console.log(target_achive_usersData.length)
            let user_ids = []
            target_achive_usersData.forEach(element =>
                {
                    user_ids.push(element.nuser_id)
                })
            NUserWallet.find({user_id : {$in : user_ids.map(ObjectID)},wallet_type : 1 , details_type : 2 , ispoint_temp : 1,"cdate" : { $lt: new Date(day_today+"T18:29:59Z").toISOString(), $gte: new Date(day+"T18:30:00Z").toISOString()}},function(err , wallet_data)
            {
                if(err)
                {

                }
                else
                {
                    //console.log(wallet_data)
                    let history_ids = []
                    wallet_data.forEach(element =>
                      {
                          history_ids.push(element.details_id)
                      })
                    NUserWallet.updateMany({user_id : {$in : user_ids.map(ObjectID)},wallet_type : 1 , details_type : 2 , ispoint_temp : 1,"cdate" : { $lt: new Date(day_today+"T18:29:59Z").toISOString(), $gte: new Date(day+"T18:30:00Z").toISOString()}},{$set :{ispoint_temp : 2}},function(err , dataupdated)
                    {
                        if(err){}
                        else
                        {
                            
                          console.log(dataupdated + " document(s) updated");

                          // Rejected for user
                          NUserWallet.updateMany({wallet_type : 1 , details_type : 2 , ispoint_temp : 1,"cdate" : { $lt: new Date(day_today+"T18:29:59Z").toISOString(), $gte: new Date(day+"T18:30:00Z").toISOString()}},{$set :{ispoint_temp : 3}},function(err , dataupdated1)
                          {
                              if(err){}
                              else
                              {
                                  console.log(dataupdated1 + " document(s) updated");
                                  Ad_show_history.updateMany({_id : {$in : history_ids.map(ObjectID)},is_team_paid : false},{$set :{is_team_paid : true}},function(err,adhistory_update){
                                      if(err)
                                      {

                                      }
                                      else
                                      {
                                          console.log(adhistory_update+" Document updated")
                                      }
                                  })
                              }
                                  
                          })
                        }
                          
                    })
                }
            })
    })
    console.log('Payment send cron finish');
}

exports.update_final_wallet = function(req , res)
{
    console.log('Payment point Start');
    var day=dateFormat(new Date(new Date().setDate(new Date(req.body.ddt).getDate()-1)), "yyyy-mm-dd");
    var day_today=dateFormat(new Date(new Date().setDate(new Date(req.body.ddt).getDate())), "yyyy-mm-dd");
   NUserWallet.aggregate([
        { 
            "$match" : {
                "wallet_type" : 1, 
                "details_type" : 2, 
                "ispoint_temp" : 2, 
                "cdate" : { $lt: new Date(day_today+"T18:29:59Z"), $gte: new Date(day+"T18:30:00Z")}
                //"cdate" : { $lt: (new Date(day_today+"T18:29:59Z")).toISOString(), $gte: (new Date(day+"T18:30:00Z")).toISOString()}
            }
        }, 
        { 
            "$group" : {
                "_id" :  "$user_id", 
                "total_point" : {
                    "$sum" : "$point"
                }
            }
        }
    ],function(err , result_data)
    {
        final_point_credit(result_data ,req.body.ddt);
    })
    console.log('Payment point Finish');
}
function final_point_credit (result_data , cdate)
{
  let data_leth = result_data.length

  //  console.log('---------------------------------------')
  //  console.log(result_data)
  //  console.log(err)
  //  console.log('---------------------------------------')
   //console.log('user_id -- '+result_data[0]._id)
   // console.log('points -- '+result_data[0].total_point)
    // AdMaster.update({_id : element.advertise_id},{$inc : {totaluser_visitor: 1}},function(err , upp){})
    var day_today=dateFormat(new Date(new Date().setDate(new Date(cdate).getDate())), "yyyy-mm-dd");
    for(let i = 0 ; i< data_leth ; i = i + 1)
    {
        Nuser.findOneAndUpdate({_id : result_data[i]._id} , {$inc : {point_balance : result_data[i].total_point}}, function(err , update_usertable)
        {
            if(err)
            {
                console.log(err+'-- Update problem in NUsers table  --'+result_data[i].user_id)
            }
            else
            {
                let total_p = (update_usertable.point_balance + result_data[i].total_point)

                let nusewallet = new NUserWallet({
                    user_id :result_data[i]._id,
                    wallet_type:1,// 1 for credit 2 for debit
                    details_type: 6,// credit ( 1 for advertise self, 2 for advetise downline temp, 3 for referel , 4 refund(withdrow reject) , 5 bonus , 6 downline wallet added), debit (1 for withdrow)
                    advertise_type : -2 ,// ad type 1 for banner , 2 for half banner , 3 for full screen 
                    //details_id: {type: Schema.Types.ObjectId,ref: 'AdMaster'},// credit (Online table_id , Refund (advertise id ) , debit (advertise id)
                    old_point: update_usertable.point_balance,
                    new_point: total_p,
                    point: result_data[i].total_point,
                    status_msg: day_today+" Downline Bonus Added.",
                    cdate: new Date(cdate)
                })
                nusewallet.save(function(err , datasaved)
                {
                    if(err)
                    {
                        console.log(err+'-- downline earning provided  --'+result_data[i]._id)
                    }
                    else
                    {
                        console.log('-- downline earning provided  --'+result_data[i]._id)
                    }
                })
            }
        })
        
    }
}
exports.live_ads = function(req , res)
{
    let vdate = new Date();
      AdMaster.updateMany({is_approve : 1 , is_status : 0},{$set :{is_status : 1 , udate: vdate}},function(err , advertise_put_live){
    if(err)
    {
        console.log(err+'push to advertise live Error-- '+vdate)
    }
    else
    {
        console.log('push to advertise live -- '+vdate)
    }
})
}