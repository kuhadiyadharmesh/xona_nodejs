var cron = require('node-cron');

ObjectID = require('mongodb').ObjectID;
const mongoose = require('mongoose');
let dev_db_url = 'mongodb://xona_user:X0nA2Mong0@104.211.77.157:27017/xona?authSource=admin';
//let dev_db_url = 'mongodb://root:netdroidtech123@ds147044.mlab.com:47044/xona';
//let dev_db_url = 'mongodb://@localhost:27017/xona';
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;

const Ad_show_history = require('../../models/nuser_model/adshow_history.model')
const Nuser = require('../../models/nuser_model/nuser.model')
const AdMaster = require('../../models/adMaster.model')
var dateFormat = require('dateformat');
const Target_History = require('../../models/target_history.model')
const NUserWallet  = require('../../models/nuser_wallet.model')
const Cron_activity = require('../../models/Cron/cron_activity.model')

const Withdraw = require('../../models/withdraw_request.model')

const winston = require('winston');

var logger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'test_20190215.log' })
    ]
  });
///////////////////////////////////////////////////////////----- Cron Setup ------///////////////////////////////
//var cron_check = cron.schedule('01 52 19 * * *',()=>{
    //var day_today=dateFormat(new Date(new Date().setDate(new Date('2019-02-14').getDate())), "yyyymmdd");
var cron_check = cron.schedule('01 00 18 * * *',()=>{
    var day_today=dateFormat(new Date(new Date().setDate(new Date().getDate())), "yyyymmdd");
    console.log('check -- service will start in next 30 minutes ...')
    logger =  winston.createLogger({
        transports: [
          new winston.transports.Console(),
          new winston.transports.File({ filename: 'log_'+day_today+'.log' })
        ]
      });
})

  //var cron_target_count = cron.schedule('55 15 19 * * *', () =>{
    // var day_today=dateFormat(new Date(new Date().setDate(new Date('2019-02-15').getDate())), "yyyy-mm-dd");
var cron_target_count = cron.schedule('01 30 18 * * *', () =>{
   var day_today=dateFormat(new Date(new Date().setDate(new Date().getDate())), "yyyy-mm-dd");
    start_calculate_target(day_today)
})

var cron_target_count1 = cron.schedule('01 00 19 * * *', () =>{
    var day_today=dateFormat(new Date(new Date().setDate(new Date().getDate())), "yyyy-mm-dd");
     start_calculate_target(day_today)
 })
/*
// var cron_temparary_point_credit = cron.schedule('30 45 13 * * *',() =>{
  //  var day_today=dateFormat(new Date(new Date().setDate(new Date('2019-02-15').getDate())), "yyyy-mm-dd");
   var cron_temparary_point_credit = cron.schedule('01 30 19 * * *',() =>{
    var day_today=dateFormat(new Date(new Date().setDate(new Date().getDate())), "yyyy-mm-dd");
    start_provide_downlinepoint_temp(day_today)
})
//var cron_final_point_credit = cron.schedule('55 46 13 * * *',()=>{
  //  var day_today=dateFormat(new Date(new Date().setDate(new Date('2019-02-15').getDate())), "yyyy-mm-dd");
    var cron_final_point_credit = cron.schedule('00 35 19 * * *',()=>{
    var day_today=dateFormat(new Date(new Date().setDate(new Date().getDate())), "yyyy-mm-dd");
    start_final_point_credit_part1(day_today)
})
//var cron_advertise_live = cron.schedule('01 20 22 * * *',() =>{
    var cron_advertise_live = cron.schedule('01 31 19 * * *',() =>{
        make_live_ads()
    })*/
/*
var cron_final_point_credit1 = cron.schedule('55 57 10 * * *',()=>{
    var day_today=dateFormat(new Date(new Date().setDate(new Date('2019-02-15').getDate())), "yyyy-mm-dd");
    //var cron_final_point_credit = cron.schedule('00 35 19 * * *',()=>{
    //var day_today=dateFormat(new Date(new Date().setDate(new Date().getDate())), "yyyy-mm-dd");
    start_calculate_target_direct_user(day_today,'5c2f924d5ea372141c2cddd5')
})*/
  ////////////////////////////////////////////////////////////--- Cron Functions ----------//////////////////////////////////////////
function start_calculate_target(ddt)  //exports.calculate_target = function(req , res)
{
      //let ddt = req.body.date
        var day_i=dateFormat(new Date(ddt), "yyyymmdd");
        var day_today=dateFormat(new Date(ddt), "yyyy-mm-dd");
        var day_yesterday=dateFormat(new Date(new Date().setDate(new Date(ddt).getDate()-1)), "yyyy-mm-dd");
        Ad_show_history.aggregate([
            { 
                "$match" : {
                    "is_status" : 1, 
                    "cdate" : { $lt: new Date(day_today+"T18:29:59Z"), $gte: new Date(day_yesterday+"T18:30:00Z")}
                }
            }, 
            { 
                "$group" : {
                    "_id" : "$nuser_id"
                }
            }
        ],function(err , adshow_aggregation_data){
            if(err)
            {
                console.log('-- Ad_show_history calculate_target :-'+err)
                logger.error('-- Ad_show_history calculate_target :-'+err);
            }
            else
            {
                logger.info('Ad_show_history Total user :'+adshow_aggregation_data.length);

                Target_History.find({target_date : day_i},{nuser_id : 1},function(err1 , target_history_counted){
                    if(err1)
                    {
                        console.log('--Target_History calculate_target :-'+err1)
                        logger.error('--Target_History calculate_target :-'+err1);
                    }
                    else
                    {
                        logger.info('--Target_History Total user todays :'+target_history_counted.length);
                        
                        if(target_history_counted.length > 0)//second time history count
                        {
                            //var f_f = false ;
                            let user_ids = []
                            adshow_aggregation_data.forEach(element=>
                                {

                                    if(contains(target_history_counted , "nuser_id",element._id) == false)
                                    {
                                        user_ids.push(element)
                                    }

                                   /*  f_f = false ;
                                     for(var elemt_1 of  target_history_counted )
                                     {  if((elemt_1.nuser_id).equals(element._id))
                                        {
                                            f_f = true ;
                                            break
                                        }
                                     }
                                     if(f_f == false)
                                     {
                                         //user_ids.push(element)
                                        // let val_ = {}
                                        // val["_id"] = element.nuser_id
                                         user_ids.push(element)
                                     }*/
                                     //user_ids.push(val)
                                })
                                point_calculation_func_part2(ddt , user_ids)
                        }
                        else// first time counting..
                        {
                            //var f_f = false ;
                            /*adshow_aggregation_data.forEach(element=>
                                {
                                     user_ids.push(element)
                                })*/
                                point_calculation_func_part2(ddt , adshow_aggregation_data)
                        }
                    }
                })
            }
            //adshow_aggregation_data.forEach()
        })
        //Ad_show_history.find({is_status : 1 ,"cdate" : { $lt: new Date(day_today+"T18:29:59Z").toISOString(), $gte: new Date(day+"T18:30:00Z").toISOString()}},{advertise_id : 1},function(err , adhistoryDatas)
  }
  /*
function start_calculate_target_direct_user(ddt , user_id)  //exports.calculate_target = function(req , res)
  {
        //let ddt = req.body.date
          var day_i=dateFormat(new Date(ddt), "yyyymmdd");
          var day_today=dateFormat(new Date(ddt), "yyyy-mm-dd");
          var day_yesterday=dateFormat(new Date(new Date().setDate(new Date(ddt).getDate()-1)), "yyyy-mm-dd");

          let data =[]
            let pdata = {_id : user_id}
            data.push(pdata)
          point_calculation_func_part2(ddt , pdata)
         // break;
         
          //Ad_show_history.find({is_status : 1 ,"cdate" : { $lt: new Date(day_today+"T18:29:59Z").toISOString(), $gte: new Date(day+"T18:30:00Z").toISOString()}},{advertise_id : 1},function(err , adhistoryDatas)
    }
*/
function point_calculation_func_part2(cdate , user_ids_arr)
{
    console.log('total_user :-'+user_ids_arr.length)
    logger.info('total_user final Process :-'+user_ids_arr.length)
    var day_i=dateFormat(new Date(cdate), "yyyymmdd");
    var day_today=dateFormat(new Date(cdate), "yyyy-mm-dd");
    var day_yesterday=dateFormat(new Date(new Date().setDate(new Date(cdate).getDate()-1)), "yyyy-mm-dd");
    AdMaster.find({is_active : true , is_approve : 1 , is_status : 1 , $expr:{$gt:["$totaluser_for_ads", "$totaluser_visitor"]} , cdate :{ $lt: new Date(day_yesterday+"T18:29:00Z").toISOString()}} , {_id : 1},function(err  , allAdvertiseData){
        if(err)
        {
            console.log("-----point_calculation_func :AdMaster   error ----"+err)
            logger.error("-----point_calculation_func :AdMaster   error ----"+err)
        }
        else
        {
            logger.info("-----point_calculation_func :AdMaster: Active Advertise   user ----"+user_ids_arr.length)
            let i = 0
            user_ids_arr.forEach(useelement =>
                {
                    i = i + 1 ;
                    logger.info("-----point_calculation_func :AdMaster: userStart   user ----"+i+'----'+useelement._id)
                    Ad_show_history.find({nuser_id : ObjectID(useelement._id) , is_status : 1 , cdate :{ $lt: new Date(day_yesterday+"T18:29:00Z").toISOString()}},{advertise_id : 1},function(err1 , oldHistoryData){
                        if(err1)
                        {
                            console.log("-----point_calculation_func :Ad_show_history: OLDHISTORY   error ----"+err1)
                            logger.error("-----point_calculation_func :Ad_show_history: OLDHISTORY   error ----"+err1)
                            logger.error("-----point_calculation_func :Ad_show_history: OLDHISTORY   user ----"+useelement._id)
                        }  
                        else
                        {
                            logger.info("-----point_calculation_func :AdMaster: userStart   user --------"+useelement._id)
                            let old_hisotry_id = []
                            if(oldHistoryData)// History data existed
                            {
                                
                                //old_hisotry_id = allAdvertiseData
                                allAdvertiseData.forEach(element =>
                                    {
                                      if(contains(oldHistoryData , 'advertise_id', element._id ) == false)
                                      old_hisotry_id.push(element)
                                    })
                                /*allAdvertiseData.forEach(element =>
                                    {

                                        for(var elemt_1 of oldHistoryData)
                                        {
                                            if((elemt_1.advertise_id).equals(element._id))
                                            {
                                                old_hisotry_id.push(element)
                                                break
                                            }
                                        }
                                    })
                                    */
                                Ad_show_history.find({nuser_id : ObjectID(useelement._id) , is_status : 1 ,"cdate" : { $lt: new Date(day_today+"T18:29:59Z").toISOString(), $gte: new Date(day_yesterday+"T18:30:00Z").toISOString()}},{advertise_id : 1},function(err2 , ad24historyDatas)
                                {
                                    if(err2)
                                    {
                                        console.log("-----point_calculation_func :Ad_show_history: 24-HISTORY   error ----"+err2)
                                        logger.error("-----point_calculation_func :Ad_show_history: 24-HISTORY   error ----"+err2)
                                    }
                                    else
                                    {
                                        let all_ids = []
                                        old_hisotry_id.forEach(element =>
                                        {
                                            all_ids.push(element._id)
                                        })
                                        ad24historyDatas.forEach(element =>
                                        {
                                            all_ids.push(element.advertise_id)
                                        })
                                        point_calculation_func_part3(all_ids , ad24historyDatas , useelement._id , day_i)
                                    }
                                })
                            }
                            else// History Data is not existed it means new user.
                            {
                                
                                old_hisotry_id = allAdvertiseData
                                Ad_show_history.find({nuser_id : ObjectID(useelement._id) , is_status : 1 ,"cdate" : { $lt: new Date(day_today+"T18:29:59Z").toISOString(), $gte: new Date(day_yesterday+"T18:30:00Z").toISOString()}},{advertise_id : 1},function(err , ad24historyDatas)
                                {
                                    if(err2)
                                    {
                                        console.log("-----point_calculation_func :Ad_show_history: 24-HISTORY   error ----"+err2)
                                        logger.error("-----point_calculation_func :Ad_show_history: 24-HISTORY   error ----"+err2)
                                    }
                                    else
                                    {
                                        let all_ids = []
                                        old_hisotry_id.forEach(element =>
                                        {
                                            all_ids.push(element._id)
                                        })
                                        ad24historyDatas.forEach(element =>
                                        {
                                            all_ids.push(element.advertise_id)
                                        })
                                        point_calculation_func_part3(all_ids , ad24historyDatas , useelement._id , day_i)
                                    }
                                })
                            }
                        }                      
                    })
                })
            
        }
    })
}

function point_calculation_func_part3(all_ids , adhistoryDatas , useelement , day_i)
{

    AdMaster.find({ _id : {$in : all_ids.map(ObjectID)}},{_id : 1},function(err3,adshowData)
        {
                                                                       //let custome_admaster = []
                                                                       let total_viewd = 0
                                                                       adshowData.forEach(element =>
                                                                           {
                                                                               for(var element_2 of adhistoryDatas)
                                                                               {
                                                                                    if((element_2.advertise_id).equals(element._id))
                                                                                    {
                                                                                        total_viewd = total_viewd + 1 ; 
                                                                                        break
                                                                                    }
                                                                               }
                                                                           })
                                                                       
                                                                           
                                                                           let total_ads = adshowData.length
                                                                           let percent = (total_viewd * 100 )/ total_ads
                                                                           if(total_ads == 0)
                                                                           percent = 100
      
                                                                           let target_history = new Target_History({
                                                                              nuser_id :useelement,
                                                                              achive_target :percent,
                                                                              total_ads :total_ads,
                                                                              total_viewed_ads : total_viewd,
                                                                              is_temp_paid : false,
                                                                              is_final_paid: false,
                                                                              target_date : day_i,
                                                                              cdate: new Date()
                                                                           })
                                                                           target_history.save(function(err , targ)
                                                                           {
                                                                               if(err)
                                                                               {
                                                                                   //console.log(" Target History error"+target_history+" "+err)
                                                                                   logger.error("-----point_calculation_func_part3 :target_history: Saveing   error ----"+err)
                                                                                   logger.error("-----point_calculation_func_part3 :target_history: Saveing   user ----"+useelement)
                                                                               }
                                                                               else
                                                                               {
                                                                                   //console.log("target History saved")
                                                                                   //console.log('-date-'+new Date())
                                                                                   logger.info('TargetSaved for user :-'+useelement)
                                                                               }
                                                                           })
                                                                           
                                                                   }).sort(
                                                                   { 
                                                                       "adtype_id" : 1
                                                                   })
}
//exports.point
// Temparary points 
function start_provide_downlinepoint_temp(ddt)//exports.update_downline_temp = function(req , res)
{

   // let ddt =  req.body.date

    console.log('Payment send cron start');
    var day_i=dateFormat(new Date(ddt), "yyyymmdd");
    var day_yesterday=dateFormat(new Date(new Date().setDate(new Date(ddt).getDate()-1)), "yyyy-mm-dd");
    var day_today=dateFormat(new Date(new Date().setDate(new Date(ddt).getDate())), "yyyy-mm-dd");

    console.log(day_i)
    console.log(day_yesterday)
    console.log(day_today)
    //return res.send({test :0})

    // only who dont get point ...
    Target_History.find({target_date : day_i ,is_temp_paid : false},function(err , target_achive_usersData)
    {
        if(err)
        {
            logger.error('start_provide_downlinepoint_temp : Target_History line error - :'+err);
        }
        else
        {

            if(target_achive_usersData.length > 0)
            {

                console.log(target_achive_usersData.length)
                let user_ids_target = []
                let user_ids_below =[]
                let user_ids_all = []
                target_achive_usersData.forEach(element =>
                    {
                        user_ids_all.push(element.nuser_id)
    
                        if(element.achive_target >= 100)
                            user_ids_target.push(element.nuser_id)
                        else
                            user_ids_below.push(element.nuser_id)
                    })
    
                    logger.error('start_provide_downlinepoint_temp : Target_History  : user_ids_all :'+user_ids_all.length);
                    logger.error('start_provide_downlinepoint_temp : Target_History  : user_ids_below :'+user_ids_below.length);
                    logger.error('start_provide_downlinepoint_temp : Target_History  : user_ids_target:'+user_ids_target.length);
                   // logger.error('start_provide_downlinepoint_temp : Target_History  : user_ids_target:'+user_ids_target);
                   // console.log(user_ids_target)

                   // return ;

             /*   // all user 
                NUserWallet.find({user_id : {$in : user_ids_all.map(ObjectID)},wallet_type : 1 , details_type : 2 , ispoint_temp : 1 ,
                "cdate" : { $lt: new Date(day_today+"T18:29:59Z").toISOString(), $gte: new Date(day_yesterday+"T18:30:00Z").toISOString()}},function(err , wallet_data)
                {
                    if(err)
                    {
                        logger.error('start_provide_downlinepoint_temp : NUserWallet line error - in get all :'+err);
                    }
                    else
                    {
                        console.log('wallet_data :-'+wallet_data.length)
                        let history_ids = []
                        wallet_data.forEach(element =>
                          {
                              history_ids.push(element.details_id)
                          })// Get all enduser which is 
    
    */
                        NUserWallet.updateMany({user_id : {$in : user_ids_target.map(ObjectID)},wallet_type : 1 , details_type : 2 , ispoint_temp : 1,
                        "cdate" : { $lt: new Date(day_today+"T18:29:59Z").toISOString(), $gte: new Date(day_yesterday+"T18:30:00Z").toISOString()}},{$set :{ispoint_temp : 2}},function(err , dataupdated)
                        {
                            if(err){
                                logger.error('start_provide_downlinepoint_temp : NUserWallet line error - in only target Achive :'+err);
                            }
                            else
                            {
                                
                              console.log(dataupdated.modifiedCount+ " document(s) updated");
    
                              // Rejected for user
                              NUserWallet.updateMany({user_id : {$in : user_ids_below.map(ObjectID)},wallet_type : 1 , details_type : 2 , ispoint_temp : 1 ,"cdate" :
                               { $lt: new Date(day_today+"T18:29:59Z").toISOString(), $gte: new Date(day_yesterday+"T18:30:00Z").toISOString()}},{$set :{ispoint_temp : 3}},function(err , dataupdated1)
                              {
                                  if(err){
                                    logger.error('start_provide_downlinepoint_temp : NUserWallet line error - in target not Achive :'+err);
                                  }
                                  else
                                  {
                                      console.log(dataupdated1 + " document(s) updated");
                                     /* Ad_show_history.updateMany({_id : {$in : history_ids.map(ObjectID)},is_team_paid : false},{$set :{is_team_paid : true}},function(err,adhistory_update){
                                          if(err)
                                          {
                                            logger.error('start_provide_downlinepoint_temp : Ad_show_history line error - in update is_team_paid true :'+err);
                                          }
                                          else
                                          {
                                              console.log(adhistory_update.modifiedCount+" Document updated")
                                              logger.info('Temparary point credited :'+adhistory_update);
                                          }
                                      })*/
                                      Target_History.updateMany({nuser_id : {$in : user_ids_all.map(ObjectID)},target_date : day_i ,is_temp_paid : false},{$set :{is_temp_paid : true}},function(err,adhistory_update){
                                        if(err)
                                        {
                                          logger.error('start_provide_downlinepoint_temp : Target_History line error - in update is_team_paid true :'+err);
                                        }
                                        else
                                        {
                                            console.log(adhistory_update+" Document updated")
                                            logger.info('Temparary point credited :'+adhistory_update);
                                        }
                                    })
                                      
                                  }
                                      
                              })
                            }
                              
                        })
                   /* }
                })*/
            }
            else
            {
                logger.error('start_provide_downlinepoint_temp : Target_History  : target_achive_usersData - all user temppoint credited :'+target_achive_usersData.length);
            }
        
        }
    })
    console.log('Payment send cron finish');
}
function start_final_point_credit_part1 (ddt)//exports.final_point_credit_part1 = function(req , res)
{
    
    //let ddt = req.body.date

    console.log('Payment point Start');
    var day_i=dateFormat(new Date(ddt), "yyyymmdd");
    var day_yesterday=dateFormat(new Date(new Date().setDate(new Date(ddt).getDate()-1)), "yyyy-mm-dd");
    var day_today=dateFormat(new Date(new Date().setDate(new Date(ddt).getDate())), "yyyy-mm-dd");

    Target_History.find({target_date : day_i ,is_temp_paid : true , is_final_paid : false},{nuser_id : 1},function(err , target_achive_usersData)
    {
        if(err)
        {
            logger.error('start_final_point_credit_part1 :  Target_History error -- :'+err);
        }
        else
        {
            logger.info('start_final_point_credit_part1 :  target_achive_usersData Lenth -- :'+target_achive_usersData.length);
            if(target_achive_usersData)
            {
                let user_ids = []
                target_achive_usersData.forEach(element =>
                    {
                        user_ids.push(element.nuser_id)
                    })
                
                NUserWallet.aggregate([
                    { 
                        "$match" : {
                            "wallet_type" : 1, 
                            "details_type" : 2, 
                            "ispoint_temp" : 2,
                            "user_id": {$in : user_ids.map(ObjectID)}, 
                            "cdate" : { $lt: new Date(day_today+"T18:29:59Z"), $gte: new Date(day_yesterday+"T18:30:00Z")}
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
                    if(err)
                    logger.error('start_final_point_credit_part1 :  NUserWallet error in Save-- :'+err);
                    else
                    {
                        logger.info('start_final_point_credit_part1 :  NUserWallet result_data Lenth-- :'+result_data);
                        final_point_credit_part2(result_data , ddt , user_ids);
                        //user_ids
                    }
                    
                })
            }
            else
            {
                
            }
        }
    })
    console.log('Payment point Finish');
}
function final_point_credit_part2 (result_data , cdate , user_ids)
{
  let data_leth = result_data.length
    var day_today=dateFormat(new Date(new Date().setDate(new Date(cdate).getDate())), "yyyy-mm-dd");
    var day_i=dateFormat(new Date(new Date().setDate(new Date(cdate).getDate())), "yyyymmdd");
    for(let i = 0 ; i< data_leth ; i = i + 1)
    {
        Nuser.findOneAndUpdate({_id : result_data[i]._id} , {$inc : {point_balance : result_data[i].total_point}}, function(err , update_usertable)
        {
            if(err)
            {
                console.log(err+'-- Update problem in NUsers table  --'+result_data[i].user_id)
                logger.error('final_point_credit_part2 :  Nuser error Update problem in NUsers table -- :'+err);
            }
            else
            {
                let total_p = (update_usertable.point_balance + result_data[i].total_point)

                logger.info('final_point_credit_part2 :  Nuser Update problem in NUsers table -- point is -:'+result_data[i].total_point+"  user id --"+result_data[i]._id);
                

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

    Target_History.updateMany({nuser_id : {$in : user_ids.map(ObjectID)},target_date : day_i ,is_final_paid : false},{$set :{is_final_paid : true}},function(err,adhistory_update){
        if(err)
        {
          logger.error('final_point_credit_part2 : Target_History line error - in update is_final_paid true :'+err);
        }
        else
        {
            console.log(adhistory_update+" Document updated")
            logger.info(' Final Balance Credited Indicator :'+adhistory_update);
        }
    })
}
function make_live_ads()//exports.live_ads = function(req , res)
{
    let vdate = new Date();
    AdMaster.updateMany({is_approve : 1 , is_status : 0},{$set :{is_status : 1 , udate: vdate}},function(err , advertise_put_live){
    if(err)
    {
        console.log(err+'push to advertise live Error-- '+vdate)
        logger.error('push to advertise live -- :'+vdate);
    }
    else
    {
        console.log('push to advertise live -- '+vdate)
        logger.info('push to advertise live -- :'+vdate);
    }
})
}

function contains(arr, key, val) {
    
    for(var element  of arr)
    {
        if((element[key]).equals(val))
        return true
    }
    return false;
}